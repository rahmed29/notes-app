import "tippy.js/dist/tippy.css";
import tippy from "tippy.js";
import "tippy.js/themes/light.css";
import "tippy.js/animations/shift-toward-subtle.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Dropzone from "dropzone";
import DOMPurify from "dompurify";
import { changeTheme } from "./frontend_modules/theming.js";
import { switchNote, saveNoteBookToDb } from "./frontend_modules/note_utils.js";
import { note } from "./frontend_modules/data/note.js";
import { updateList } from "./frontend_modules/list_utils.js";
import {
  handlePageMovement,
  updateAndSaveNotesLocally,
} from "./frontend_modules/dom_formatting.js";
import { createWorkspace } from "./frontend_modules/create_workspace.js";
import { initializeFlashcards } from "./frontend_modules/data/flashcard_data.js";
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
  flashcardPrac,
  brDots,
  yellowButtons,
  bottomRightTools,
  searchBar,
  bottomLeftGeneralInfo,
  vaultDetails,
} from "./frontend_modules/important_stuff/dom_refs.js";
import { setupToolTips } from "./frontend_modules/important_stuff/tooltips.js";
import {
  autosavingEnabled,
  disableAutosave,
  enableAutosave,
  isAutoSaving,
  noteBeingAutoSaved,
  saving,
} from "./frontend_modules/autosave.js";
import { netCheck } from "./frontend_modules/important_stuff/netcheck.js";
import {
  setGlobalPaletteClose,
  setGlobalPopupClose,
} from "./frontend_modules/mediators/popup_closers.js";
import { closePalette } from "./frontend_modules/palettes/cmd.js";
import { closePopupWindow } from "./frontend_modules/popups/popup.js";
import { getSetting } from "./frontend_modules/important_stuff/settings.js";
import { properLink, throttle } from "./frontend_modules/data_utils.js";
import {
  isRendering,
  rendering,
  sizeDetails,
} from "./frontend_modules/throttle.js";
import { reserved } from "./frontend_modules/data/reserved_notes.js";
import { insertTemplate } from "./frontend_modules/snippets.js";

// used by note-map
window.switchNoteWrapper = (name) => switchNote(name);

// used a lot so just open to window
window.DOMPurify = DOMPurify;

