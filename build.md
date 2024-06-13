After building, if you already have a public folder, delete the old JS and CSS files

Delete public and desktop.ejs, and move index.html to views folder and rename desktop.ejs (will remove the need for .ejs eventually)

Make sure src-min (ace editor) dir exists in assets folder. You can download it from the ace editor repo on github. You can safely remove any modes other than markdown mode.

Also, make sure ./public/uploads exists

I think that's it. lol.