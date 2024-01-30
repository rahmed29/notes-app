# Note Taking Website

This is my personal note taking website made with vanilla JavaScript. It is essentially a WYSIWYM text editor built with Regex

Current features:
- Select text to recieve the wikipedia summary of it
- Insert images through native file upload or drag and drop
- Custom syntax similar to markdown (allows for underlined and red text, which isn't supported in regular markdown)

To host it yourself, simply clone the repo, install the dependencies (`npm ls`), and run app.js. The app runs on port 5556 and assumes MongoDB runs on port 27017. Notes are saved to a MongoDB db titled "notes".
