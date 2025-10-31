import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import "dotenv/config";
import {
  validNoteName,
  excludedNames,
  unsavableNames,
} from "./shared_modules/validNoteName.js";
import { getTitle } from "./shared_modules/removeMD.js";
import Fuse from "fuse.js";
import {
  astFromMarkdown,
  MDASTERQueryInstruction,
  queryAST,
} from "./shared_modules/mdast_traversal.js";
import cookieParser from "cookie-parser";
import AdmZip from "adm-zip";
import { parseReference } from "./shared_modules/parse_ref.js";
import duai from "./shared_modules/duai.js";

// Environment variables
const PORT_NUMBER = parseInt(process.env.PORT_NUMBER);
const MONGODB_PORT = process.env.MONGODB_PORT;
const MONGODB_DB = process.env.MONGODB_DB;
const SUPER_USER = process.env.SUPER_USER;
// const SUPER_USER = "tester@gmail.com";

async function getFamilyOneWay(bookName, direction, user) {
  const response = new Set();
  const branch = (await Item.findOne({ user, name: bookName }))[direction];

  if (branch.length === 0) {
    return response;
  }

  for (const member of branch) {
    response.add(member);
    const memberFamily = await getFamilyOneWay(member, direction, user);
    memberFamily.forEach((m) => response.add(m));
  }

  return response;
}

// you can't nest notebook `1` into `2` if `2` is a descendant of `1` or if `1` is already nested in `2`
// essentially, the "family" of notebook `1` cannot contain `2`
async function getFamily(bookName, user) {
  const item = await Item.findOne({ user, name: bookName });
  if (!item) {
    return [];
  }
  const ancestors = item["parents"];
  const descendants = await getFamilyOneWay(bookName, "children", user);
  const response = [...ancestors, ...descendants];
  return response;
}

// the "__god" notebook is intended to store various information about a user
// However, right now it is only used for storing which images belong to the user
// if there is NO callback function provided as the 2nd parameter, this function returns the content of the "__god" notebooks
// If there IS a callback function passed in, then the parsed JSON stored in "__god" is passed into the callback function
// That callback function is responsible for modifying that object in place
async function god(user, callback) {
  const item = await Item.findOne({ user, name: "__god" });
  let json;
  if (item) {
    try {
      json = JSON.parse(item.content[0]);
    } catch (err) {
      json = {};
    }
  } else {
    json = {};
  }
  if (callback) {
    callback(json);
    if (item) {
      item.content = [JSON.stringify(json)];
      await item.save();
    } else {
      const newItem = new Item({
        user: user,
        name: "__god",
        content: [JSON.stringify(json)],
        isEncrypted: false,
        date: Date.now(),
      });
      await newItem.save();
    }
  } else {
    return json;
  }
}

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    }
  },
});

const mongoURI = `mongodb://localhost:${MONGODB_PORT}/${MONGODB_DB}`;
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    throw new Error("MongoDB connection error:", err);
  });

const Item = mongoose.model("Item", {
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  content: {
    type: [String],
    validate: {
      validator: (arr) => {
        return arr.length > 0;
      },
      message: "Content cannot be an empty array",
    },
  },
  children: {
    type: [String],
    default: [],
  },
  parents: {
    type: [String],
    default: [],
  },
  date: {
    type: Number,
    default: Date.now(),
  },
  isEncrypted: {
    type: Boolean,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});

async function onRestart() {
  const users = await Item.find().distinct("user");
  fs.readdir("./public/uploads", async (err, files) => {
    // we have the list of files from the drive
    // loop through each user
    for (const user of users) {
      await god(user, (json) => {
        let newJson = [];
        // set up an empty array to become their new owned image list for that user
        if (json.uploads) {
          for (const image of json.uploads) {
            // for each image in their current owned image list, check if our list of files includes it (it actually exists on the drive)
            if (files.includes(image)) {
              // if it does exist on the drive push it to the new json
              // i know its not actually json its technically an object but this makes sense to me so I use this convention for the `god` function
              newJson.push(image);
            } else {
              console.log(`Phantom image: ${image} owned by ${user}`);
            }
          }
          // set the user's uploaded image list to the new one. If every image they had existed on the drive, nothing has changed
          json.uploads = newJson;
        }
      });
    }
  });
}

await onRestart();

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.cookies && req.cookies.CF_Authorization) {
    req.__user = JSON.parse(
      atob(req.cookies.CF_Authorization.split(".")[1]),
    ).email;
  } else {
    req.__user = SUPER_USER;
  }
  next();
});
app.set("view engine", "ejs");
app.get("/api/get/family/:book", async (req, res) => {
  const fam = await getFamily(req.params.book, req.__user);
  res.status(200).json({ data: fam });
});

