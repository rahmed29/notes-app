import "tippy.js/dist/tippy.css";
import tippy from "tippy.js";
import "tippy.js/themes/light.css";
import "tippy.js/animations/shift-toward-subtle.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Dropzone from "dropzone";
import DOMPurify from "dompurify";
import { changeTheme } from "./frontend_modules/theming.js";
import {
  note,
  switchNote,
  saveNoteBookToDb,
} from "./frontend_modules/note_utils.js";
import { updateList } from "./frontend_modules/list_utils.js";
import { initializeTodo, showTodo } from "./frontend_modules/calendar.js";
import { updateAndSaveNotesLocally } from "./frontend_modules/dom_formatting.js";
import { createWorkspace } from "./frontend_modules/tabs.js";
import { initializeFlashcards } from "./frontend_modules/flashcards.js";
import {
  saveStickyNotes,
  showStickyNotes,
  hideStickyNotes,
  initializeStickyNotes,
} from "./frontend_modules/sticky_note.js";
import { showFlashcards } from "./frontend_modules/flashcards.js";
import { wikiSearch } from "./frontend_modules/wikipedia.js";
import {
  cycleViewPreferences,
  editingWindow,
} from "./frontend_modules/editing_window.js";
import setupToolbar from "./frontend_modules/setup_toolbar.js";
import setupList from "./frontend_modules/setup_list.js";
import { delContextMenu } from "./frontend_modules/context_menu.js";
import { showSearch } from "./frontend_modules/ctrl_f.js";
import { showPal } from "./frontend_modules/ctrl_space.js";
import { eid } from "./frontend_modules/dom_utils.js";
import { showNotifs } from "./frontend_modules/notif_palette.js";

window.DOMPurify = DOMPurify;

document.body.innerHTML = `
    <div id="loading">
      <div id="progBarContainer">
        <div id="progBar"></div>
      </div>
    </div>

    <div id="wikipediaBrainAnimation"></div>

    <div id="bottomRightTools">
      <div id="brDots">
        <span class="dot currPage"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>

      <div id="yellowButtons">
        <div id="flashcardsPrac">
          <span id="flashcardsPracEmoji">
            <img
              draggable="false"
              class="emoji"
              src="/assets/icons/card_index_3d.png"
            />
          </span>
        </div>

        <div id="openCalendar" class="gone" data-text="">
          <span id="openCalendarEmoji">
            <img draggable="false" class="emoji" src="/assets/icons/calendar_3d.png" />
          </span>
        </div>

        <div id="stickyNotes" class="gone" data-text="">
          <textarea id="stickyNotesTextArea" autocomplete="false"></textarea>
          <span id="stickyNotesEmoji">
            <img draggable="false" class="emoji" src="/assets/icons/memo_3d.png" />
          </span>
        </div>
      </div>
    </div>

    <div id="toolBar">
      <div id="icons">
        <span id="icon1">
          <img
            alt="save notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/floppy_disk_3d.png"
          />
        </span>
        <span id="icon2">
          <img
            alt="manage notebooks icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/open_book_3d.png"
          />
        </span>
        <span id="icon3">
          <img
            alt="delete notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/wastebasket_3d.png"
          />
        </span>
        <span id="icon4">
          <label for="getFile1" id="labelForImage">
            <img
              alt="insert image icon"
              draggable="false"
              class="emoji"
              src="/assets/icons/framed_picture_3d.png"
            />
          </label>
          <form id="myForm">
            <input
              id="getFile1"
              type="file"
              name="avatar"
              style="display: none"
            />
          </form>
        </span>
        <span id="icon5">
          <img
            alt="switch view icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/eye_3d.png"
          />
        </span>
        <span id="icon6">
          <img
            alt="previous page icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/left_arrow_3d.png"
          />
        </span>
        <span id="icon7">
          <img
            alt="next page icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/right_arrow_3d.png"
          />
        </span>
        <span id="icon8" data-enabled="true">
          <img
            alt="brain icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/brain_3d.png"
          />
        </span>
        <span id="areNotesSavedIcon">
          <img
            alt="save status icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/recycling_symbol_3d.png"
          />
        </span>
      </div>
    </div>

    <div id="bottomLeftGeneralInfo">
      <span id="generalInfoPageNumber"></span>
      <span id="generalInfoViewMode"></span>
      <span id="letterCount">00000</span>
      <span id="wordCount">00000</span>
      <span id = "spacer">|</span>
      <span id = "openCommandPal">>_</span>
    </div>

    <div id="mainContainer">
      <div id="leftMostSideBar">
        <div id="topLeftPageNumbers"></div>
        <div class="whereTo" id="morePages" data-vis="hidden">...</div>
        <div class="whereTo" id="newPage">+</div>
        <div id="sideBarRetractList"></div>
        <a id="goHome" class="whereTo">/</a>
      </div>
      <div id="listOfBooks">
        <div id="searchItem">
          <input placeholder="Search..." id="searchBar" />
        </div>
        <div id="listContainer"></div>
        <div class="itemUpload">
          <div id="yourUploads" class="folderName">Your Uploads</div>
          <ul id="uploads"></ul>
        </div>
      </div>
      <div id="border"></div>
      <div id="workspace">
        <div id="tabs"></div>
        <div id="notesAreaContainer">
          <div
            id="notesTextArea"
            class="syncscroll"
            name="myElements"
          >
            <pre id="editor"></pre>
          </div>
          <div id="notesPreviewArea" class="syncscroll" name="myElements">
            <div id="fill"></div>
          </div>
        </div>
      </div>
    </div>
`;