document.getElementById("root").innerHTML = `
<!-- Not visible (for the most part) -->
    <div id="loading">
      <div id="progBarContainer">
        <div id="progBar"></div>
      </div>
    </div>
    <div id="wikipediaBrainAnimation"></div>
    <div id="vaultDetails">🔐</div>
    <!---->

    <!-- Fixed position, Note Map button for mobile interface -->
    <div id = "mobileAction">
      <img src = "/assets/circle-scatter-haikei(1).png">
    </div>

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
              alt="insert file icon"
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

        <div id="stickyNotes" class="gone" data-text="">
          <textarea id="stickyNotesTextArea" autocomplete="off" spellcheck="false"></textarea>
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

// toast notifs, used a lot so just open to window
const notyf = new Notyf({
  position: {
    y: "top",
    x: "center",
  },
  dismissible: true,
});
// must be added to window after setting body HTML
window.notyf = notyf;

if (location.pathname === "/") {
  location.replace("/home");
}

// setup our DOM refs which are used a lot. This is vanilla javascript after all :)
setup_dom_refs();
let progBar = document.getElementById("progBar");

let savingStickyNotes = false;

async function finish() {
  eid("loading").addEventListener(
    "animationend",
    function () {
      this.remove();
    },
    { once: true }
  );

  // Here, we begin the network check, create the tool tips, and set up the ace editor instance
  netCheck();
  setupToolTips();
  setupEditor((delta) => {
    throttle({
      delay: sizeDetails[1] / 50,
      condition: sizeDetails[0] && !isRendering,
      beforeTimeout: () => rendering(true),
      callback: updateAndSaveNotesLocally,
      afterTimeout: () => rendering(false),
      fallbackCondition: !sizeDetails[0],
      fallback: updateAndSaveNotesLocally,
    });
    throttle({
      condition: autosavingEnabled && !isAutoSaving,
      beforeTimeout: () => saving(true, note.name),
      callback: () => {
        if (note.name === noteBeingAutoSaved && !reserved(note.name)) {
          saveNoteBookToDb(note.name, true);
        }
      },
      afterTimeout: () => saving(false),
    });
  });

  // Here we get our list of books from the server and store it in memory
  await updateList();
  progBar.style.width = "80px";

  // Here we set the theme and create tabs for the workspace according to whatever is in local storage, keep in mind, these tabs do not mean the note is in memory, they are just tabs in the dom
  // also if we on mobile we do some stuff. Mobile means iphone cause yeah it really is just optimized for my phone
  if (navigator.userAgent.includes("iPhone")) {
    window.isOnMobile = true;
    document.body.classList.add("mobile");
    document.body.addEventListener("dblclick", function (event) {
      // Get the width of the viewport
      const screenWidth = window.innerWidth;
      // Determine the position of the click relative to the screen
      const clickX = event.clientX;
      // Check if the click is on the left or right half of the screen
      if (clickX < screenWidth / 2) {
        handlePageMovement({
          direction: "<-",
          amount: 1,
        });
      } else {
        handlePageMovement({
          direction: "->",
          amount: 1,
        });
      }
    });
    // Black theme for OLED display on iPhone
    changeTheme("terminal");
  } else {
    changeTheme(getSetting("theme", "chrome"));
  }
  createWorkspace();

  // Here, we get the flashcard data from the server and store it in memory
  await initializeFlashcards();
  progBar.style.width = "160px";

  // Here we get the scratch pad aka sticky note data from the server and store it in memory
  await initializeStickyNotes();
  progBar.style.width = "240px";

  // Here we switch to the note and page number that is in the url
  await switchNote(location.pathname.substring(1), {
    page: parseInt(location.search.substring(1) || 1) - 1,
  });
  progBar.style.width = "320px";

  // Here we enable or disable autosave according to the value in local storage
  if (getSetting("autosave", true)) {
    enableAutosave();
  } else {
    disableAutosave();
  }

  // Here we set the editing window to the value in local storage
  editingWindow(getSetting("viewPref", "read"));

  // Some event listeners
  if (!navigator.userAgent.includes("iPhone")) {
    notesPreviewArea.addEventListener("click", (e) => wikiSearch(e));
  }
  bottomRightTools.addEventListener("contextmenu", (e) => e.preventDefault());
  document.getElementById("openCommandPal").addEventListener("click", () => {
    delContextMenu();
    showPal();
  });
  tabs.addEventListener("contextmenu", (e) => e.preventDefault());

  // more event listeners, there's a lot of them so they are in their own files "setup_toolbar" and "setup_list" respectively
  setupToolbar();
  setupList();

  document
    .getElementById("mobileAction")
    .addEventListener("click", async () => {
      await switchNote("Note-Map");
      notesPreviewArea.scrollTop = 0;
    });

  // More event listeners, this time for the bottom right tools
  stickyNotes.addEventListener("click", showStickyNotes, { once: true });
  stickyNotesTextArea.addEventListener("input", () => {
    throttle({
      condition: !savingStickyNotes,
      beforeTimeout: () => (savingStickyNotes = true),
      callback: saveStickyNotes,
      afterTimeout: () => (savingStickyNotes = false),
    });
  });
  stickyNotesTextArea.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      hideStickyNotes();
    }
  });
  flashcardPrac.addEventListener("click", () => {
    showFlashcards(false, [note.name]);
  });

  // Here we add the event listeners for the bottom right tools
  for (let i = 0, n = brDots.children.length; i < n; i++) {
    const dotFunctions = ["Flashcards", "Scratch Pad"];
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

  // key bindings
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
        case ".":
          e.preventDefault();
          editor.focus();
          break;
        case "h":
          e.preventDefault();
          switchNote("home");
          break;
      }
    }
  });

  // Here we set up the dropzone for uploading images
  new Dropzone(document.body, {
    url: "/api/save/images",
    paramName: "avatar",
    clickable: false,
    acceptedFiles: "image/jpeg,image/png,image/gif,image/webp,application/pdf",
    error: () => notyf.error("An error occurred when saving an image"),
    success: (file, response) => {
      file.previewElement.remove();
      insertTemplate(`${properLink(response.image)}(${response.image})`);
      updateAndSaveNotesLocally();
      // saveNoteBookToDb(note.name);
      updateList();
    },
  });

  // Resize observer for the bottom left general info and the vault details
  const resizeObserver = new ResizeObserver(() => {
    bottomLeftGeneralInfo.style.left = vaultDetails.style.left =
      workspace.getBoundingClientRect().left + "px";
  });
  resizeObserver.observe(workspace);

  setGlobalPaletteClose(closePalette);
  setGlobalPopupClose(closePopupWindow);

  progBar.style.width = "420px";
  eid("loading").classList.add("loaded");
  progBar = null;
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.sancta) {
      switchNote(e.state.note, { page: e.state.page });
    }
  });
}

finish();
