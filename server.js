import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";
import axios from "axios";
import validNoteName from "./modules/validNoteName.js";
import removeMD from "./modules/removeMD.js";
import Fuse from "fuse.js";

const exludedNames = ["home", "sticky__notes", "todo__list", "flash__cards"];

// Environment variables
const PORT_NUMBER = parseInt(process.env.PORT_NUMBER);
const MONGODB_PORT = process.env.MONGODB_PORT;
const MONGODB_DB = process.env.MONGODB_DB;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHATGPT_MODEL = process.env.CHATGPT_MODEL;
const OLLAMA_URI = process.env.OLLAMA_URI;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

async function getFamilyOneWay(bookName, direction) {
  const response = new Set();
  const branch = (await Item.findOne({ name: bookName }))[direction];

  if (branch.length === 0) {
    return response;
  }

  for (const member of branch) {
    response.add(member);
    const memberFamily = await getFamilyOneWay(member, direction);
    memberFamily.forEach((m) => response.add(m));
  }

  return response;
}

// you can't nest notebook `1` into `2` if `2` is a descendant of `1` or if `1` is already nested in `2`
// essentially, the "family" of notebook `1` cannot contain `2`
async function getFamily(bookName) {
  const item = await Item.findOne({ name: bookName });
  if (!item) {
    return [];
  }
  const ancestors = item["parents"];
  const descendants = await getFamilyOneWay(bookName, "children");
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

app.use(express.static("./public"));

const mongoURI = `mongodb://localhost:${MONGODB_PORT}/${MONGODB_DB}`;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const Item = mongoose.model("Item", {
  name: String,
  content: [String],
  children: [String],
  parents: [String],
  date: String,
  isEncrypted: Boolean,
});

app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/api/get/family/:book", async (req, res) => {
  const fam = await getFamily(req.params.book);
  res.status(200).json({ data: fam });
});

app.get("/api/", async (req, res) => {
  res.status(200).json({ status: "Welcome to the notes API." });
});

