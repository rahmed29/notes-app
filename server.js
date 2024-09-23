import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";
import validNoteName from "./shared_modules/validNoteName.js";
import removeMD from "./shared_modules/removeMD.js";
import Fuse from "fuse.js";
import {
  astFromMarkdown,
  MDASTERQueryInstruction,
  queryAST,
} from "./shared_modules/mdast_traversal.js";
import cookieParser from "cookie-parser";

// These are notebooks that shouldn't be included creating the list, or the FDG
// Most of these are uneditable by the user on the frontend, but some can be edited, like the user settings.
// The `user__config` provides a way for the user to edit their settings by just editing a notebook
const excludedNames = ["sticky__notes", "flash__cards", "user__config"];

const unsavableNames = [
  "home",
  "AI-Summary",
  "Your-Uploads",
  "Note-Map",
  "Shared-Notebook",
];

// Environment variables
const PORT_NUMBER = parseInt(process.env.PORT_NUMBER);
const MONGODB_PORT = process.env.MONGODB_PORT;
const MONGODB_DB = process.env.MONGODB_DB;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHATGPT_MODEL = process.env.CHATGPT_MODEL;
const OLLAMA_URI = process.env.OLLAMA_URI;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

// The super user is the user that will be used if there is no CF access token (not being accessed through CloudFlare tunnel)
// This is so I can still access my notes from my LAN
// There is not authentication when accessing from LAN

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

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function gpt(content, prompt) {
  const completion = await openai.chat.completions.create({
    model: CHATGPT_MODEL,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content,
      },
    ],
    temperature: 0,
  });

  return completion.choices[0].message.content;
}

const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    }
  },
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

const mongoURI = `mongodb://localhost:${MONGODB_PORT}/${MONGODB_DB}`;
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(async (req, res, next) => {
  if (req.cookies && req.cookies.CF_Authorization) {
    req.__user = JSON.parse(
      atob(req.cookies.CF_Authorization.split(".")[1])
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

// app.get("/api/fixdb", async (req, res) => {
//  const items = await Item.find();
//  const response = [];
//  for (const item of items) {
//    try {
//      await item.save();
//    } catch (err) {
//      response.push([item.name, err]);
//    }
//  }
//  res.status(200).json({ status: response });
//});

app.get("/api/", (req, res) => {
  res.status(200).json({
    get: [
      "/api/get/list",
      "/api/get/image-list",
      "/api/get/notebooks/:name",
      "/api/get/flashcards",
      "/api/get/users",
      "/api/get/published",
      "/api/fdg",
      "/api/fuzzy/:term",
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
    post: ["/api/save/images", "/api/chatgpt", "/api/ollama", "/api/query"],
  });
});

app.get("/api/get/users", async (req, res) => {
  try {
    const books = await Item.find();
    const users = await Item.find().distinct("user");
    const response = [];

    for (const user of users) {
      const configBook = books.filter(
        (book) => book.name === "user__config" && book.user === user
      );
      let userSettings = {};
      if (configBook.length > 0) {
        const codeBlock = queryAST(
          astFromMarkdown(configBook[0].content[0]),
          new MDASTERQueryInstruction()
            .filter("lang", ["js", "javascript", "json"])
            .export()
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
          (e) => e.user === user && !excludedNames.includes(e.name)
        ).length,
        settings: userSettings,
      });
    }

    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/fdg", async (req, res) => {
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
  const { content, isEncrypted } = req.body;
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
      });
      await newItem.save();
      res.status(201).json({ status: "Created" });
    } else if (existingItem.name === name) {
      existingItem.content = content;
      existingItem.date = Date.now();
      existingItem.isEncrypted = isEncrypted || false;
      await existingItem.save();
      res.status(204).json({ status: "Updated" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/delete/images/:name", (req, res) => {
  if (req.__user !== SUPER_USER) {
    return res
      .status(403)
      .json({ status: "As of now, only the super user can delete images" });
  }
  const itemName = "./public/uploads/" + req.params.name;
  fs.unlink(itemName, (err) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(204).json({ status: "Removed" });
    }
  });
});

app.get("/api/get/image-list/", (req, res) => {
  fs.readdir("./public/uploads", (err, files) => {
    res.status(200).json({ data: files });
  });
});

app.post("/api/save/images", upload.single("avatar"), function (req, res) {
  try {
    res
      .status(201)
      .json({ image: req.file.path.slice(req.file.path.indexOf("/")) });
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
  const page = pageParam < 0 ? 0 : pageParam;

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
          return removeMD(page.split("\n")[0]);
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
        .json({ error: "A book with that name already exists" });
    }
    const bookToRename = await Item.findOne({ user: req.__user, name });
    if (!bookToRename) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else if (bookToRename.name === name) {
      bookToRename.name = newName;
      await bookToRename.save();

      for (const parent of bookToRename.parents) {
        const parentBook = await Item.findOne({
          user: req.__user,
          name: parent,
        });
        parentBook.children = parentBook.children.map((e) =>
          e === name ? newName : e
        );
        await parentBook.save();
      }

      for (const child of bookToRename.children) {
        const childBook = await Item.findOne({ user: req.__user, name: child });
        childBook.parents = childBook.parents.map((e) =>
          e === name ? newName : e
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
            })
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
  console.log(req.__user);
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
    } else if (existingItem.name === name) {
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

app.get("/api/fuzzy/:term/", async (req, res) => {
  const term = req.params.term;
  let books = await Item.find({ user: req.__user });
  books = books.filter(
    (book) => !excludedNames.includes(book.name) && !book.isEncrypted
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

let generating = false;
app.post("/api/chatgpt", async (req, res) => {
  if (!generating) {
    generating = true;
    try {
      const response = await gpt(req.body.content, req.body.prompt);
      res.status(200).json({ data: response });
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
    generating = false;
  } else {
    res
      .status(503)
      .json({ error: "An AI response is currently being generated" });
  }
});

app.post("/api/ollama", async (req, res) => {
  if (req.__user !== SUPER_USER) {
    return res
      .status(403)
      .json({ error: "As of now, only the super user can use Ollama" });
  }
  if (!generating) {
    generating = true;
    try {
      const response = await fetch(`${OLLAMA_URI}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          system: req.body.content,
          prompt: req.body.prompt,
          stream: false,
          temperature: 0.0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        res.status(200).json({ data: data.response });
      } else {
        res.status(502).json({ error: "Ollama API could not be reached" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err.message });
    }
    generating = false;
  } else {
    res
      .status(503)
      .json({ error: "An AI response is currently being generated" });
  }
});

app.all("*", (req, res) => {
  res.status(404).render("404.ejs");
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
