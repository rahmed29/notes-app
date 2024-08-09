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
import {
  initializeTodo,
  showTodo,
} from "./frontend_modules/popups/calendar.js";
import { updateAndSaveNotesLocally } from "./frontend_modules/dom_formatting.js";
import { createWorkspace } from "./frontend_modules/tabs.js";
import { initializeFlashcards } from "./frontend_modules/popups/flashcards.js";
import {
  saveStickyNotes,
  showStickyNotes,
  hideStickyNotes,
  initializeStickyNotes,
} from "./frontend_modules/sticky_note.js";
import { showFlashcards } from "./frontend_modules/popups/flashcards.js";
import { wikiSearch } from "./frontend_modules/wikipedia.js";
import {
  cycleViewPreferences,
  editingWindow,
} from "./frontend_modules/editing_window.js";
import setupToolbar from "./frontend_modules/setups/setup_toolbar.js";
import setupList from "./frontend_modules/setups/setup_list.js";
import { delContextMenu } from "./frontend_modules/context_menu.js";
import { showSearch } from "./frontend_modules/palettes/ctrl_f.js";
import { showPal } from "./frontend_modules/palettes/ctrl_space.js";
import { eid } from "./frontend_modules/dom_utils.js";
import { showNotifs } from "./frontend_modules/palettes/notif_palette.js";
import {
  editor,
  setupEditor,
} from "./frontend_modules/important_stuff/editor.js";
import {
  setup_dom_refs,
  notesPreviewArea,
  stickyNotesTextArea,
  stickyNotes,
  tabs,
  openCalendar,
  flashcardPrac,
  brDots,
  yellowButtons,
  bottomRightTools,
  searchBar,
  workspace,
  bottomLeftGeneralInfo,
  vaultDetails,
} from "./frontend_modules/important_stuff/dom_refs.js";
import { setupToolTips } from "./frontend_modules/important_stuff/tooltips.js";
import { disableAutosave, enableAutosave } from "./frontend_modules/autosave.js";

window.DOMPurify = DOMPurify;