app.get("/api/fdg", async (req, res) => {
  const result = await Item.find();
  const nodes = [];
  const links = [];
  for (const notebook of result) {
    if (!exludedNames.includes(notebook.name)) {
      let score = 10;
      notebook.children.forEach((child) => {
        links.push({
          source: notebook.name,
          target: child,
        });
      });
      score += (await getFamily(notebook.name)).length * 2;
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
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      res.status(200).json({ data: existingItem });
    } else {
      res.status(404).json({ error: "Item not found with given name" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/save/notebooks/:name", async (req, res) => {
  const name = req.params.name;
  const { content, date, isEncrypted } = req.body;
  if (content.length === 0) {
    content.push("");
  }
  if (!name || !content || name === "home" || !validNoteName.test(name)) {
    return res.status(400).json({ error: "Malformed request body." });
  }
  try {
    const existingItem = await Item.findOne({ name });
    if (!existingItem) {
      const newItem = new Item({
        name,
        content,
        children: [],
        parents: [],
        date,
        isEncrypted: isEncrypted || false,
      });
      await newItem.save();
      res.status(201).json({ status: "Created" });
    } else if (existingItem.name === name) {
      existingItem.content = content;
      existingItem.date = date;
      existingItem.isEncrypted = isEncrypted || false;
      await existingItem.save();
      res.status(204).json({ status: "Updated" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/delete/images/:name", (req, res) => {
  const itemName = "./public/uploads/" + req.params.name;
  fs.unlink(itemName, (err) => {
    if (err) {
      res.status(500).json({ status: "Internal Server Error" });
    } else {
      res.status(204).json({ status: "Removed" });
    }
  });
});

app.get("/api/get/image-list/", async (req, res) => {
  fs.readdir("./public/uploads", (err, files) => {
    res.status(200).json({ data: files });
  });
});

app.post("/api/save/images", upload.single("avatar"), function (req, res) {
  try {
    res.send(req.file.path.slice(req.file.path.indexOf("/")));
  } catch (err) {
    res.status(500).json({ status: "Internal Server Error" });
  }
});

app.get("/api/get/list/", async (req, res) => {
  let data = [];
  // res.status(200).json({ data });return;
  const result = await Item.find();
  // sort array from newest to oldest
  for (let i = result.length - 1; i >= 0; i--) {
    const notebook = result[i];
    if (!exludedNames.includes(notebook.name)) {
      data.push({
        name: notebook.name,
        excerpt: notebook.content.map((page) => {
          return removeMD(page.split("\n")[0]);
        }),
        children: notebook.children,
        parents: notebook.parents,
        isEncrypted: notebook.isEncrypted,
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
    const childBook = await Item.findOne({ name: child });
    const parentBook = await Item.findOne({ name: parent });
    if (!childBook || !parentBook) {
      res.status(404).json({ error: "Parent or child not found" });
    } else if (childBook && parentBook) {
      const family = await getFamily(child);
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
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
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
    const childBook = await Item.findOne({ name: child });
    const parentBook = await Item.findOne({ name: parent });
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
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/rename/:name/:newName", async (req, res) => {
  const name = req.params.name;
  const newName = req.params.newName;
  if (!name || !newName || !validNoteName.test(newName)) {
    return res.status(400).json({
      error: "Malformed User Request.",
    });
  }
  try {
    const existingName = await Item.findOne({ name: newName });
    if (existingName) {
      return res
        .status(400)
        .json({ error: "A book with that name already exists" });
    }
    const bookToRename = await Item.findOne({ name });
    if (!bookToRename) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else if (bookToRename.name === name) {
      bookToRename.name = newName;
      await bookToRename.save();

      for (const parent of bookToRename.parents) {
        const parentBook = await Item.findOne({ name: parent });
        parentBook.children = parentBook.children.map((e) =>
          e === name ? newName : e
        );
        await parentBook.save();
      }

      for (const child of bookToRename.children) {
        const childBook = await Item.findOne({ name: child });
        childBook.parents = childBook.parents.map((e) =>
          e === name ? newName : e
        );
        await childBook.save();
      }

      const flashcards = await Item.findOne({ name: "flash__cards" });
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

      res.status(204).json({ status: "Renamed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:name", async (req, res) => {
  res.status(200).render("desktop.ejs");
});

app.get("/", (req, res) => {
  res.status(301).redirect("/home");
});

app.delete("/api/delete/notebooks/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const existingItem = await Item.findOne({ name });
    if (!existingItem) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else if (existingItem.name === name) {
      for (const parent of existingItem.parents) {
        const parentBook = await Item.findOne({ name: parent });
        parentBook.children = parentBook.children.filter((e) => e !== name);
        await parentBook.save();
      }

      for (const child of existingItem.children) {
        const childBook = await Item.findOne({ name: child });
        childBook.parents = childBook.parents.filter((e) => e !== name);
        await childBook.save();
      }

      const flashcards = await Item.findOne({ name: "flash__cards" });
      const fContent = JSON.parse(flashcards.content[0]);
      flashcards.content = [
        JSON.stringify(fContent.filter((e) => e.subject !== name)),
      ];
      await flashcards.save();

      await Item.deleteOne({ name }).exec();
      res.status(204).json({ status: "Removed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/fuzzy/:term/", async (req, res) => {
  const term = req.params.term;
  let books = await Item.find();
  books = books.filter(
    (book) => !exludedNames.includes(book.name) && !book.isEncrypted
  );
  const fuse = new Fuse(books, {
    keys: ["name", "content"],
    threshold: 0.4,
  });

  res.status(200).json({ data: fuse.search(term) });
});

app.get("/api/get/flashcards", async (req, res) => {
  try {
    const flashcards = await Item.findOne({ name: "flash__cards" });
    if (flashcards) {
      const deck = JSON.parse(flashcards.content[0]);
      res.status(200).json({ data: deck });
    } else {
      res.status(404).json({ error: "Flashcards not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get/todo", async (req, res) => {
  try {
    const todos = await Item.findOne({ name: "todo__list" });
    if (todos) {
      const tasks = {
        current: JSON.parse(todos.content[0]),
        past: JSON.parse(todos.content[1]),
      };
      res.status(200).json({ data: tasks });
    } else {
      res.status(404).json({ error: "Todos not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
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
      res.status(502).json({ error: "ChatGPT API Could not reached" });
    }
    generating = false;
  } else {
    res
      .status(503)
      .json({ error: "An AI response is currently being generated." });
  }
});

app.post("/api/ollama", async (req, res) => {
  if (!generating) {
    generating = true;
    try {
      const response = await axios.post(
        `${OLLAMA_URI}/api/generate`,
        {
          model: OLLAMA_MODEL,
          system: req.body.content,
          prompt: req.body.prompt,
          stream: false,
          temperature: 0.0,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      res.status(200).json({ data: response.data.response });
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: "Ollama API Could not be reached" });
    }
    generating = false;
  } else {
    res
      .status(503)
      .json({ error: "An AI response is currently being generated." });
  }
});

app.all("*", (req, res) => {
  res.status(404).render("404.ejs");
});

app.listen(PORT_NUMBER, () => {
  console.log("Server is running on port " + PORT_NUMBER);
});
