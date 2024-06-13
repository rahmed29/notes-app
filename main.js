import "tippy.js/dist/tippy.css";
import tippy from "tippy.js";
import "tippy.js/themes/light.css";
import "tippy.js/animations/shift-toward-subtle.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Dropzone from "dropzone";
import DOMPurify from "dompurify";
import { changeTheme } from "./frontend/theming.js";
import {
  note,
  switchNote,
  forceUpdateNotes,
  deletePage,
  saveNoteBookToDb,
  deleteNoteBookFromDb,
} from "./frontend/note_utils.js";
import {
  updateList,
  search,
  resizeList,
  toggleList,
  listContextMenu,
  showMorePages,
} from "./frontend/list_utils.js";
import { contextMenu, delContextMenu } from "./frontend/context_menu.js";
import { initializeTodo, showTodo } from "./frontend/calendar.js";
import {
  jumpToDesiredPage,
  handlePageMovement,
  updateAndSaveNotesLocally,
} from "./frontend/dom_formatting.js";
import { createWorkspace } from "./frontend/tabs.js";
import { initializeFlashcards } from "./frontend/flashcards.js";
import {
  saveStickyNotes,
  showStickyNotes,
  hideStickyNotes,
  initializeStickyNotes,
  insertStickyNote,
} from "./frontend/sticky_note.js";
import { showFlashcards, flashcardMode } from "./frontend/flashcards.js";
import { toggleWikiSearch, wikiSearch } from "./frontend/wikipedia.js";
import { showBookDiffPopup } from "./frontend/book_diff.js";
import {
  cycleViewPreferences,
  editingWindow,
} from "./frontend/editing_window.js";
import { insertAndSaveImage } from "./frontend/images.js";
import {
  encryptCurrentBook,
  decryptCurrentBook,
} from "./frontend/encryption.js";
import { AISUmmary } from "./frontend/chat_gpt.js";

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

export const toolBarTips = [
  "Save (Ctrl + S)",
  "Notebook",
  "Delete",
  "Insert Image",
  "Switch View (Ctrl + E)",
  "Prev Page",
  "Next Page",
];

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
    y: "top",
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

// Event listeners
// doc
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
    e.preventDefault();
    saveNoteBookToDb(note.name);
  } else if (e.ctrlKey && (e.key === "e" || e.key === "E")) {
    e.preventDefault();
    cycleViewPreferences();
  }
});

// main note area
notesPreviewArea.addEventListener("click", (e) => wikiSearch(e));

// toolbar
document.getElementById("icon1").addEventListener("click", saveNoteBookToDb);
document
  .getElementById("icon2")
  .addEventListener("click", (e) => listContextMenu(e, true));
document.getElementById("icon3").addEventListener("click", (e) =>
  contextMenu(e, [
    {
      text: "Delete Notebook",
      click: function () {
        this.classList.add("rios");
        this.innerText = "Confirm";
        this.addEventListener(
          "click",
          () => {
            deleteNoteBookFromDb(note.name);
            delContextMenu();
          },
          { once: true }
        );
      },
      appearance: "ios",
    },
    {
      text: "Delete This Page",
      click: function () {
        this.classList.add("rios");
        this.innerText = "Confirm";
        this.addEventListener(
          "click",
          () => {
            deletePage();
            delContextMenu();
          },
          { once: true }
        );
      },
      appearance: "ios",
    },
  ])
);
document
  .getElementById("getFile1")
  .addEventListener("change", insertAndSaveImage);
document.getElementById("icon5").addEventListener("click", (e) =>
  contextMenu(e, [
    {
      text: "◨ Split",
      click: () => {
        localStorage.setItem("/viewPref", "split");
        editingWindow("split");
        delContextMenu();
      },
      appearance: "ios",
    },
    {
      text: "◼ Read",
      click: () => {
        localStorage.setItem("/viewPref", "read");
        editingWindow("read");
        delContextMenu();
      },
      appearance: "ios",
    },
    {
      text: "◻ Write",
      click: () => {
        localStorage.setItem("/viewPref", "write");
        editingWindow("write");
        delContextMenu();
      },
      appearance: "ios",
    },
  ])
);
document
  .getElementById("icon6")
  .addEventListener("click", () => handlePageMovement(true, 1, false));
