import { editor } from "./important_stuff/editor.js";
import { attemptRemoval, eid } from "./dom_utils.js";
import themes from "./themes/index.js";
import { changeSettings } from "./important_stuff/settings.js";

export { currTheme, changeTheme };

// current theme
let currTheme = null;

const ace_to_prism = {
  chrome: "vs",
  gruvbox: "gruvbox-dark",
  katzenmilch: "ghcolors",
  clouds_midnight: "atom-dark",
  solarized_light: "solarizedlight",
  solarized_dark: "solarized-dark-atom",
  pastel_on_dark: "duotone-earth",
  monokai: "okaidia",
  dracula: "dracula",
  github_dark: "github-dark",
  cobalt: "z-touch",
  twilight: "twilight",
  tomorrow_night_eighties: "tomorrow",
  cloud_editor_dark: "one-dark",
  nord_dark: "nord",
  tomorrow_night: "tomorrow",
  xcode: "one-light",
  mono_industrial: "duotone-forest",
  terminal: "atom-dark",
};

// theming
function changeTheme(themeName) {
  if (network.isOffline) {
    return;
  }
  attemptRemoval([eid("notes_prism_theme")]);
  const obj =
    themes.find((e) => e.name === themeName) ||
    themes.find((e) => e.name === "chrome");
  currTheme = obj;
  changeSettings("theme", themeName);
  notes_global_theme.replace(`
    :root {
      --quizlet-purple: ${obj.quizletPurple};
      --quizlet-purple-accents: ${obj.quizletPurpleAccents};
      --quizlet-font: ${obj.quizletFont};
      --main-accent: ${obj.mainAccent};
      --accent-font: ${obj.accentFont};
      --body: ${obj.body};
      --notes-background: ${obj.notesBackground};
      --notes-color: ${obj.notesColor};
      --code: ${obj.code};
      --codeBackground: ${obj.codeBackground || obj.code};
      --codeColor: ${obj.codeColor || obj.notesColor};
      --misc-buttons: ${obj.miscButtons};
      --buttons-color: ${obj.buttonsColor};
      --context-menu: ${obj.contextMenu};
      --context-menu-color: ${obj.contextMenuColor};
      --sidebar-accents: ${obj.sidebarAccents};
      --side-bar: ${obj.sideBar};
      --list-background: ${obj.listBackground};
      --searchAndUpload: ${obj.searchAndUpload};
      --searchAndUpload-color: ${obj.searchAndUploadColor};
      --list-color: ${obj.listColor};
      --icons: ${obj.icons};
      --icons-color: ${obj.iconsColor};
      --tab-color: ${obj.tabColor};
      --dropped-folders: ${obj.droppedFolders};
      --destructive: ${obj.destructive};
      --popup-header: ${obj.popupHeader};
      --popup-exit: ${obj.popupExit};
      --highlight: ${obj.highlight};
      --highlight-color: ${obj.highlightColor};
      --selection: ${obj.selection};
      --context-menu-border: ${obj.contextMenuBorder};
      --button-border: ${obj.buttonBorder || "rgba(0, 0, 0, 25)"};
      --icons-border: ${obj.iconsBorder || "rgba(0, 0, 0, 25)"};
      --floating-bs: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  `);
  const prismTheme = document.createElement("style");
  prismTheme.id = "notes_prism_theme";
  prismTheme.innerText = `@import url("/assets/prism-all-themes/prism-${
    ace_to_prism[themeName] || "solarizedlight"
  }.css");`;
  document.head.appendChild(prismTheme);
  editor.setTheme(`ace/theme/${themeName}`);
}
