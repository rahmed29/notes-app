import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function gpt(content) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "TLDR:",
      },
      {
        role: "user",
        content,
      },
    ],
    temperature: 0,
    seed: 111,
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
      file.mimetype == "image/gif" ||
      file.mimetype == "application/pdf"
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

const mongoURI = "mongodb://localhost:27017/notes";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const Item = mongoose.model("Item", {
  name: String,
  content: String,
  children: String,
  parents: String,
  date: String,
  saved: String,
});

app.use(bodyParser.json());
app.set("view engine", "ejs");

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

app.post("/api/save/notebooks", async (req, res) => {
  const { name, content, date } = req.body;
  if (!name || !content || name === "home") {
    return res
      .status(400)
      .json({ error: "Both a name and content are required." });
  }
  try {
    const existingItem = await Item.findOne({ name });
    if (!existingItem) {
      const newItem = new Item({
        name,
        content,
        children: "[]",
        parents: "[]",
        date,
        saved: "saved",
      });
      await newItem.save();
      res.status(201).json({ status: "Created" });
    } else if (existingItem.name === name) {
      existingItem.content = content;
      existingItem.date = date;
      existingItem.saved = "saved";
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

app.post(
  "/api/save/images",
  upload.single("avatar"),
  function (req, res) {
    try {
      res.send(req.file.path.substring(req.file.path.indexOf("/")));
    } catch (err) {
      res.status(500).json({ status: "Internal Server Error" });
    }
  }
);

app.get("/api/get/list/", async (req, res) => {
  let data = [];
  const result = await Item.find();
  result.forEach((notebook) => {
    if (notebook.name !== "sticky__notes" && notebook.name !== "todo__list" && notebook.name !== "flash__cards") {
      let excerpts = [];
      JSON.parse(notebook.content).forEach((page) => {
        const name =
          page.indexOf("\n") === -1
            ? page
            : page.substring(0, page.indexOf("\n"));
        excerpts.push(name);
      });
      data.push({
        name: notebook.name,
        excerpt: excerpts,
        children: JSON.parse(notebook.children),
        parents: JSON.parse(notebook.parents),
      });
    }
  });
  res.status(200).json({ data });
});

async function getAncestors(bookName) {
  let response = new Set();
  const book = await Item.findOne({ name: bookName });
  const parents = JSON.parse(book.parents);

  if (!parents[0]) {
    return response;
  }

  parents.forEach(async (parent) => {
    response.add(parent);
    response = new Set([...response, ...(await getAncestors(parent))]);
  });

  return response;
}

async function getDescendants(bookName) {
  let response = new Set();
  const book = await Item.findOne({ name: bookName });
  const children = JSON.parse(book.children);

  if (!children[0]) {
    return response;
  }

  children.forEach(async (child) => {
    response.add(child);
    response = new Set([...response, ...(await getDescendants(child))]);
  });

  return response;
}

async function getFamily(bookName) {
  const ancestors = await getAncestors(bookName);
  const descendants = await getDescendants(bookName);
  const response = Array.from(ancestors).concat(Array.from(descendants));
  return response;
}

app.post("/api/nest/:child/:parent", async (req, res) => {
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
      const family = await getFamily(parent);
      if (!family.includes(child)) {
        const children = JSON.parse(parentBook.children);
        children.push(child);
        parentBook.children = JSON.stringify(children);
        await parentBook.save();
        const parents = JSON.parse(childBook.parents);
        parents.push(parent);
        childBook.parents = JSON.stringify(parents);
        childBook.save();
        res
          .status(204)
          .json({ status: `${child} was nested inside of ${parent}` });
      } else {
        res
          .status(400)
          .json({ error: `${child} is already related to ${parent}` });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/relinquish/:child/:parent", async (req, res) => {
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
    if (!parentBook) {
      res.status(404).json({ error: "Parent or child not found" });
    } else if (JSON.parse(parentBook.children).includes(child)) {
      const children = JSON.parse(parentBook.children).filter(
        (e) => e !== child
      );
      parentBook.children = JSON.stringify(children);
      await parentBook.save();
      const parents = JSON.parse(childBook.parents).filter((e) => e !== parent);
      childBook.parents = JSON.stringify(parents);
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
  res.render("desktop.ejs");
});

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.delete("/api/delete/notebooks/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const existingItem = await Item.findOne({ name });
    if (!existingItem) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else if (existingItem.name === name) {
      const parents = JSON.parse(existingItem.parents);
      parents.forEach(async (parent) => {
        const parentBook = await Item.findOne({ name: parent });
        const family = JSON.parse(parentBook.children).filter(
          (e) => e !== name
        );
        parentBook.children = JSON.stringify(family);
        await parentBook.save();
      });
      const children = JSON.parse(existingItem.children);
      children.forEach(async (child) => {
        const childBook = await Item.findOne({ name: child });
        const parents = JSON.parse(childBook.parents).filter((e) => e !== name);
        childBook.parents = JSON.stringify(parents);
        await childBook.save();
      });

      const flashcards = await Item.findOne({ name: "flash__cards" });
      const fContent = JSON.parse(flashcards.content)
      flashcards.content = JSON.stringify(fContent.filter((e) => e.subject !== name))
      await flashcards.save();

      await Item.deleteOne({ name }).exec();
      res.status(204).json({ status: "Removed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/chatGPT", async (req, res) => {
  try {
    const content = req.body.content;
    const response = await gpt(content);
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.all("*", (req, res) => {
  res
    .status(404)
    .send(
      "<h1 style = 'text-align: center; font-family: arial; line-height: 100vh;'>404! Page not found</h1>"
    );
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
