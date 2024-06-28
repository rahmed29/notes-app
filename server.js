import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";
import axios from "axios";
import validNoteName from "./validNoteName.js";
// Environment variables
// OPENAI_API_KEY=""
// OLLAMA_URI=""
// OLLAMA_MODEL=""

async function getFamilyOneWay(bookName, direction) {
  const response = new Set();
  const branch = (await Item.findOne({ name: bookName }))[direction] || [];

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

async function getFamily(bookName) {
  const ancestors = (await Item.findOne({ name: bookName }))["parents"] || [];
  const descendants = (await getFamilyOneWay(bookName, "children")) || [];
  const response = [...ancestors, ...descendants];
  return response;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function gpt(content, prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
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
const port = 5556;

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

const mongoURI = "mongodb://localhost:27017/rop";
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

// app.get("/api/fixdb", async (req, res) => {
//   try {
//     const result = await Item.find();
//     result.forEach(async (notebook) => {
//         notebook.isEncrypted = false;
//         await notebook.save();
//     })
//     res.status(500).json({ status: "Complete" });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.get("/api/get/family/:book", async (req, res) => {
  const fam = await getFamily(req.params.book);
  res.status(200).json({ data: fam });
});

app.get("/api/", async (req, res) => {
  res.status(200).json({ status: "Welcome to the notes API." });
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
  const result = await Item.find();
  // sort array from newest to oldest
  for (let i = result.length - 1; i >= 0; i--) {
    const notebook = result[i];
    if (
      notebook.name !== "sticky__notes" &&
      notebook.name !== "todo__list" &&
      notebook.name !== "flash__cards"
    ) {
      data.push({
        name: notebook.name,
        excerpt: notebook.content.map((page) => {
          return page.split("\n")[0];
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
        const children = parentBook.children;
        children.push(child);
        parentBook.children = children;
        await parentBook.save();
        const parents = childBook.parents;
        parents.push(parent);
        childBook.parents = parents;
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
      const children = parentBook.children.filter((e) => e !== child);
      parentBook.children = children;
      await parentBook.save();
      const parents = childBook.parents.filter((e) => e !== parent);
      childBook.parents = parents;
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

app.get("/:name", async (req, res) => {
  res.status(200);
  res.render("desktop.ejs");
});

app.get("/", (req, res) => {
  res.status(301);
  res.redirect("/home");
});

app.delete("/api/delete/notebooks/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const existingItem = await Item.findOne({ name });
    if (!existingItem) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else if (existingItem.name === name) {
      const parents = existingItem.parents;
      parents.forEach(async (parent) => {
        const parentBook = await Item.findOne({ name: parent });
        const family = parentBook.children.filter((e) => e !== name);
        parentBook.children = family;
        await parentBook.save();
      });
      const children = existingItem.children;
      children.forEach(async (child) => {
        const childBook = await Item.findOne({ name: child });
        const parents = childBook.parents.filter((e) => e !== name);
        childBook.parents = parents;
        await childBook.save();
      });

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
        `${process.env.OLLAMA_URI}/api/generate`,
        {
          model: process.env.OLLAMA_MODEL,
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
  res.status(404);
  res.render("404.ejs");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