app.get("/api/", (req, res) => {
  res.status(200).json({
    get: [
      "/api/get/list",
      "/api/get/image-list",
      "/api/get/notebooks/:name",
      "/api/get/family/:book",
      "/api/get/flashcards",
      "/api/get/users",
      "/api/get/published",
      "/api/get/fdg",
      "/api/get/fuzzy/:term",
      "/api/export/?name=[*]&removeFirstLine=[true/*]&downloadAll=[true/*]",
      "/api/get/tagged/:tag",
      "/api/get/tags/",
      "/api/get/snippets",
      "/api/heartbeat",
    ],
    patch: [
      "/api/nest/:child/:parent",
      "/api/relinquish/:child/:parent",
      "/api/rename/:name/:newName",
      "/api/publish/:name",
      "/api/unpublish/:name",
    ],
    put: ["/api/save/notebooks/:name"],
    delete: ["/api/delete/notebooks/:name", "/api/delete/images/:name"],
    post: ["/api/save/images", "/api/query"],
  });
});

app.get("/api/heartbeat", async (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/get/snippets", async (req, res) => {
  try {
    const snippets = await Item.findOne({ user: req.__user, name: "snippets" });
    if (snippets) {
      res.status(200).json({ data: snippets.content });
    } else {
      res.status(200).json({ data: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get/tags", async (req, res) => {
  try {
    const books = await Item.find({ user: req.__user });
    const response = new Set();
    const regex = /:tag\[.+?\]/;
    for (const book of books) {
      if (book.isEncrypted || excludedNames.includes(book.name)) {
        continue;
      }
      for (let i = 0; i < book.content.length; i++) {
        if (regex.test(book.content[i])) {
          const tags = queryAST(
            astFromMarkdown(book.content[i]),
            new MDASTERQueryInstruction()
              .filterMulti(["type", "name"], ["textDirective", "tag"])
              .finalize(),
          );
          if (tags.matchingNodes.length > 0) {
            response.add(tags.matchingNodes[0].children[0].value);
          }
        }
      }
    }
    res.status(200).json({ data: Array.from(response) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get/tagged/:tag", async (req, res) => {
  try {
    const tag = req.params.tag;
    const books = await Item.find({ user: req.__user });
    const response = [];
    const regex = /:tag\[.+?\]/;
    for (const book of books) {
      if (book.isEncrypted || excludedNames.includes(book.name)) {
        continue;
      }
      for (let i = 0; i < book.content.length; i++) {
        if (regex.test(book.content[i])) {
          const tags = queryAST(
            astFromMarkdown(book.content[i]),
            new MDASTERQueryInstruction()
              .filterMulti(["type", "name"], ["textDirective", "tag"])
              .filterMulti(["type", "value"], ["text", tag])
              .finalize(),
          );
          if (tags.matchingNodes.length > 0) {
            response.push({
              name: book.name,
              page: i + 1,
            });
          }
        }
      }
    }
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get/users", async (req, res) => {
  try {
    const books = await Item.find();
    const users = await Item.find().distinct("user");
    const response = [];

    for (const user of users) {
      const configBook = books.filter(
        (book) => book.name === "user__config" && book.user === user,
      );
      let userSettings = {};
      if (configBook.length > 0) {
        const codeBlock = queryAST(
          astFromMarkdown(configBook[0].content[0]),
          new MDASTERQueryInstruction()
            .filterMulti(
              ["type", "lang"],
              [["code"], ["js", "javascript", "json"]],
            )
            .finalize(),
        );
        if (codeBlock) {
          try {
            const obj = JSON.parse(codeBlock.matchingNodes[0].value);
            if (obj.pfp) {
              userSettings.pfp = obj.pfp;
            }
            if (obj.bio) {
              userSettings.bio = obj.bio;
            }
            if (obj.nickname) {
              userSettings.nickname = obj.nickname;
            }
          } catch (err) {}
        }
      }
      response.push({
        email: user,
        notebooks: books.filter(
          (e) => e.user === user && !excludedNames.includes(e.name),
        ).length,
        settings: userSettings,
      });
    }

    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/export/", async (req, res) => {
  try {
    const name = req.query.name;
    const fixTitles = req.query.removeFirstLine;
    const all = req.query.downloadAll;
    const refReg = /:ref\[(.+?)\]/g;
    const tagReg = /:tag\[(.+?)\]/g;
    let notebooks;
    let unzippedFolder;
    if (all && all.toLowerCase() === "true") {
      notebooks = await Item.find({ user: req.__user });
      unzippedFolder = `./export/${req.__user.substring(
        0,
        req.__user.indexOf("@") === -1
          ? req.__user.length
          : req.__user.indexOf("@"),
      )}'s Notes`;
    } else {
      notebooks = await Item.find({ user: req.__user, name: name });
      unzippedFolder = `./export/${name}`;
    }

    const booksToZip = [];

    fs.mkdirSync(unzippedFolder, { recursive: true });
    for (const notebook of notebooks) {
      if (notebook.isEncrypted || excludedNames.includes(notebook.name)) {
        continue;
      }

      const pages = [];

      for (let i = 0; i < notebook.content.length; i++) {
        let possibleName = getTitle(notebook.content[i]);
        if (!possibleName || possibleName.length > 100) {
          possibleName = `Page ${i}`;
        }

        let snippet;
        if (fixTitles && fixTitles.toLowerCase() === "true") {
          snippet = notebook.content[i].split("\n");
          snippet.shift();
          while (snippet[0] !== undefined && snippet[0] === "") {
            snippet.shift();
          }
        } else {
          snippet = notebook.content[i].split("\n");
        }

        pages.push({
          title: possibleName.replace(/[/\\?%*:|"<>]/g, "-"),
          md: snippet.join("\n"),
        });
      }

      booksToZip.push({
        name: notebook.name,
        pages,
      });
    }

    if (booksToZip.length === 0) {
      fs.rmSync(unzippedFolder, { recursive: true, force: true });
      return res.status(400).json({
        error: "Request parameters result in 0 notebooks being exported",
      });
    }

    booksToZip.forEach(({ name, pages }) => {
      const notebookDir = `${unzippedFolder}/${name}`;
      fs.mkdirSync(notebookDir, { recursive: true });
      pages.forEach((page) => {
        fs.writeFileSync(
          `${notebookDir}/${page.title}.md`,
          // Change `:ref[book:page|title]` to `[[book/path-to-page|title]]`
          page.md
            .replace(refReg, (m, s) => {
              let raw = "[[";
              const ref = parseReference(s);
              if (!ref.name) {
                return "[[]]";
              }
              raw += ref.name;
              ref.page = ref.page || 1;
              const foundBook = booksToZip.find((e) => e.name === ref.name);
              if (
                foundBook &&
                foundBook.pages &&
                foundBook.pages[ref.page - 1]
              ) {
                raw += `/${foundBook.pages[ref.page - 1].title}`;
              }
              if (ref.title) {
                raw += `|${ref.title}`;
              }
              return raw + "]]";
            })
            .replace(tagReg, (m, s) => {
              return `#${s}`;
            }),
        );
      });
    });

    fs.mkdirSync(`${unzippedFolder}/uploads`, { recursive: true });

    // Entire uploads folder is downloaded, including images that other users uploaded
    fs.cpSync("./public/uploads", `${unzippedFolder}/uploads`, {
      recursive: true,
    });
    const zippedFolder = `${unzippedFolder}.zip`;

    const zip = new AdmZip();
    zip.addLocalFolder(unzippedFolder);
    zip.writeZip(zippedFolder);
    const file = fs.realpathSync(zippedFolder);
    res.download(file, () => {
      fs.rmSync(unzippedFolder, { recursive: true, force: true });
      fs.rmSync(file, { recursive: true, force: true });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get/fdg", async (req, res) => {
  const result = await Item.find({ user: req.__user });
  const nodes = [];
  const links = [];
  for (const notebook of result) {
    if (!excludedNames.includes(notebook.name)) {
      let score = 10;
      notebook.children.forEach((child) => {
        links.push({
          source: notebook.name,
          target: child,
        });
      });
      score += (await getFamily(notebook.name, req.__user)).length * 2;
      nodes.push({
        id: notebook.name,
        score,
      });
    }
  }
  const data = {
    nodes,
    links,
  };
  res.status(200).render("fdg.ejs", { nodeData: JSON.stringify(data) });
});

app.get("/api/get/notebooks/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const existingItem = await Item.findOne({ user: req.__user, name });
    if (existingItem) {
      res.status(200).json({ data: existingItem });
    } else {
      res.status(404).json({ error: "Item not found with given name" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get/published", async (req, res) => {
  try {
    const response = [];
    const existingItems = await Item.find({ isPublic: true });
    for (const item of existingItems) {
      response.push({
        name: item.name,
        user: item.user,
        content: item.content,
        date: item.date,
      });
    }
    res.status(200).json({ data: response.sort((a, b) => b.date - a.date) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/publish/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const existing = await Item.findOne({ user: req.__user, name });
    if (existing) {
      existing.isPublic = true;
      await existing.save();
      res.status(204).json({ status: "Published" });
    } else {
      res.status(404).json({ error: "Item not found with given name" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/unpublish/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const existing = await Item.findOne({ user: req.__user, name });
    if (existing) {
      existing.isPublic = false;
      await existing.save();
      res.status(204).json({ status: "Unpublished" });
    } else {
      res.status(404).json({ error: "Item not found with given name" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/save/notebooks/:name", async (req, res) => {
  const name = req.params.name;
  // The reason we use the timestamp from the request is because that way, the save date on the server
  // Will be the same as the save date in memory on the client, and won't be behind by the amount of time it takes
  // for the request to get to the server
  const content = req.body.content;
  const isEncrypted = req.body.isEncrypted;
  const timestamp = req.body.timestamp;
  if (content.length === 0) {
    content.push("");
  }
  if (
    !name ||
    !content ||
    unsavableNames.includes(name) ||
    !validNoteName.test(name)
  ) {
    return res.status(400).json({ error: "Malformed request body" });
  }
  try {
    const existingItem = await Item.findOne({ user: req.__user, name });
    if (!existingItem) {
      const newItem = new Item({
        user: req.__user,
        name,
        content,
        isEncrypted: isEncrypted || false,
        date: timestamp,
      });
      await newItem.save();
      res.status(201).json({ status: "Created" });
    } else {
      existingItem.content = content;
      existingItem.date = timestamp;
      existingItem.isEncrypted = isEncrypted || false;
      await existingItem.save();
      res.status(204).json({ status: "Updated" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/delete/images/:name", async (req, res) => {
  try {
    await god(req.__user, (ownedImages) => {
      if (
        !ownedImages.uploads ||
        !ownedImages.uploads.includes(req.params.name)
      ) {
        res.status(403).json({ error: "You don't own this image" });
      } else {
        fs.unlink(`./public/uploads/${req.params.name}`, async (err) => {
          if (err) {
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            ownedImages.uploads = ownedImages.uploads.filter(
              (e) => e !== req.params.name,
            );
            res.status(204).json({ status: "Removed" });
          }
        });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get/image-list/", (req, res) => {
  fs.readdir("./public/uploads", async (err, files) => {
    const ownedImage = await god(req.__user);
    if (ownedImage.uploads) {
      files = files.filter((file) => ownedImage.uploads.includes(file));
    } else {
      files = [];
    }
    res.status(200).json({ data: files });
  });
});

app.post("/api/save/images", upload.single("avatar"), async (req, res) => {
  try {
    const fileName = req.file.path.substring(
      req.file.path.indexOf("/uploads/") + 9,
    );
    await god(req.__user, (json) => {
      if (!json.uploads) {
        json.uploads = [fileName];
      } else {
        json.uploads.push(fileName);
      }
    });
    res.status(201).json({ image: `/uploads/${fileName}` });
  } catch (err) {
    // Idk if the dropzone can check if response is not okay so just send this with this with image key so it doesn't break
    res.status(500).json({ image: err.message });
  }
});

app.post("/api/query/", async (req, res) => {
  if (!req.body.name || req.body.page === undefined || !req.body.instructions) {
    return res.status(400).json({ error: "Malformed request body" });
  }
  const name = req.body.name;
  const pageParam = parseInt(req.body.page);
  const page = pageParam < 0 || isNaN(pageParam) ? 0 : pageParam;

  const book = await Item.findOne({ user: req.__user, name });
  if (!book) {
    return res.status(404).json({ error: "Notebook not found" });
  }
  if (book.isEncrypted) {
    return res
      .status(400)
      .json({ error: "Encrypted notebooks can't be queried" });
  }

  if (page >= book.content.length) {
    return res.status(400).json({ error: "Page out of bounds" });
  }

  const instructions = req.body.instructions;
  if (instructions.length === 0) {
    return res.status(400).json({ error: "Provide at least one instruction" });
  }

  res.status(200).json({
    data: queryAST(astFromMarkdown(book.content[page]), instructions),
  });
});

app.get("/api/get/list/", async (req, res) => {
  let data = [];
  const result = await Item.find({ user: req.__user });
  for (let i = result.length - 1; i >= 0; i--) {
    const notebook = result[i];
    if (!excludedNames.includes(notebook.name)) {
      data.push({
        name: notebook.name,
        excerpt: notebook.content.map((page) => {
          return getTitle(page);
        }),
        children: notebook.children,
        parents: notebook.parents,
        isEncrypted: notebook.isEncrypted,
        date: notebook.date,
      });
    }
  }
  res.status(200).json({ data });
});

app.patch("/api/nest/:child/:parent", async (req, res) => {
  const child = req.params.child;
  const parent = req.params.parent;
  if (!child || !parent || child === parent) {
    return res.status(400).json({
      error: "A unique child and parent are required to nest a notebook",
    });
  }
  if (excludedNames.includes(child) || excludedNames.includes(parent)) {
    return res.status(400).json({
      error: "Special notebooks cannot be nested",
    });
  }
  try {
    const childBook = await Item.findOne({ user: req.__user, name: child });
    const parentBook = await Item.findOne({ user: req.__user, name: parent });
    if (!childBook || !parentBook) {
      res.status(404).json({ error: "Parent or child not found" });
    } else if (childBook && parentBook) {
      const family = await getFamily(child, req.__user);
      if (!family.includes(parent)) {
        parentBook.children.push(child);
        await parentBook.save();

        childBook.parents.push(parent);
        childBook.save();
        res
          .status(204)
          .json({ status: `${child} was nested inside of ${parent}` });
      } else {
        res
          .status(400)
          .json({ error: `${child} is already a descendant of ${parent}` });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/relinquish/:child/:parent", async (req, res) => {
  const child = req.params.child;
  const parent = req.params.parent;
  if (!child || !parent) {
    return res.status(400).json({
      error: "A unique child and parent are required to nest a notebook",
    });
  }
  try {
    const childBook = await Item.findOne({ user: req.__user, name: child });
    const parentBook = await Item.findOne({ user: req.__user, name: parent });
    if (!childBook || !parentBook) {
      res.status(404).json({ error: "Parent or child not found" });
    } else if (parentBook.children.includes(child)) {
      parentBook.children = parentBook.children.filter((e) => e !== child);
      await parentBook.save();

      childBook.parents = childBook.parents.filter((e) => e !== parent);
      await childBook.save();
      res
        .status(204)
        .json({ status: `${child} was relinquished from ${parent}` });
    } else {
      res.status(400).json({ error: `${child} is not a child of ${parent}` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/rename/:name/:newName", async (req, res) => {
  const name = req.params.name;
  const newName = req.params.newName;
  if (!name || !newName || !validNoteName.test(newName)) {
    return res.status(400).json({
      error: "Malformed User Request",
    });
  }
  try {
    const existingName = await Item.findOne({
      user: req.__user,
      name: newName,
    });
    if (existingName) {
      return res
        .status(400)
        .json({ error: "A notebook with that name already exists" });
    }
    const bookToRename = await Item.findOne({ user: req.__user, name });
    if (!bookToRename) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else {
      bookToRename.name = newName;
      await bookToRename.save();

      for (const parent of bookToRename.parents) {
        const parentBook = await Item.findOne({
          user: req.__user,
          name: parent,
        });
        parentBook.children = parentBook.children.map((e) =>
          e === name ? newName : e,
        );
        await parentBook.save();
      }

      for (const child of bookToRename.children) {
        const childBook = await Item.findOne({ user: req.__user, name: child });
        childBook.parents = childBook.parents.map((e) =>
          e === name ? newName : e,
        );
        await childBook.save();
      }

      const flashcards = await Item.findOne({
        user: req.__user,
        name: "flash__cards",
      });
      if (flashcards) {
        const fContent = JSON.parse(flashcards.content[0]);
        flashcards.content = [
          JSON.stringify(
            fContent.map((e) => {
              if (e.subject === name) {
                e.subject = newName;
              }
              return e;
            }),
          ),
        ];
        await flashcards.save();
      }

      res.status(204).json({ status: "Renamed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/:name", (req, res) => {
  res.status(200).render("desktop.ejs");
});

app.get("/", (req, res) => {
  res.status(301).redirect("/home");
});

app.delete("/api/delete/notebooks/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const existingItem = await Item.findOne({ user: req.__user, name });
    if (!existingItem) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else {
      for (const parent of existingItem.parents) {
        const parentBook = await Item.findOne({
          user: req.__user,
          name: parent,
        });
        parentBook.children = parentBook.children.filter((e) => e !== name);
        await parentBook.save();
      }

      for (const child of existingItem.children) {
        const childBook = await Item.findOne({ user: req.__user, name: child });
        childBook.parents = childBook.parents.filter((e) => e !== name);
        await childBook.save();
      }

      const flashcards = await Item.findOne({
        user: req.__user,
        name: "flash__cards",
      });
      if (flashcards) {
        const fContent = JSON.parse(flashcards.content[0]);
        flashcards.content = [
          JSON.stringify(fContent.filter((e) => e.subject !== name)),
        ];
        await flashcards.save();
      }

      await Item.deleteOne({ name }).exec();
      res.status(204).json({ status: "Removed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get/fuzzy/:term/", async (req, res) => {
  const term = req.params.term;
  let books = await Item.find({ user: req.__user });
  books = books.filter(
    (book) => !excludedNames.includes(book.name) && !book.isEncrypted,
  );
  const fuse = new Fuse(books, {
    keys: ["name", "content"],
    threshold: 0.15, // Lower is more strict
    distance: 100,
    ignoreLocation: true,
  });

  res.status(200).json({ data: fuse.search(term) });
});

// Flashcards are just stored as JSON in an inaccessable notebook
// Not the best way to do it, but it works
// We should probably validate the flashcards before sending them to the user
function validateFlashcards(deck) {
  if (!Array.isArray(deck)) {
    return false;
  }
  for (const card of deck) {
    if (typeof card !== "object") {
      return false;
    }
    if (
      card.front === undefined ||
      card.back === undefined ||
      card.subject === undefined ||
      card.id === undefined ||
      card.learning === undefined
    ) {
      return false;
    }
  }
  return true;
}

app.get("/api/get/flashcards", async (req, res) => {
  try {
    const flashcards = await Item.findOne({
      user: req.__user,
      name: "flash__cards",
    });
    if (flashcards) {
      const deck = JSON.parse(flashcards.content[0]);
      if (validateFlashcards(deck)) {
        res.status(200).json({ data: deck });
      } else {
        flashcards.content = ["[]"];
        await flashcards.save();
        res.status(200).json({ data: [] });
      }
    } else {
      res.status(404).json({ error: "Flashcards not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// let generating = false;
app.post("/api/chatgpt", async (req, res) => {
  return res.status(418).json({ error: duai });
});

app.post("/api/ollama", async (req, res) => {
  return res.status(418).json({ error: duai });
});

app.all("*", (req, res) => {
  res.status(404).render("404.ejs");
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