if (location.pathname === "/") {
  location.replace("/home");
}

export const notesTextArea = document.getElementById("notesTextArea");
export const notesPreviewArea = document.getElementById("notesPreviewArea");
export const mainContainer = document.getElementById("mainContainer");
export const notesAreaContainer = document.getElementById("notesAreaContainer");
export const topLeftPageNumber = document.getElementById("topLeftPageNumbers");
export const areNotesSavedIcon = document.getElementById("areNotesSavedIcon");
export const list = document.getElementById("listOfBooks");
export const listContainer = document.getElementById("listContainer");
export const wikipediaBrainAnimation = document.getElementById(
  "wikipediaBrainAnimation"
);
export const bottomLeftGeneralInfo = document.getElementById(
  "bottomLeftGeneralInfo"
);
export const generalInfoPageNumberEle = document.getElementById(
  "generalInfoPageNumber"
);
export const uploadFolder = document.getElementById("yourUploads");
export const morePages = document.getElementById("morePages");
export const toolBar = document.getElementById("toolBar");
export const brain = document.getElementById("icon8");
export const border = document.getElementById("border");
export const stickyNotesTextArea = document.getElementById(
  "stickyNotesTextArea"
);
export const stickyNotes = document.getElementById("stickyNotes");
export const workspace = document.getElementById("workspace");
export const tabs = document.getElementById("tabs");
export const openCalendar = document.getElementById("openCalendar");
export const flashcardPrac = document.getElementById("flashcardsPrac");
export const myForm = document.getElementById("myForm");
export const letterCount = document.getElementById("letterCount");
export const wordCount = document.getElementById("wordCount");
export const mode = document.getElementById("generalInfoViewMode");
export const previewContent = document.getElementById("fill");
export const brDots = document.getElementById("brDots");
export const yellowButtons = document.getElementById("yellowButtons");
export const bottomRightTools = document.getElementById("bottomRightTools");
export const progBar = document.getElementById("progBar");

export const editor = ace.edit("editor");
// editor.setTheme("ace/theme/chrome");
editor.setOptions({
  maxLines: Infinity,
});
editor.renderer.setShowGutter(false);
// disable ace editor command palette
editor.commands.bindKey("F1", null);
editor.commands.bindKey("ctrl+f", null);
editor.commands.bindKey("ctrl+,", null);
editor.setOption("showPrintMargin", false);

// tooltips
export const wikipediaTippy = tippy([brain], {
  animation: "shift-toward-subtle",
  arrow: false,
  content: `<div id = 'brain' style = 'width: auto;'>Info on highlighted text will appear here</div>`,
  interactive: true,
  allowHTML: true,
  maxWidth: "500px",
  placement: "bottom-end",
})[0];

export const synced = tippy("#areNotesSavedIcon", {
  animation: "shift-toward-subtle",
  arrow: false,
  content: "Notes are saved",
  placement: "bottom-end",
})[0];

export const editingMode = tippy("#generalInfoViewMode", {
  animation: "shift-toward-subtle",
  arrow: false,
  content: localStorage.getItem("/viewPref"),
  placement: "top",
})[0];

export const generalInfoPageNumber = tippy("#generalInfoPageNumber", {
  animation: "shift-toward-subtle",
  arrow: false,
  content: "Loading",
  placement: "top",
})[0];

