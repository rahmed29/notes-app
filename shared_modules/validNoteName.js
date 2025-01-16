export { validNoteName, excludedNames, unsavableNames };

const validNoteName = /^(?!api$)(?!uploads$)(?!assets$)[a-zA-Z0-9-_~.]+$/;

// These are notebooks that shouldn't be included creating the list, or the FDG
// Most of these are uneditable by the user on the frontend, but some can be edited, like the user settings.
// The `user__config` provides a way for the user to edit their settings by just editing a notebook
const excludedNames = [
  "sticky__notes",
  "flash__cards",
  "user__config",
  "snippets",
  "__god",
];

// Notebooks with these names cannot be saved via the API.
const unsavableNames = [
  "home",
  "AI-Summary",
  "Your-Uploads",
  "Note-Map",
  "Public-Notebook",
  "Tag-Viewer",
  "mobile_home",
  "__god",
];
