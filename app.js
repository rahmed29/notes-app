const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 5556;
const path = require('path')
const multer  = require('multer')
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})

var upload = multer({
  storage: storage,
  limits: { fileSize: 10000000},
  fileFilter: function (req, file, cb) {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/webp' || file.mimetype == 'image/gif') {
        cb(null, true)
    }
  }
});

let quilt = []
fs.readdir("./public", (err, files) => {
  files.forEach(file => {
    quilt.push(file)
  });
});

app.use(express.static('./public'))
app.use('./public', express.static(path.join(__dirname, './public')))

const mongoURI = 'mongodb://localhost:27017/notes';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

const Item = mongoose.model('Item', { name: String, NOTEBOOKSAVEHERE: String});

app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/api/get/notebooks/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      res.status(200).json({ content: existingItem["NOTEBOOKSAVEHERE"] });
    } else {
      res.status(404).json({ error: "Item not found with given name" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
  
  app.post('/api/save/notebooks', async (req, res) => {
    const { name, NOTEBOOKSAVEHERE } = req.body;
    if (!name || !NOTEBOOKSAVEHERE) {
      return res.status(400).json({ error: 'Both name and lastName are required for the update' });
    }
    try {
      const existingItem = await Item.findOne({ name })
      if (!existingItem) {
        const newItem = new Item({ name, NOTEBOOKSAVEHERE });
        await newItem.save()
        res.status(201).json({ status: "Created"});
      } else if (existingItem.name === name) {
        existingItem.NOTEBOOKSAVEHERE = NOTEBOOKSAVEHERE;
        await existingItem.save()
        res.status(204).json({ status: "Updated"})
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

app.delete('/api/delete/images/:name', (req, res) => {
  const itemName = "./public/uploads/" + req.params.name;
  fs.unlink(itemName, (err => { 
    if (err) {
      res.status(500).json({ status: "Internal Server Error"});
    } else { 
      res.status(204).json({ status: "Removed"});
    } 
  })); 
});

app.post('/api/save/images', upload.single('avatar'), function (req, res, next) {
  try {
    res.send(req.file.path.substring(req.file.path.indexOf("/")));
  } catch(err) {
    res.status(500).json({ status: "Internal Server Error"}); 
  }
})

app.get("/api/get/everything", async (req, res) => {
  let data = [];
  const result = await Item.find();
  for(let i = 0; i < result.length; i++) {
    let excerpts = [];
    for(let j = 0; j < JSON.parse(result[i]["NOTEBOOKSAVEHERE"]).length; j++) {
      excerpts.push(JSON.parse(result[i]["NOTEBOOKSAVEHERE"])[j].substring(0,30));
    }
    data.push({
      name: result[i]["name"],
      length: JSON.parse(result[i]["NOTEBOOKSAVEHERE"]).length,
      excerpt: excerpts
    })
  }
  res.status(200).json({ data });
})

app.get('/:name', async (req, res) => {
  let displayed = req.header("User-Agent").includes("iPhone OS") ? "index.ejs" : "beta.ejs";
  const name = req.params.name;
  if(name == "null") {
    res.redirect("/home")
  }
  if (quilt.includes(name)) {
    res.render("reserved.ejs")
  }
  const item = await Item.findOne({ name });
  if(name == "home") {
    res.render(displayed, {data: {book: ""}});
  } else if (!item) {
    res.render(displayed, {data: {book: ""}});
  } else {
      res.render(displayed, {data: {book: item.NOTEBOOKSAVEHERE }});
  }
});

app.get('/', (req, res) => {
  res.redirect("/home")
});

app.delete('/api/delete/notebooks/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const existingItem = await Item.findOne({ name });
    if (!existingItem) {
      res.status(404).json({ error: "Item not found with the given name" });
    } else if (existingItem.name === name) {
      await Item.deleteOne({ name }).exec();
      res.status(204).json({ status: "Removed"});
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/save/notebooks', async (req, res) => {
  const { name, NOTEBOOKSAVEHERE } = req.body;
  if (!name || !NOTEBOOKSAVEHERE) {
    return res.status(400).json({ error: 'Both name and lastName are required for the update' });
  }
  try {
    const existingItem = await Item.findOne({ name })
    if (!existingItem) {
      const newItem = new Item({ name, NOTEBOOKSAVEHERE });
      await newItem.save()
      res.status(201).json({ status: "Created"});
    } else if (existingItem.name === name) {
      existingItem.NOTEBOOKSAVEHERE = NOTEBOOKSAVEHERE;
      await existingItem.save()
      res.status(204).json({ status: "Updated"})
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.all('*', (req, res) => { 
  res.status(404).send("<h1 style = 'text-align: center; font-family: arial; line-height: 100vh;'>404! Page not found</h1>"); 
});

app.listen(port, () =>{
  console.log("Server is running on port " + port);
});