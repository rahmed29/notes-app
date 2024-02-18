# Note Taking Website

### Deprecated, I now use Obsidian.md which is basically what i was trying to make

![Screenshot](https://raw.githubusercontent.com/rahmed29/notes-app/master/notes.png)

This is my personal note taking website made with vanilla JavaScript.

nice features:
- Select text to recieve the wikipedia summary of it
- Insert images through native file upload or drag and drop
- Custom syntax similar to markdown (allows for underlined and red text, which isn't supported in regular markdown)

To host it yourself, simply clone the repo, install the dependencies (`npm ls`), and run app.js. The app runs on port 5556 and assumes MongoDB runs on port 27017. Notes are saved to a MongoDB db titled "notes".
