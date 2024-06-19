# Building

1. run `npm run build`
2. If you made any changes to `main.js` and `style.css`, you can safely delete the old bundled js and css files that will no longer be needed
3. Replace the `public` directory with the newly built `dist` dir, and make the built `index.html` file the new `desktop.ejs`
4. Make sure `ace-editor` dir exists in the `assets` dir. You can download it from the [ace editor repo on github.](https://github.com/ajaxorg/ace) You can safely remove any modes other than markdown mode.
5. make sure ./public/uploads exists, and make sure you've cloned the [Micromark <mark> tag extension](https://github.com/rahmed29/micromark-extension-mark) into the root dir

I think that is it. `server.js` runs on port `5556` and stores notes in a database titled `rop` in a MongoDB instance running on port `27017`. One day I will try to dockerize this.