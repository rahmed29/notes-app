import { editor } from "../main.js";
import { attemptRemoval } from "./dom_utils.js";
import themes from "./themes/index.js";

// current theme
let currTheme = null;

// theming
function changeTheme(themeName) {
  attemptRemoval([document.getElementById("zitselTheme")])
  const style = document.createElement("style");
  style.id = "zitselTheme";
  document.head.appendChild(style);
  const obj =
    themes.find((e) => e.name === themeName) ||
    themes.find((e) => e.name === "chrome");
  currTheme = obj;
  localStorage.setItem("/theme", themeName);
  style.innerText = `
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
      --hovers: ${obj.hovers};
      --destructive: ${obj.destructive};
      --popup-header: ${obj.popupHeader};
      --popup-exit: ${obj.popupExit};
      --highlight: ${obj.highlight};
      --highlight-color: ${obj.highlightColor};
      --selection: ${obj.selection};
      --floating-bs: ${
        obj.theme_type === "dark"
          ? "rgba(70, 75, 103, 0.05) 0px 0px 0px 1px, rgb(70, 75, 103) 0px 0px 0px 1px inset"
          : "rgba(0, 0, 0, 0.24) 0px 3px 8px"
      };
    }
  `;
  editor.setTheme(`ace/theme/${themeName}`);
}

export { currTheme, changeTheme };