document.body.innerHTML = `
<!-- Not visible (for the most part) -->
    <div id="loading">
      <div id="progBarContainer">
        <div id="progBar"></div>
      </div>
    </div>
    <div id="wikipediaBrainAnimation"></div>
    <div id="vaultDetails">🔐</div>
    <!---->

    <div id="mainContainer">
      <div id="leftMostSideBar">
        <div id="topLeftPageNumbers"></div>
        <div class="whereTo" id="morePages" data-vis="hidden">...</div>
        <div class="whereTo" id="newPage">+</div>
        <div id="sideBarRetractList"></div>
        <a id="goHome" class="whereTo">⚡</a>
      </div>
      <div id="listOfBooks">
        <div id="searchItem">
          <input placeholder="Search..." id="searchBar" />
        </div>
        <div id="listContainer"></div>
        <div class="itemUpload">
          <button id="yourUploads" class="folderName">Your Uploads</button>
          <ul id="uploads"></ul>
        </div>
      </div>
      <div id="border"></div>

      <!-- Fixed position -->
      <div id="bottomLeftGeneralInfo">
        <span id="generalInfoPageNumber"></span>
        <span id="generalInfoViewMode"></span>
        <span id="letterCount">00000</span>
        <span id="wordCount">00000</span>
        <span id="spacer">|</span>
        <button id="openCommandPal">>_</button>
        <span id="autoSaveSpinner" class = "loader"></span>
      </div>
      <!---->

      <div id="workspace">
        <div id="tabs"></div>
        <div id="notesAreaContainer">
          <div id="notesTextArea" class="syncscroll" name="myElements">
            <pre id="editor"></pre>
          </div>
          <div id="notesPreviewArea" class="syncscroll" name="myElements">
            <div id="fill"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed position -->
    <div id="toolBar">
      <div id="icons">
        <button id="icon1">
          <img
            alt="save notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/floppy_disk_3d.png"
          />
        </button>
        <button id="icon2">
          <img
            alt="manage notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/open_book_3d.png"
          />
        </button>
        <button id="icon3">
          <img
            alt="delete notebook icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/wastebasket_3d.png"
          />
        </button>
        <button id="icon4">
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
        </button>
        <button id="icon5">
          <img
            alt="switch view icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/eye_3d.png"
          />
        </button>
        <button id="icon6">
          <img
            alt="previous page icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/left_arrow_3d.png"
          />
        </button>
        <button id="icon7">
          <img
            alt="next page icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/right_arrow_3d.png"
          />
        </button>
        <button id="icon8">
          <img
            alt="brain icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/brain_3d.png"
          />
        </button>
        <button id="areNotesSavedIcon">
          <img
            alt="save status icon"
            draggable="false"
            class="emoji"
            src="/assets/icons/recycling_symbol_3d.png"
          />
        </button>
      </div>
    </div>
    <!---->

    <!-- Fixed position -->
    <div id="bottomRightTools">
      <div id="brDots">
        <button class="dot currPage"></button>
        <button class="dot"></button>
        <button class="dot"></button>
      </div>

      <div id="yellowButtons">
        <div id="flashcardsPrac">
          <button id="flashcardsPracEmoji">
            <img
              draggable="false"
              class="emoji"
              src="/assets/icons/card_index_3d.png"
            />
          </button>
        </div>

        <div id="openCalendar" class="gone" data-text="">
          <button id="openCalendarEmoji">
            <img
              draggable="false"
              class="emoji"
              src="/assets/icons/calendar_3d.png"
            />
          </button>
        </div>

        <div id="stickyNotes" class="gone" data-text="">
          <textarea id="stickyNotesTextArea" autocomplete="false"></textarea>
          <button id="stickyNotesEmoji">
            <img
              draggable="false"
              class="emoji"
              src="/assets/icons/memo_3d.png"
            />
          </button>
        </div>
      </div>
    </div>
    <!---->
`;

if (location.pathname === "/") {
  location.replace("/home");
}

setup_dom_refs();
let progBar = document.getElementById("progBar");

// toast notifs
const notyf = new Notyf({
  position: {
    y: "bottom",
    x: "center",
  },
  dismissible: true,
});

window.notyf = notyf;

// onload functions
window.addEventListener(
  "load",
  async () => {
    eid("loading").addEventListener(
      "animationend",
      function () {
        this.remove();
      },
      { once: true }
    );
    setupToolTips();
    setupEditor();
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
    await updateList();
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
    if (localStorage.getItem("/autosave") === "true") {
      enableAutosave();
    } else {
      disableAutosave();
    }
    // startAutosave();
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

    new Dropzone(document.body, {
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

    for (let i = 0, n = brDots.children.length; i < n; i++) {
      const dotFunctions = ["Flashcards", "Calendar", "Scratch Pad"];
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
          case " ":
            e.preventDefault();
            showPal();
            break;
          case "f":
            showSearch(e.shiftKey);
            e.preventDefault();
            break;
          case ",":
            e.preventDefault();
            showNotifs();
            break;
          case "/":
            e.preventDefault();
            searchBar.focus();
            break;
        }
      }
    });
    const resizeObserver = new ResizeObserver((entries) => {
      bottomLeftGeneralInfo.style.left =
        workspace.getBoundingClientRect().left + "px";
      vaultDetails.style.left = workspace.getBoundingClientRect().left + "px";
    });
    resizeObserver.observe(workspace);
    // tippy([vaultDetails], {
    //   animation: "shift-toward-subtle",
    //   allowHTML: true,
    //   arrow: false,
    //   content: "Encrypted",
    //   placement: "bottom",
    // });
    progBar.style.width = "420px";
    eid("loading").classList.add("loaded");
    progBar = null;
  },
  { once: true }
);