const anonTooltips = [
  {
    name: "#icon1",
    content: "Save (Ctrl + S)",
  },
  {
    name: "#icon2",
    content: "Notebook",
  },
  {
    name: "#icon3",
    content: "Delete",
  },
  {
    name: "#icon4",
    content: "Insert Image",
  },
  {
    name: "#icon5",
    content: "Switch View (Ctrl + E)",
  },
  {
    name: "#icon6",
    content: "Prev Page",
  },
  {
    name: "#icon7",
    content: "Next Page",
  },
  {
    name: "#wordCount",
    content: "Word Count",
  },
  {
    name: "#letterCount",
    content: "Character Count",
  },
  {
    name: "#openCommandPal",
    content: "Command Palette",
  },
];

anonTooltips.forEach((obj) =>
  tippy(obj.name, {
    arrow: false,
    allowHTML: true,
    animation: "shift-toward-subtle",
    content: obj.content,
    placement: "bottom",
  })
);

// toast notifs
const notyf = new Notyf({
  position: {
    y: "bottom",
    x: "center",
  },
  dismissible: true,
});

window.notyf = notyf;

// Image stuff
const dropzone = new Dropzone(document.body, {
  url: "/api/save/images",
  paramName: "avatar",
  clickable: false,
  acceptedFiles: "image/jpeg,image/png,image/gif,image/webp",
  error: () => notyf.error("An error occurred when saving an image"),
  success: (file, response) => {
    file.previewElement.remove();
    editor.insert(`![](${response})`);
    updateAndSaveNotesLocally();
    // saveNoteBookToDb(note.name);
    updateList();
  },
});

eid("loading").addEventListener(
  "animationend",
  function () {
    this.remove();
  },
  { once: true }
);

// onload functions
window.addEventListener(
  "load",
  async () => {
    // main note area
    notesPreviewArea.addEventListener("click", (e) => wikiSearch(e));

    // bottom right tools
    bottomRightTools.addEventListener("contextmenu", (e) => e.preventDefault());

    // open command pal
    document.getElementById("openCommandPal").addEventListener("click", () => {
      delContextMenu();
      showPal();
    });

    // tabs
    tabs.addEventListener("contextmenu", (e) => e.preventDefault());
    // more event listeners, there's a lot of them so they are in their own files "setup_toolbar" and "setup_list" respectively
    setupToolbar();
    setupList();

    const startTime = Date.now();
    changeTheme(localStorage.getItem("/theme") || "chrome");
    createWorkspace();
    // await createList();
    progBar.style.width = "70px";
    await initializeFlashcards();
    progBar.style.width = "140px";
    await initializeTodo();
    progBar.style.width = "210px";
    await initializeStickyNotes();
    progBar.style.width = "280px";
    await switchNote(
      location.pathname.substring(1),
      parseInt(location.search.substring(1) || 1) - 1
    );
    progBar.style.width = "350px";
    editingWindow(localStorage.getItem("/viewPref") || "read");
    // bottom right buttons
    stickyNotes.addEventListener("click", showStickyNotes, { once: true });
    stickyNotesTextArea.addEventListener("input", saveStickyNotes);
    stickyNotesTextArea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        hideStickyNotes();
      }
    });
    openCalendar.addEventListener("click", () => showTodo(false));
    flashcardPrac.addEventListener("click", () => showFlashcards());

    for (let i = 0, n = brDots.children.length; i < n; i++) {
      const dotFunctions = ["Flashcards", "Calendar", "Sticky Note"];
      tippy([brDots.children[i]], {
        animation: "shift-toward-subtle",
        arrow: false,
        content: dotFunctions[i],
        placement: "left",
      });
      brDots.children[i].addEventListener("click", function () {
        for (let j = 0, n = yellowButtons.children.length; j < n; j++) {
          yellowButtons.children[j].classList.add("gone");
          brDots.children[j].classList.remove("currPage");
        }
        yellowButtons.children[i].classList.remove("gone");
        brDots.children[i].classList.add("currPage");
      });
    }
    // Event listeners
    // doc
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            saveNoteBookToDb(note.name);
            break;
          case "e":
            e.preventDefault();
            cycleViewPreferences();
            break;
          case "f":
            e.preventDefault();
            showSearch();
            break;
          case " ":
            e.preventDefault();
            showPal();
            break;
          case ",":
            e.preventDefault();
            showNotifs();
            break;
        }
      }
    });
    progBar.style.width = "420px";
    document.getElementById("loading").classList.add("loaded");
    console.log(`Load time: ${Date.now() - startTime}ms`);
  },
  { once: true }
);