document
  .getElementById("icon7")
  .addEventListener("click", (e) => handlePageMovement(false, 1, false, e));
brain.addEventListener("click", (e) =>
  contextMenu(e, [
    {
      text: "Toggle Wiki Search",
      click: () => toggleWikiSearch(),
      appearance: "ios",
    },
    {
      text: "AI Summary",
      click: async function () {
        this.innerText = "Loading...";
        await AISUmmary();
        this.style.pointerEvents = "inherit";
        this.innerText = "AI Summary";
      },
      appearance: "ios",
    },
    {
      text: "Insert Sticky Note",
      click: () => {
        insertStickyNote();
        delContextMenu();
      },
      appearance: "ios",
    },
    {
      text: "Insert Calendar Event",
      click: () => {
        showTodo(true);
        delContextMenu();
      },
      appearance: "ios",
    },
    {
      text: "Create Flashcards",
      click: () => {
        flashcardMode();
        delContextMenu();
      },
      appearance: "ios",
    },
  ])
);
areNotesSavedIcon.addEventListener("animationend", function () {
  this.classList.remove("saved");
});
areNotesSavedIcon.addEventListener("click", (e) =>
  contextMenu(e, [
    {
      text: "More Details",
      click: () => {
        showBookDiffPopup();
        delContextMenu();
      },
      appearance: "ios",
    },
    {
      text: "Force Update",
      click: function () {
        this.innerText = "Confirm";
        this.classList.add("rios");
        this.addEventListener(
          "click",
          function () {
            forceUpdateNotes();
            delContextMenu();
          },
          { once: true }
        );
      },
      appearance: "ios",
    },
    {
      text: note.isEncrypted ? "Decrypt Notebook" : "Encrypt Notebook",
      click: () => {
        if (note.isEncrypted) {
          decryptCurrentBook();
        } else {
          encryptCurrentBook();
        }
        delContextMenu();
      },
      appearance: "ios",
    },
    note.isEncrypted
      ? {
          text: "Change Password",
          click: () => {
            const newPassword = prompt("Enter a new password");
            if (newPassword != null) {
              note.password = newPassword;
              saveNoteBookToDb(note.name);
            }
            delContextMenu();
          },
          appearance: "ios",
        }
      : null,
  ])
);
toolBar.addEventListener("contextmenu", (e) => e.preventDefault());

// side bar and list
document
  .getElementById("leftMostSideBar")
  .addEventListener("contextmenu", (e) => e.preventDefault());
document
  .getElementById("sideBarRetractList")
  .addEventListener("click", toggleList);
document
  .getElementById("newPage")
  .addEventListener("click", () => jumpToDesiredPage(note.content.length));
morePages.addEventListener("click", (e) => showMorePages(e));
document
  .getElementById("goHome")
  .addEventListener("click", () => switchNote("home", 0));
list.addEventListener("contextmenu", (e) => e.preventDefault());
document
  .getElementById("searchItem")
  .children[0].addEventListener("input", function () {
    search(this.value);
  });
uploadFolder.addEventListener("click", function () {
  this.parentNode.classList.toggle("down");
});
border.addEventListener("mousedown", () => {
  delContextMenu();
  mainContainer.style.userSelect = "none";
  document.addEventListener("mousemove", resizeList);
  document.addEventListener(
    "mouseup",
    () => {
      localStorage.setItem("/listSize", list.style.width);
      border.classList.remove("currPage");
      document.body.style.cursor = "inherit";
      mainContainer.style.userSelect = "inherit";
      document.removeEventListener("mousemove", resizeList);
    },
    { once: true }
  );
});
document.getElementById("loading").addEventListener(
  "animationend",
  function () {
    this.remove();
  },
  { once: true }
);
document
  .getElementById("openCommandPal")
  .addEventListener("click", () =>
    document.getElementsByClassName("mobile-button")[0].click()
  );

// bottom right tools
bottomRightTools.addEventListener("contextmenu", (e) => e.preventDefault());

// onload functions
window.addEventListener(
  "load",
  async () => {
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
    progBar.style.width = "420px";
    document.getElementById("loading").classList.add("loaded");
  },
  { once: true }
);
