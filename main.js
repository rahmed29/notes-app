import morphdom from "morphdom";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/animations/shift-toward-subtle.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Dropzone from "dropzone";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { mark, markHTML } from "./micromark-extension-mark/dev/index.js";
import { directive, directiveHtml } from "micromark-extension-directive";
import DOMPurify from "dompurify";
import "./node_modules/command-pal/public/build/bundle.js";
import themes from "./themes/index.js";
import { allSettledWithThrow } from "openai/lib/Util.mjs";

function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case "number":
          bytes += 8;
          break;
        case "string":
          bytes += obj.length * 2;
          break;
        case "boolean":
          bytes += 4;
          break;
        case "object":
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === "Object" || objClass === "Array") {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
    else return (bytes / 1073741824).toFixed(3) + " GiB";
  }

  return formatByteSize(sizeOf(obj));
}

window.memorySizeOf = memorySizeOf;

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
        <div id="flashcardsPrac" data-pos="hidden">
          <span id="flashcardsPracEmoji">
            <img
              draggable="false"
              class="emoji"
              src="/assets/icons/card_index_3d.png"
            />
          </span>
        </div>

        <div id="openCalendar" class="gone" data-pos="hidden" data-text="">
          <span id="openCalendarEmoji">
            <img draggable="false" class="emoji" src="/assets/icons/calendar_3d.png" />
          </span>
        </div>

        <div id="stickyNotes" class="gone" data-pos="hidden" data-text="">
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
      <div id="listOfBooks" data-pos="shown">
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
            data-vim="false"
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

// theming
function changeTheme(themeName) {
  try {
    document.getElementById("zitselTheme").remove();
  } catch (err) {}
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

// micromark directives
function cal(d) {
  if (d.type !== "textDirective") return false;

  this.tag("<div");
  this.tag(' class="note-calendar-wrapper"');

  const calEv = events.find((e) => e.id == d.label) || {
    allDay: true,
    title: "404",
    start: "1337-04-20",
    id: "404",
    extendedProps: {
      category: "404",
    },
  };

  this.tag(">");
  this.raw(
    DOMPurify.sanitize(`
    <div class = "note-calendar-event">
      <b>📅 ${calEv.start}</b>
      <span>${calEv.title}</span>
      <i>${calEv.extendedProps.category}</i>
    </div>
  `)
  );
  this.tag("</div>");
}

function ref(d) {
  if (d.type !== "textDirective") return false;

  this.tag("<span");
  this.tag(' class="reference"');

  this.tag(">");
  this.raw(d.label || "");
  this.tag("</span>");
}

// ace editor
const editor = ace.edit("editor");
// editor.setTheme("ace/theme/chrome");
editor.setOptions({
  maxLines: Infinity,
});
editor.renderer.setShowGutter(false);
editor.setOption("showPrintMargin", false);

const notesTextArea = document.getElementById("notesTextArea");
const notesPreviewArea = document.getElementById("notesPreviewArea");
const mainContainer = document.getElementById("mainContainer");
const notesAreaContainer = document.getElementById("notesAreaContainer");
const topLeftPageNumber = document.getElementById("topLeftPageNumbers");
const areNotesSavedIcon = document.getElementById("areNotesSavedIcon");
const list = document.getElementById("listOfBooks");
const listContainer = document.getElementById("listContainer");
const wikipediaBrainAnimation = document.getElementById(
  "wikipediaBrainAnimation"
);
const bottomLeftGeneralInfo = document.getElementById("bottomLeftGeneralInfo");
const generalInfoPageNumberEle = document.getElementById(
  "generalInfoPageNumber"
);
const uploadFolder = document.getElementById("yourUploads");
const morePages = document.getElementById("morePages");
const toolBar = document.getElementById("toolBar");
const brain = document.getElementById("icon8");
const border = document.getElementById("border");
const stickyNotesTextArea = document.getElementById("stickyNotesTextArea");
const stickyNotes = document.getElementById("stickyNotes");
const workspace = document.getElementById("workspace");
const tabs = document.getElementById("tabs");
const openCalendar = document.getElementById("openCalendar");
const flashcardPrac = document.getElementById("flashcardsPrac");
const myForm = document.getElementById("myForm");
const letterCount = document.getElementById("letterCount");
const wordCount = document.getElementById("wordCount");
const mode = document.getElementById("generalInfoViewMode");
const previewContent = document.getElementById("fill");
const brDots = document.getElementById("brDots");
const yellowButtons = document.getElementById("yellowButtons");
const progBar = document.getElementById("progBar");

// Text formatting stuff
// note names must be at least 1 character and cannot include any chars other than numbers, letters, hyphens, or underscores
var validNoteName = /^[a-zA-Z0-9-_]+$/;

// https://github.com/stiang/remove-markdown/blob/main/index.js
function removeMD(md, options) {
  options = options || {};
  options.listUnicodeChar = options.hasOwnProperty("listUnicodeChar")
    ? options.listUnicodeChar
    : false;
  options.stripListLeaders = options.hasOwnProperty("stripListLeaders")
    ? options.stripListLeaders
    : true;
  options.gfm = options.hasOwnProperty("gfm") ? options.gfm : true;
  options.useImgAltText = options.hasOwnProperty("useImgAltText")
    ? options.useImgAltText
    : true;
  options.abbr = options.hasOwnProperty("abbr") ? options.abbr : false;
  options.replaceLinksWithURL = options.hasOwnProperty("replaceLinksWithURL")
    ? options.replaceLinksWithURL
    : false;
  options.htmlTagsToSkip = options.hasOwnProperty("htmlTagsToSkip")
    ? options.htmlTagsToSkip
    : [];

  var output = md || "";

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*/gm, "");

  try {
    if (options.stripListLeaders) {
      if (options.listUnicodeChar)
        output = output.replace(
          /^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm,
          options.listUnicodeChar + " $1"
        );
      else output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1");
    }
    if (options.gfm) {
      output = output
        // Header
        .replace(/\n={2,}/g, "\n")
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, "")
        // Strikethrough
        .replace(/~~/g, "")
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, "");
    }
    if (options.abbr) {
      // Remove abbreviations
      output = output.replace(/\*\[.*\]:.*\n/, "");
    }
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, "");

    var htmlReplaceRegex = new RegExp("<[^>]*>", "g");
    if (options.htmlTagsToSkip.length > 0) {
      // Using negative lookahead. Eg. (?!sup|sub) will not match 'sup' and 'sub' tags.
      var joinedHtmlTagsToSkip = "(?!" + options.htmlTagsToSkip.join("|") + ")";

      // Adding the lookahead literal with the default regex for html. Eg./<(?!sup|sub)[^>]*>/ig
      htmlReplaceRegex = new RegExp(
        "<" + joinedHtmlTagsToSkip + "[^>]*>",
        "ig"
      );
    }

    output = output
      // Remove HTML tags
      .replace(htmlReplaceRegex, "")
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, "")
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, "")
      .replace(/\s{0,2}\[.*?\]: .*?$/g, "")
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? "$1" : "")
      // Remove inline links
      .replace(
        /\[([^\]]*?)\][\[\(].*?[\]\)]/g,
        options.replaceLinksWithURL ? "$2" : "$1"
      )
      // Remove blockquotes
      .replace(/^(\n)?\s{0,3}>\s?/gm, "$1")
      // .replace(/(^|\n)\s{0,3}>\s?/g, '\n\n')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "")
      // Remove atx-style headers
      .replace(
        /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm,
        "$1$3$4$6"
      )
      // Remove * emphasis
      .replace(/([\*]+)(\S)(.*?\S)??\1/g, "$2$3")
      // Remove _ emphasis. Unlike *, _ emphasis gets rendered only if
      //   1. Either there is a whitespace character before opening _ and after closing _.
      //   2. Or _ is at the start/end of the string.
      .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, "$1$3$4$5")
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, "$2")
      // Remove inline code
      .replace(/`(.+?)`/g, "$1")
      // // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      // .replace(/\n{2,}/g, '\n\n')
      // // Remove newlines in a paragraph
      // .replace(/(\S+)\n\s*(\S+)/g, '$1 $2')
      // Replace strike through
      .replace(/~(.*?)~/g, "$1");
  } catch (e) {
    console.error(e);
    return md;
  }
  return output;
}

function format(str) {
  return micromark(str, {
    extensions: [gfm(), math(), mark(), directive()],
    htmlExtensions: [
      gfmHtml(),
      mathHtml(),
      markHTML(),
      directiveHtml({ ref, cal }),
    ],
  });
}

// tooltips
const wikipediaTippy = tippy([brain], {
  animation: "shift-toward-subtle",
  arrow: false,
  content: `<div id = 'brain' style = 'width: auto;'>Info on highlighted text will appear here</div>`,
  interactive: true,
  allowHTML: true,
  maxWidth: "500px",
  placement: "bottom-end",
})[0];

const synced = tippy("#areNotesSavedIcon", {
  animation: "shift-toward-subtle",
  arrow: false,
  content: "Notes are saved",
  placement: "bottom-end",
})[0];

const editingMode = tippy("#generalInfoViewMode", {
  animation: "shift-toward-subtle",
  arrow: false,
  content: localStorage.getItem("/viewPref"),
  placement: "top",
})[0];

const generalInfoPageNumber = tippy("#generalInfoPageNumber", {
  animation: "shift-toward-subtle",
  arrow: false,
  content: "Loading",
  placement: "top",
})[0];

const toolBarTips = [
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

anonTooltips.forEach((obj) => {
  tippy(obj.name, {
    arrow: false,
    animation: "shift-toward-subtle",
    content: obj.content,
    placement: "bottom",
  });
});

// current theme
let currTheme = null;

// toast notifs
const notyf = new Notyf({
  position: {
    y: "top",
    x: "center",
  },
  dismissible: true,
});

// debounce when switching notes
let switching = false;

// notebook names that aren't allowed because they are being used for other stuff
const reservedNames = [
  {
    data: {
      name: "home",
      content: [
        "# 👋 Welcome Home!\n\nUse the __side menu__, the __toolbar__, or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!",
      ],
      children: [],
      parents: [],
      saved: false,
    },
  },
  {
    data: {
      name: "todo__list",
      content: [
        "This notebook is reserved for storing your calendar events. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
    },
  },
  {
    data: {
      name: "sticky__notes",
      content: [
        "This notebook is reserved for storing your sticky note. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
    },
  },
  {
    data: {
      name: "flash__cards",
      content: [
        "This notebook is reserved for storing your flahscards. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
    },
  },
  {
    data: {
      name: "AI-Summary",
      content: ["This notebook name is reserved for AI Summaries. Sorry!"],
      children: [],
      parents: [],
      saved: false,
    },
  },
  {
    data: {
      name: "Image-Preview",
      content: [
        "This notebook name is reserved for previewing uploaded images. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
    },
  },
];

// active and completed events for todo
let events;
let pastEvents;

// flashcards
let flashcards = [];
let currCard = null;

// wikiSearch enabled
let wikiEnabled = true;

// variable for the tree list
let nestedBooks = null;
const droppedFolders = new Set(
  JSON.parse(localStorage.getItem("/fileStructure")) || []
);
const root = {
  name: "_root",
  children: [],
  excerpt: [],
  parents: [],
};

// event listeners and stuff we need to destroy on repaints
let tabTippys = new Map();
let lastDynamicTippy = null;
let pageHandlers = [];
let listHandlers = [];
let previewHandlers = [];

// instance of fullcalendar, air date picker and command pal for later destruction
let calendar;
let datePicker;
let c;

function insertStickyNote() {
  if (!reservedNames.some((e) => e.data.name === note.name)) {
    editor.insert(stickyNotesTextArea.value);
    updateAndSaveNotesLocally();
  } else {
    notyf.error("Reserved notebooks are read only");
  }
}

// Image stuff
const dropzone = new Dropzone(document.body, {
  url: "/api/save/images",
  paramName: "avatar",
  clickable: false,
  acceptedFiles: "image/jpeg,image/png,image/gif,image/webp,application/pdf",
  error: () => {
    notyf.error("An error occurred when saving an image.");
  },
  success: (file, response) => {
    file.previewElement.remove();
    editor.insert(`![](${response})`);
    updateAndSaveNotesLocally();
    // saveNoteBookToDb();
    updateList();
  },
});

async function insertAndSaveImage() {
  if (!reservedNames.some((e) => e.data.name === note.name)) {
    const formData = new FormData(myForm);
    const imageUploadStatus = await fetch("/api/save/images", {
      method: "POST",
      body: formData,
    });
    if (imageUploadStatus.ok) {
      const response = await imageUploadStatus.text();
      editor.insert(`![](${response})`);
      updateAndSaveNotesLocally();
      updateList();
      // saveNoteBookToDb();
    } else {
      notyf.error("An error occurred when saving an image.");
    }
  } else {
    notyf.error("Reserved notebooks are read only");
  }
}

async function deleteImageFromDb(image) {
  let imageInText = `![](/uploads/${image})`;
  const imageDelete = await fetch(`/api/delete/images/${image}`, {
    method: "DELETE",
  });
  if (imageDelete.ok) {
    editor.session.setValue(editor.getValue().replaceAll(imageInText, ""));
    updateAndSaveNotesLocally();
    // saveNoteBookToDb();
    updateList();
  } else {
    notyf.error("An error occurred when deleting an image.");
  }
}

function removeImageToolTip(e) {
  contextMenu(
    e,
    [
      {
        attr: this.src.substring(this.src.indexOf("/uploads/") + 9),
        text: "Open Image",
        click: function () {
          window.open(`/uploads/${this.getAttribute("data-props")}`, "_blank");
          delContextMenu();
        },
        appearance: "ios",
      },
      {
        attr: this.src.substring(this.src.indexOf("/uploads/") + 9),
        text: "Delete Image",
        click: function () {
          this.classList.add("rios");
          this.innerText = "Confirm";
          this.addEventListener(
            "click",
            () => {
              deleteImageFromDb(this.getAttribute("data-props"));
              delContextMenu();
            },
            { once: true }
          );
        },
        appearance: "ios",
      },
    ],
    [`${e.clientX}px`, `${e.clientY}px`]
  );
}

// tooltip for [[references]] to notebooks
async function referToolTip() {
  try {
    lastDynamicTippy.destroy();
  } catch (err) {
    // console.log(err);
  }
  delContextMenu();
  const given = this;
  lastDynamicTippy = tippy([given], {
    theme: currTheme.theme_type,
    animation: "shift-toward-subtle",
    content: "Loading...",
    allowHTML: true,
    interactive: true,
    arrow: false,
  })[0];
  try {
    const page = this.getAttribute("data-page");
    const content =
      this.getAttribute("data-bookname") === note.name
        ? format(note.content[page])
        : format(
            (
              await getAnyBookContent(
                this.getAttribute("data-bookname"),
                "content"
              )
            )[page]
          );
    lastDynamicTippy.setContent(
      `<div class = 'pagePreviewContainer'>${content}</div>`
    );
  } catch (err) {
    lastDynamicTippy.destroy();
  }
}

// Re-Instantiate the command palette
async function defineCmd() {
  try {
    c.destroy();
  } catch (err) {
    // console.log(err);
  }

  const cmdPgs = note.content.map((e, i) => {
    const name = e.indexOf("\n") === -1 ? e : e.substring(0, e.indexOf("\n"));
    return {
      name: `📄 ${removeMD(name)}`,
      handler: () => jumpToDesiredPage(i),
    };
  });

  const family = await getFamily(note.name);
  const json = await getList();
  const cmdList = json.map((e) => ({
    name: `${e.name}`,
    handler: () => switchNote(e.name),
  }));

  const cmdNest = json.reduce((arr, e) => {
    if (e.name !== note.name && !family.includes(e.name)) {
      arr.push({
        name: `${e.name}`,
        handler: () => nestNote(note.name, e.name),
      });
    }
    return arr;
  }, []);

  const cmdRel = (await getAnyBookContent(note.name, "parents")).map(
    (parent) => ({
      name: `${parent}`,
      handler: () => relinquishNote(note.name, parent),
    })
  );

  let commands = [
    {
      name: "New Page",
      handler: () => jumpToDesiredPage(note.content.length),
    },
    {
      name: "Go to Page",
      children: cmdPgs,
    },
    {
      name: "Open Notebook",
      children: cmdList,
    },
    {
      name: "Save Notebook",
      handler: () => saveNoteBookToDb(),
    },
    {
      name: "Insert Image",
      handler: () => document.getElementById("getFile1").click(),
    },
    {
      name: "Nest Notebook",
      children: cmdNest,
    },
    {
      name: "Relinquish Notebook",
      children: cmdRel,
    },
    {
      name: "Compare Local Notes to DB",
      handler: () => showBookDiffPopup(),
    },
    {
      name: "AI Summary",
      handler: () => AISUmmary(),
    },
    {
      name: "Create Flashcards",
      handler: () => flashcardMode(),
    },
    {
      name: "Delete This Page",
      children: [
        {
          name: "Confirm",
          handler: () => deletePage(),
        },
      ],
    },
    {
      name: "Delete Notebook",
      children: [
        {
          name: "Confirm",
          handler: () => deleteNoteBookFromDb(),
        },
      ],
    },
    {
      name: "Force Update Notebook",
      children: [
        {
          name: "Confirm",
          handler: () => forceUpdateNotes(),
        },
      ],
    },
    {
      name: "Practice Flashcards",
      handler: () => showFlashcards(),
    },
    {
      name: "Open Calendar",
      handler: () => showTodo(false),
    },
    // {
    //   name: "Open Sticky Note",
    //   handler: () => showStickyNotes(),
    // },
    {
      name: "Import Sticky Note",
      handler: () => {
        insertStickyNote();
      },
    },
    {
      name: "Insert Calendar Event",
      handler: () => {
        showTodo(true);
      },
    },
    {
      name: "Toggle Vim Mode",
      handler: () => {
        if (notesTextArea.getAttribute("data-vim") === "true") {
          editor.setKeyboardHandler("ace/keyboard/vscode");
          notesTextArea.setAttribute("data-vim", "false");
        } else {
          editor.setKeyboardHandler("ace/keyboard/vim");
          notesTextArea.setAttribute("data-vim", "true");
        }
      },
    },
    {
      name: "Change Theme",
      children: themes
        .map((e) => {
          return {
            name: e.name
              .split("_")
              .map((e) => e.substring(0, 1).toUpperCase() + e.substring(1))
              .join(" "),
            handler: () => {
              changeTheme(e.name);
            },
          };
        })
        .sort((a, b) => {
          const name1 = a.name;
          const name2 = b.name;
          if (name1 < name2) {
            return -1;
          }
          if (name1 > name2) {
            return 1;
          }
          // names must be equal
          return 0;
        }),
    },
    {
      name: "Switch View",
      children: [
        {
          name: "Split",
          handler: () => {
            localStorage.setItem("/viewPref", "split");
            editingWindow("split");
          },
        },
        {
          name: "Read",
          handler: () => {
            localStorage.setItem("/viewPref", "read");
            editingWindow("read");
          },
        },
        {
          name: "Write",
          handler: () => {
            localStorage.setItem("/viewPref", "write");
            editingWindow("write");
          },
        },
      ],
    },
    {
      name: "Toggle Wikipedia Search",
      handler: () => toggleWikiSearch(),
    },
    {
      name: "Toggle List",
      handler: () => toggleList(),
    },
  ].sort((a, b) => {
    const name1 = a.name;
    const name2 = b.name;
    if (name1 < name2) {
      return -1;
    }
    if (name1 > name2) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  c = new CommandPal({
    hotkey: "ctrl+space",
    placeholder: `Search...`,
    commands: commands,
  });
  c.start();
}

// note stuff
const savedWS = new Set(JSON.parse(localStorage.getItem("/workspace"))) || [];
let library = new Map();
let lastNote = null;
let note = null;

// note class holding all details about a notebook
class Note {
  constructor() {}
}

// helper function for dealing with blank page
function pageIsNull(page) {
  if (!page || page === "undefined") {
    return true;
  } else {
    return false;
  }
}

function getWrittenPages(arr) {
  const response = arr.reduce((arr, e) => {
    if (!pageIsNull(e)) {
      arr.push(e);
    }
    return arr;
  }, []);
  if (!response.length) {
    response.push("");
  }
  return response;
}

// formatting things once you have selected a note and want to move around in it
// jumpToDesiredPage -> handlePageMovement -> accents -> updateAndSaveNotesLocally -> syncStatus -> recursiveSetStuff or setStuff -> formatNonText
function jumpWrapper() {
  jumpToDesiredPage(this.getAttribute("data-page"));
}

function jumpToDesiredPage(desired) {
  if (desired < note.pgN) {
    handlePageMovement(true, note.pgN - desired, true);
  } else if (desired > note.pgN) {
    handlePageMovement(false, desired - note.pgN, true);
  }
}

function handlePageMovement(goBack, amount, shouldCreateNewPage, e) {
  if (goBack && note.pgN > 0) {
    note.pgN -= amount;
    accents();
  } else if (!goBack) {
    if (
      note.pgN + amount >= note.content.length &&
      shouldCreateNewPage &&
      !reservedNames.some((e) => e.data.name === note.name)
    ) {
      note.content.push("");
      note.pgN += amount;
      accents();
      defineCmd();
    } else if (
      note.pgN + amount >= note.content.length &&
      !shouldCreateNewPage
    ) {
      contextMenu(e, [
        {
          text: "New Page",
          click: (e) => {
            e.stopPropagation();
            handlePageMovement(false, 1, true);
            delContextMenu();
          },
          appearance: "ios",
        },
      ]);
    } else if (!(note.pgN + amount >= note.content.length)) {
      note.pgN += amount;
      accents();
    }
  }
}

function accents() {
  if (!note.aceSessions[note.pgN]) {
    const newSession = ace.createEditSession(note.content[note.pgN]);
    editor.setSession(newSession);
    editor.session.setUseWrapMode(true);
    editor.session.setMode("ace/mode/markdown");
    editor.session.on("change", updateAndSaveNotesLocally);
    note.aceSessions[note.pgN] = newSession;
    editor.setSession(note.aceSessions[note.pgN]);
  } else {
    editor.setSession(note.aceSessions[note.pgN]);
  }
  // editor.session.setValue(note.content[note.pgN]);
  window.history.replaceState({}, "", `${note.name}?${note.pgN + 1}`);
  updateAndSaveNotesLocally();
  createPageNumbers();
  editor.focus();
}

async function updateAndSaveNotesLocally() {
  note.content[note.pgN] = editor.getValue();
  if (!reservedNames.some((e) => e.data.name === note.name)) {
    localStorage.setItem(note.name, JSON.stringify(note.content));
  }
  syncStatus(note.dbSave);
  previewHandlers = previewHandlers.reduce((arr, e) => {
    e.element.removeEventListener(e.type, e.listener);
    return arr;
  }, []);
  const v = document.createElement("div");
  v.innerHTML = format(editor.getValue());
  v.id = "fill";
  morphdom(previewContent, v);
  formatNonText(previewContent);
  letterCount.innerText = editor
    .getValue()
    .replaceAll(" ", "")
    .replaceAll("\n", "")
    .length.toString()
    .padStart(5, "0");
  wordCount.innerText = (
    notesPreviewArea.innerText
      .replaceAll("\n", " ")
      .replace(/  +/g, " ")
      .split(" ").length - 1
  )
    .toString()
    .padStart(5, "0");
}

function syncStatus(dbSave) {
  if (reservedNames.some((e) => e.data.name === note.name)) {
    try {
      document.getElementById(`book__${note.name}`).innerText = note.name;
      document.title = note.name;
      areNotesSavedIcon.style.filter = "grayscale(1)";
    } catch (err) {
      // console.log(err);
    }
  } else if (!note.saved) {
    synced.setContent(`Notes are not saved`);
    areNotesSavedIcon.style.filter = "hue-rotate(270deg)";
    document.title = `* ${note.name}`;
    try {
      document.getElementById(
        `book__${note.name}`
      ).innerText = `* ${note.name}`;
    } catch (err) {
      // console.log(err);
    }
  } else {
    let writtenPages = getWrittenPages(note.content);
    if (JSON.stringify(writtenPages) === JSON.stringify(dbSave)) {
      areNotesSavedIcon.style.filter = "none";
      synced.setContent(`Notes were saved at ${note.timeOfSave}`);
      document.title = note.name;
      try {
        document.getElementById(`book__${note.name}`).innerText = note.name;
      } catch (err) {
        // console.log(err);
      }
    } else {
      areNotesSavedIcon.style.filter = "grayscale(1)";
      synced.setContent(
        `Notes shown differ from saved notes by ${Math.abs(
          JSON.stringify(note.content).length - JSON.stringify(dbSave).length
        )} chars`
      );
      document.title = `* ${note.name}`;
      try {
        document.getElementById(
          `book__${note.name}`
        ).innerText = `* ${note.name}`;
      } catch (err) {
        // console.log(err);
      }
    }
  }
}

function formatNonText(ele) {
  for (const node of ele.querySelectorAll(".reference")) {
    node.setAttribute("data-bookname", node.innerText);
    node.setAttribute("data-page", 0);
    node.addEventListener("click", switchWrapper);
    previewHandlers.push({
      element: node,
      type: "click",
      listener: switchWrapper,
    });
    node.addEventListener("mouseover", referToolTip);
    previewHandlers.push({
      element: node,
      type: "mouseover",
      listener: referToolTip,
    });
  }
  for (const node of ele.querySelectorAll("img")) {
    node.addEventListener("contextmenu", removeImageToolTip);
    previewHandlers.push({
      element: node,
      type: "contextmenu",
      listener: removeImageToolTip,
    });
  }
}

// loading workspace from last session
// adds event listener for closing tab parameter
function addCloseTab(div) {
  function closeTab(e) {
    if (e.button === 1) {
      e.preventDefault();
      const temp = this.getAttribute("data-bookname");
      library.delete(temp);
      tabTippys.get(temp).destroy();
      tabTippys.delete(temp);
      savedWS.delete(temp);
      localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
      this.removeEventListener("click", switchTab);
      // self removing event listener
      this.removeEventListener("mouseup", closeTab);
      this.remove();
      if (!savedWS.size) {
        switchNote("home");
      } else if (note && temp === note.name) {
        switchNote(Array.from(savedWS)[Array.from(savedWS).length - 1]);
      }
    }
  }
  div.addEventListener("click", switchTab);
  div.addEventListener("mouseup", closeTab);
}

function createWorkspace() {
  Array.from(savedWS).forEach((note) => {
    const div = document.createElement("div");
    const txt = note;
    div.innerText = txt;
    div.classList.add("tab");
    div.id = `book__${txt}`;
    div.setAttribute("data-bookname", txt);
    div.addEventListener("click", switchTab);
    addCloseTab(div);
    tabTippys.set(
      note,
      tippy([div], {
        theme: "dark",
        animation: "shift-toward-subtle",
        placement: "bottom-end",
        content: txt,
        arrow: false,
      })[0]
    );
    tabs.prepend(div);
  });
  list.style.width = `${parseInt(localStorage.getItem("/listSize") || 300)}px`;
  if (localStorage.getItem("/listShown") === "false") {
    hideList();
  } else {
    showList();
  }
}

// for tabs
function switchTab() {
  switchNote(this.getAttribute("data-bookname"));
}

// for list
function switchWrapper() {
  switchNote(
    this.getAttribute("data-bookname"),
    parseInt(this.getAttribute("data-page"))
  );
}

// function to switch between notes.
// in essense we are trying to mimic the DB schema in memory using the 'library' hashmap
async function switchNote(noteName, page) {
  if (!validNoteName.test(noteName)) {
    notyf.error("Invalid note name");
    return 0;
  }
  hideBookDiffPopup();
  // can't do !page because page can be be 0 and !0 => true
  if (page == null) {
    try {
      page = library.get(noteName).pgN;
    } catch (err) {
      page = 0;
    }
  }
  if (
    note &&
    noteName === note.name &&
    page === note.pgN &&
    !reservedNames.some((e) => e.data.name === note.name)
  ) {
    return 1;
  }
  if (switching) {
    return 0;
  }
  switching = true;
  try {
    document.getElementById(`book__${note.name}`).classList.remove("openTab");
  } catch (err) {
    // console.log(err);
  }
  lastNote = note;
  note = new Note();
  const data = (await getAnyBookContent(noteName, "_data")) || {
    name: noteName,
    content: [""],
    children: [],
    parents: [],
    saved: false,
  };
  note.name = noteName.replaceAll("/", "");
  note.content = JSON.parse(localStorage.getItem(noteName)) || data.content;
  note.pgN = page < note.content.length ? page : note.content.length - 1;
  note.dbSave = data.dbSave || data.content;
  note.children = data.children;
  note.parents = data.parents;
  note.family = await getFamily(noteName, data);
  note.timeOfSave = data.date;
  note.saved = data.saved;
  note.aceSessions = data.aceSessions || [];
  if (pageIsNull(note.pgN)) {
    note.pgN = 0;
    note.content = getWrittenPages(note.content);
  }
  try {
    document.getElementById(`book__${note.name}`).classList.add("openTab");
  } catch (err) {
    const div = document.createElement("div");
    const txt = note.name;
    div.innerText = txt;
    div.classList.add("tab");
    div.classList.add("openTab");
    div.id = `book__${txt}`;
    div.setAttribute("data-bookname", txt);
    addCloseTab(div);
    tabTippys.set(
      noteName,
      tippy([div], {
        theme: "dark",
        animation: "shift-toward-subtle",
        placement: "bottom-end",
        content: txt,
        arrow: false,
      })[0]
    );
    tabs.prepend(div);
  }
  if (reservedNames.some((e) => e.data.name === note.name)) {
    toolBar.classList.add("homeToolBar");
    note.readOnly = true;
    editor.setReadOnly(true);
  } else {
    toolBar.classList.remove("homeToolBar");
    note.readOnly = false;
    editor.setReadOnly(false);
  }
  library.set(note.name, note);
  accents();
  if (!lastNote || lastNote.name !== note.name) {
    defineCmd();
  }
  savedWS.add(noteName);
  localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
  switching = false;
}

// creating the tree list
function dropWrapper(e) {
  e.stopPropagation();
  if (this.getAttribute("data-pos") === "down") {
    droppedFolders.delete(this.parentNode.getAttribute("data-bookname"));
    this.nextElementSibling.style.display = "none";
    this.classList.remove("down");
    this.setAttribute("data-pos", "up");
  } else {
    droppedFolders.add(this.parentNode.getAttribute("data-bookname"));
    this.nextElementSibling.style.display = "flex";
    this.classList.add("down");
    this.setAttribute("data-pos", "down");
  }
  const arrayFromSet = Array.from(droppedFolders);
  localStorage.setItem("/fileStructure", JSON.stringify(arrayFromSet));
}

async function createList() {
  nestedBooks = new Set();
  listHandlers = listHandlers.reduce((arr, e) => {
    e.element.removeEventListener(e.type, e.listener);
    return arr;
  }, []);
  const result = await getList();
  root.children = result.map((obj) => {
    return obj.name;
  });
  const gigaFolder = nestedList(root, result).childNodes[1];
  gigaFolder.classList.add("gigaFolder");
  while (listContainer.firstChild) {
    listContainer.firstChild.remove();
  }
  listContainer.appendChild(gigaFolder);
  appendUploads();

  // TODO: look at this
  nestedBooks.forEach(() => {
    for (const node of gigaFolder.childNodes) {
      if (nestedBooks.has(node.firstChild.getAttribute("data-bookname"))) {
        node.remove();
        break;
      }
    }
  });
}

window.memorySizeOf = memorySizeOf;

let listInMemory = null;

async function getList() {
  if (!listInMemory) {
    await updateList();
  }
  return listInMemory;
}

async function updateList() {
  const list = await fetch("/api/get/list");
  const json = await list.json();
  listInMemory = json.data;
  createList();
}

function nestedList(obj, allNotes) {
  if (obj.parents[0]) {
    nestedBooks.add(obj.name);
  }
  const folder = document.createElement("div");
  folder.setAttribute("data-bookname", obj.name);
  folder.setAttribute("data-searchValue", `${obj.name}`);
  folder.classList.add("item");
  const folderName = document.createElement("div");
  folderName.classList.add("folderName");
  folderName.addEventListener("click", dropWrapper);
  listHandlers.push({
    element: folderName,
    type: "click",
    listener: dropWrapper,
  });
  folderName.innerText = obj.name;
  folder.appendChild(folderName);
  const ul = document.createElement("ul");
  folder.appendChild(ul);
  for (let i = 0, n = obj.excerpt.length; i < n; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("data-page", i);
    a.setAttribute("data-bookname", obj.name);
    a.addEventListener("click", switchWrapper);
    listHandlers.push({ element: a, type: "click", listener: switchWrapper });
    // }
    if (!removeMD(obj.excerpt[i])) {
      a.innerHTML = "<i>Empty Page</i>";
    } else {
      a.innerText = removeMD(obj.excerpt[i]);
    }
    a.addEventListener("contextmenu", showPagePreview);
    listHandlers.push({
      element: a,
      type: "contextmenu",
      listener: showPagePreview,
    });
    li.appendChild(a);
    ul.appendChild(li);
  }
  if (obj.children[0]) {
    obj.children.forEach((childName) => {
      folder.setAttribute(
        "data-searchValue",
        `${folder.getAttribute("data-searchValue")}-${obj.children.join("-")}`
      );
      const li = document.createElement("li");
      try {
        li.appendChild(
          nestedList(
            allNotes.find((obj) => obj.name === childName),
            allNotes,
            false
          )
        );
        ul.prepend(li);
      } catch (err) {
        // console.log(err);
      }
    });
  }
  if (droppedFolders.has(obj.name)) {
    folderName.setAttribute("data-pos", "down");
    ul.style.display = "flex";
    folderName.classList.add("down");
  } else {
    folderName.setAttribute("data-pos", "up");
  }
  folder.appendChild(ul);
  return folder;
}

function showImagePreview(e) {
  showPagePreview(e, `![](${e.target.getAttribute("data-href")})`);
}

function goToImagePreview(e) {
  reservedNames.find((e) => e.data.name === "Image-Preview").data.content = [
    `![](${e.target.getAttribute("data-href")})`,
  ];
  switchNote("Image-Preview");
}

async function appendUploads() {
  const images = await fetch("/api/get/image-list");
  if (!images.ok) {
    notyf.error("An error occurred when creating the image-list");
    return 0;
  }
  const json2 = await images.json();
  const result2 = json2["data"];
  const ul = uploadFolder.nextSibling.nextSibling;
  uploadFolder.setAttribute("data-children", result2.length);
  while (ul.firstChild) {
    ul.firstChild.remove();
  }
  result2.forEach((file) => {
    const a = document.createElement("a");
    a.addEventListener("contextmenu", showImagePreview);
    listHandlers.push({
      element: a,
      type: "mouseenter",
      listener: showImagePreview,
    });
    a.setAttribute("data-href", `/uploads/${file}`);
    a.innerText = file;
    a.addEventListener("click", goToImagePreview);
    const li = document.createElement("li");
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function search(term) {
  for (const item of listContainer.firstChild.childNodes) {
    const folder = item.firstChild;
    folder.style.display = "inline-block";
    const terms = folder.getAttribute("data-searchValue");
    if (!terms.toLowerCase().includes(term.toLowerCase())) {
      folder.style.display = "none";
    }
  }
}

function resizeList(e) {
  border.classList.add("currPage");
  document.body.style.cursor = "w-resize";
  if (e.clientX <= 600 && e.clientX >= 300) {
    list.style.width = `${e.clientX - 16}px`;
    workspace.style.width = `calc(100% - 25px - ${e.clientX - 16}px)`;
    bottomLeftGeneralInfo.style.left = `${e.clientX - 16 + 25}px`;
  }
}

function hideList() {
  workspace.style.width = "calc(100% - 20px";
  bottomLeftGeneralInfo.style.left = "25px";
  list.style.display = "none";
  list.setAttribute("data-pos", "hidden");
  border.style.display = "none";
  tabs.style.marginLeft = "0px";
  localStorage.setItem("/listShown", "false");
}

function showList() {
  workspace.style.width = `calc(100% - 25px - ${
    localStorage.getItem("/listSize") || 300
  }px)`;
  bottomLeftGeneralInfo.style.left =
    parseInt(localStorage.getItem("/listSize") || 300) + 25 + "px";
  list.setAttribute("data-pos", "shown");
  list.style.display = "flex";
  border.style.display = "inline";
  tabs.style.marginLeft = "-5px";
  localStorage.setItem("/listShown", "true");
}

function toggleList() {
  if (list.getAttribute("data-pos") === "shown") {
    hideList();
  } else {
    showList();
  }
}

// page numbers on the left
function createPageNumbers() {
  pageHandlers = pageHandlers.reduce((arr, e) => {
    e.element.removeEventListener(e.type, e.listener);
    return arr;
  }, []);
  while (topLeftPageNumber.firstChild) {
    topLeftPageNumber.firstChild.remove();
  }
  generalInfoPageNumberEle.innerText = note.pgN + 1;
  generalInfoPageNumber.setContent(`Page ${note.pgN + 1}`);
  const timesToGo = note.content.length <= 9 ? note.content.length : 9;
  for (let i = 0, n = timesToGo; i < n; i++) {
    const box = document.createElement("div");
    box.id = `whereTo${i}`;
    box.classList.add("whereTo");
    box.setAttribute("data-bookname", note.name);
    box.setAttribute("data-page", i);
    box.addEventListener("mouseover", showPagePreview);
    pageHandlers.push({
      element: box,
      type: "mouseover",
      listener: showPagePreview,
    });
    box.addEventListener("mouseleave", delContextMenu);
    pageHandlers.push({
      element: box,
      type: "mouseleave",
      listener: delContextMenu,
    });
    box.addEventListener("click", jumpWrapper);
    pageHandlers.push({ element: box, type: "click", listener: jumpWrapper });
    box.addEventListener("wheel", scrollCM);
    pageHandlers.push({ element: box, type: "wheel", listener: scrollCM });
    box.innerText = i + 1;
    topLeftPageNumber.appendChild(box);
  }
  if (note.content.length > 9) {
    morePages.style.display = "inline";
    morePages.setAttribute("data-page", note.content.length - 1);
  } else {
    morePages.style.display = "none";
  }
  morePages.classList.remove("currPage");
  const currPage = document.getElementById(`whereTo${note.pgN}`) || morePages;
  currPage.classList.add("currPage");
}

async function showMorePages(e) {
  const buttons = note.content.reduce((arr, e, i) => {
    if (i >= 9) {
      const app = i === note.pgN ? "currPage" : "random";
      arr.push({
        text: `Page ${i}`,
        click: (e) => {
          jumpToDesiredPage(i);
          showMorePages(e);
        },
        appearance: app,
      });
    }
    return arr;
  }, []);
  contextMenu(e, buttons, ["21px", `${topLeftPageNumber.scrollHeight + 5}px`]);
}

// note creation and deletion stuff
async function getAnyBookContent(bookName, desiredInfo) {
  if (reservedNames.some((e) => e.data.name === bookName)) {
    if (desiredInfo === "_data") {
      return reservedNames.find((e) => e.data.name === bookName)["data"];
    }
    return reservedNames.find((e) => e.data.name === bookName)["data"][
      desiredInfo
    ];
  }
  if (library.get(bookName)) {
    const cBook = library.get(bookName);
    const cachedData = {
      data: {
        name: cBook.name,
        date: cBook.timeOfSave,
        content: cBook.content,
        dbSave: cBook.dbSave,
        children: cBook.children,
        parents: cBook.parents,
        saved: cBook.saved,
        aceSessions: cBook.aceSessions,
      },
    };
    if (desiredInfo === "_data") {
      return cachedData["data"];
    }
    return cachedData["data"][desiredInfo];
  } else if (
    listInMemory &&
    (desiredInfo === "parents" || desiredInfo === "children")
  ) {
    const objectInList = listInMemory.find((e) => e.name === bookName);
    if (objectInList) {
      return objectInList[desiredInfo];
    }
  }
  const response = await fetch(`/api/get/notebooks/${bookName}`);
  if (response.ok) {
    let json = await response.json();
    if (desiredInfo === "_data") {
      return json["data"];
    }
    return json["data"][desiredInfo];
  } else if (response.status === 404) {
    return null;
  } else {
    notyf.error(`There was an error retrieving notebook: ${bookName}`);
    return null;
  }
}

async function forceUpdateNotes() {
  const name = note.name;
  try {
    document.getElementById(`book__${note.name}`).remove();
    document
      .getElementById(`book__${note.name}`)
      .removeEventListener("click", switchTab);
  } catch (err) {
    // console.log(err);
  }
  const pg = note.pgN;
  note = null;
  localStorage.removeItem(name);
  library.delete(name);
  switchNote(name, pg);
  notyf.success("Notes were pulled from database");
}

async function copyBook(newName) {
  const existingItem = await fetch(`/api/get/notebooks/${newName}`);
  if (existingItem.status === 404 && newName) {
    const thisItem = await fetch(`/api/get/notebooks/${note.name}`);
    const save = await fetch("/api/save/notebooks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        content: note.content,
        date: new Date().toLocaleString(),
      }),
    });
    if (save.ok) {
      localStorage.setItem(newName, localStorage.getItem(note.name));
      updateList();
      switchNote(newName, 0);
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  }
}

function deletePage() {
  if (note.content.length > 1) {
    note.aceSessions[note.pgN] = null;
    note.content.splice(note.pgN, 1);
    note.pgN = note.content.length - 1;
    accents(false);
    defineCmd();
  }
}

async function saveNoteBookToDb() {
  if (
    note.name.includes("%") ||
    reservedNames.some((e) => e.data.name === note.name)
  ) {
    notyf.error("Something went wrong");
    return 0;
  }
  note.content[note.pgN] = editor.getValue();
  note.content = getWrittenPages(note.content);
  localStorage.setItem(note.name, JSON.stringify(note.content));

  const saveStatus = await fetch("/api/save/notebooks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: note.name,
      content: note.content,
      date: new Date().toLocaleString(),
    }),
  });
  if (saveStatus.ok) {
    areNotesSavedIcon.classList.add("saved");
    note.dbSave = [...note.content];
    if (note.pgN > note.content.length - 1) {
      jumpToDesiredPage(note.content.length - 1);
    } else {
      accents(false);
    }
    note.saved = true;
    note.timeOfSave = new Date().toLocaleString();
    syncStatus(note.dbSave);
  } else {
    notyf.error("An error occurred when saving a notebook");
  }
  updateList();
  defineCmd();
}

async function deleteNoteBookFromDb() {
  const noteDeleteStatus = await fetch(`/api/delete/notebooks/${note.name}`, {
    method: "DELETE",
  });
  if (noteDeleteStatus.ok) {
    notyf.success(`Notebook has been deleted from the database`);

    library.get(note.name).parents.forEach((parent) => {
      try {
        library.get(parent).children = library
          .get(parents)
          .children.filter((e) => e !== note.name);
        library.get(parent).family = library
          .get(parent)
          .family.filter((e) => e !== note.name);
      } catch (err) {
        // console.log(err);
      }
    });

    library.get(note.name).children.forEach((child) => {
      try {
        library.get(child).parents = library
          .get(child)
          .parents.filter((e) => e !== note.name);
        library.get(child).family = library
          .get(child)
          .family.filter((e) => e !== note.name);
      } catch (err) {
        // console.log(err);
      }
    });

    note.dbSave = [];
    note.saved = false;
    note.children = [];
    note.parents = [];
    note.family = [];
    flashcards = flashcards.filter((e) => e.subject !== note.name);
    syncStatus(note.dbSave);
  } else {
    notyf.error("An error occurred when deleting a notebook");
  }
  updateList();
  defineCmd();
}

// context menu
// takes in an event object, an array of objects representing items in the context menu, and optionally an array representing a x and y coordinate for the context menu to be located
function delContextMenu() {
  try {
    document.getElementById("contextMenu").remove();
  } catch (err) {}
}

function contextMenu(e, button, position) {
  e.preventDefault();
  e.stopPropagation();
  delContextMenu();
  const menu = document.createElement("div");
  menu.id = "contextMenu";
  if (position) {
    menu.style.left = position[0];
    menu.style.top = position[1];
  } else {
    menu.style.left = `${e.clientX - 160}px`;
    menu.style.top = `75px`;
  }
  button.forEach((option) => {
    const item = document.createElement("div");
    if (option.attr) {
      item.setAttribute("data-props", option.attr);
    }
    item.classList.add("contextMenuItem");
    item.innerText = option.text;
    item.addEventListener("click", option.click);
    item.classList.add(option.appearance);
    menu.appendChild(item);
  });
  if (menu.firstChild) {
    mainContainer.after(menu);
  } else {
    return 0;
  }
}

// page preview
async function showPagePreview(e, customText) {
  e.preventDefault();
  e.stopPropagation();
  delContextMenu();
  const leftAmount =
    e.currentTarget.id.substring(0, "whereTo".length) === "whereTo"
      ? 30
      : parseInt(list.style.width.replace("px", "")) + 30;
  const page = e.currentTarget.getAttribute("data-page");
  const menu = document.createElement("div");
  menu.id = "contextMenu";
  menu.classList.add("listPreview");
  menu.style.left = `${leftAmount}px`;
  menu.style.top =
    e.clientY + 340 <= window.innerHeight
      ? `${e.clientY}px`
      : "calc(100vh - 340px)";
  const preview = document.createElement("div");
  preview.classList.add("pagePreviewContainer");
  preview.innerHTML = customText
    ? format(customText)
    : format(
        (
          await getAnyBookContent(
            e.currentTarget.getAttribute("data-bookname"),
            "content"
          )
        )[page]
      );
  menu.appendChild(preview);
  mainContainer.after(menu);
}

function scrollCM(e) {
  document.getElementById("contextMenu").firstChild.scroll({
    top: document.getElementById("contextMenu").firstChild.scrollTop + e.deltaY,
  });
}

// popup ui
function createPopupWindow() {
  hideBookDiffPopup();
  const bookDiffPopup = document.createElement("div");
  bookDiffPopup.addEventListener("click", () => {
    delContextMenu();
    hideStickyNotes();
  });
  document.body.classList.add("poppedUp");
  bookDiffPopup.id = "bookDiffPopup";
  const bookDiffHeader = document.createElement("div");
  bookDiffHeader.id = "bookDiffHeader";
  const bookDiffExitContainer = document.createElement("div");
  bookDiffExitContainer.id = "bookDiffExitContainer";
  const bookDiffExit = document.createElement("div");
  bookDiffExit.id = "bookDiffExit";
  bookDiffExitContainer.appendChild(bookDiffExit);
  bookDiffHeader.appendChild(bookDiffExitContainer);
  bookDiffPopup.appendChild(bookDiffHeader);
  const bookDiffContent = document.createElement("div");
  bookDiffContent.id = "bookDiffContent";
  bookDiffContent.addEventListener("scroll", function() {
    if (this.scrollTop === 0) {
      this.classList.remove("topOverflow")
    } else {
      this.classList.add("topOverflow")
    }
  })
  bookDiffPopup.appendChild(bookDiffContent);
  bookDiffExitContainer.addEventListener("click", hideBookDiffPopup, {
    once: true,
  });
  mainContainer.addEventListener("click", hideBookDiffPopup, { once: true });
  editor.session.on("change", hideBookDiffPopup);
  return { bookDiffPopup, bookDiffContent };
}

// book diff popup
function getDiff(one, other) {
  let span = null;

  const diff = Diff.diffChars(one, other);
  const fragment = document.createDocumentFragment();

  diff.forEach((part) => {
    const color = part.added
      ? ["#33ff96", "black"]
      : part.removed
      ? ["#ff5e5e", "black"]
      : ["rgba(0,0,0,0)", ""];
    span = document.createElement("span");
    span.style.background = color[0];
    span.style.color = color[1];
    span.appendChild(document.createTextNode(part.value));
    fragment.appendChild(span);
  });
  return fragment;
}

function hideBookDiffPopup() {
  try {
    document.getElementById("bookDiffPopup").remove();
  } catch (err) {
    // console.log(err);
  }
  try {
    calendar.destroy();
  } catch (err) {
    // console.log(err);
  }
  try {
    datePicker.destroy();
  } catch (err) {
    // console.log(err);
  }
  document.body.classList.remove("poppedUp");
  mainContainer.removeEventListener("click", hideBookDiffPopup);
  editor.session.off("change", hideBookDiffPopup);
}

function showBookDiffPopup() {
  const { bookDiffPopup, bookDiffContent } = createPopupWindow();
  const timesToRepeat =
    note.dbSave.length > note.content.length
      ? note.dbSave.length
      : note.content.length;
  const missingPage =
    timesToRepeat === note.dbSave.length ? note.dbSave : note.content;
  const colorIndicator =
    timesToRepeat === note.dbSave.length
      ? ["#ff5e5e", "black"]
      : ["#33ff96", "black"];
  for (let i = 0, n = timesToRepeat; i < n; i++) {
    const pageDiff = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.innerText = `Page ${i + 1}`;
    h2.addEventListener("click", function () {
      this.scrollIntoView();
    });
    h2.addEventListener("contextmenu", (e) => {
      contextMenu(
        e,
        [
          {
            text: `Go to Page ${i + 1}`,
            click: () => {
              jumpToDesiredPage(i);
              hideBookDiffPopup();
              delContextMenu();
            },
            appearance: "ios",
          },
        ],
        [`${e.clientX}px`, `${e.clientY}px`]
      );
    });
    pageDiff.appendChild(h2);
    pageDiff.classList.add("pageDiff");
    try {
      pageDiff.appendChild(getDiff(note.dbSave[i], note.content[i]));
    } catch (err) {
      const fragment = document.createDocumentFragment();
      const span = document.createElement("span");
      span.style.background = colorIndicator[0];
      span.style.color = colorIndicator[1];
      span.appendChild(document.createTextNode(missingPage[i]));
      fragment.appendChild(span);
      pageDiff.appendChild(fragment);
    }
    bookDiffContent.appendChild(pageDiff);
  }
  mainContainer.after(bookDiffPopup);
}

// sticky note
async function saveStickyNotes() {
  const saveStatus = await fetch("/api/save/notebooks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "sticky__notes",
      content: [stickyNotesTextArea.value],
    }),
  });
  if (!saveStatus.ok) {
    notyf.error("An error occurred when saving the sticky note");
  }
}

function showStickyNotes() {
  hideBookDiffPopup();
  stickyNotes.classList.remove("gone");
  openCalendar.classList.add("gone");
  stickyNotes.classList.add("snOpen");
  mainContainer.addEventListener("click", hideStickyNotes, { once: true });
  stickyNotesTextArea.focus();
  brDots.style.display = "none";
}

function hideStickyNotes() {
  stickyNotes.classList.remove("snOpen");
  stickyNotes.addEventListener("click", showStickyNotes, { once: true });
  mainContainer.removeEventListener("click", hideStickyNotes);
  brDots.style.display = "flex";
}

async function initializeStickyNotes() {
  const response = await fetch(`/api/get/notebooks/sticky__notes`);
  if (response.ok) {
    let json = await response.json();
    stickyNotesTextArea.value = json["data"]["content"][0];
  } else if (response.status === 404) {
    stickyNotesTextArea.value = "";
  } else {
    notyf.error("An error occurred when loading your sticky note.");
  }
}

// flashcards
async function initializeFlashcards() {
  const response = await fetch(`/api/get/notebooks/flash__cards`);
  if (response.ok) {
    let json = await response.json();
    flashcards = JSON.parse(json["data"]["content"][0]);
  } else if (response.status === 404) {
    flashcards = [];
  } else {
    notyf.error("An error occurred when loading your flashcards.");
  }
}

async function saveFlashcards() {
  const response = await fetch("/api/save/notebooks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "flash__cards",
      content: [JSON.stringify(flashcards)],
      date: new Date().toLocaleString(),
    }),
  });
  if (!response.ok) {
    notyf.error("An error occurred when saving the flashcards");
  }
}

function fcPop(e) {
  currCard.innerText = e.target.innerText;
}

function flashcardMode() {
  if (!note.saved) {
    notyf.error("Flashcards can only be created for saved notebooks");
    return 0;
  }
  hideBookDiffPopup();
  leaveFlashcardMode();
  document.body.classList.add("flashcardMode");
  hideList();
  const alert = document.createElement("div");
  alert.id = "fcAlert";
  alert.innerText =
    "You are in flashcard mode. Click some text to add it to the focused side of the card";
  mainContainer.after(alert);
  wikiEnabled = false;
  brain.classList.add("grayscale");
  const fcArea = document.createElement("div");
  fcArea.id = "fcArea";
  const cardFront = document.createElement("div");
  cardFront.classList.add("currCard");
  cardFront.contentEditable = true;
  cardFront.spellcheck = false;
  currCard = cardFront;
  cardFront.classList.add("cardFront");
  const buttons = document.createElement("div");
  buttons.classList.add("fcButtons");
  const save = document.createElement("button");
  save.innerText = "💾 Save";
  save.addEventListener(
    "click",
    (e) => {
      if (cardFront.innerText && cardBack.innerText) {
        flashcards.push({
          subject: note.name,
          front: cardFront.innerText,
          back: cardBack.innerText,
          id: Date.now(),
          learning: "unattempted",
        });
        moneyAnimation(e, "✔️");
        flashcardMode();
        saveFlashcards();
      } else {
        notyf.error("Both sides of flashcard must be populated");
        flashcardMode();
      }
    },
    { once: true }
  );
  const exit = document.createElement("button");
  exit.innerText = "❌ Exit";
  exit.addEventListener(
    "click",
    () => {
      leaveFlashcardMode();
    },
    { once: true }
  );
  buttons.appendChild(save);
  buttons.appendChild(exit);
  cardFront.addEventListener("focus", function () {
    currCard.classList.remove("currCard");
    this.classList.add("currCard");
    currCard = this;
  });

  const cardBack = document.createElement("div");
  cardBack.contentEditable = true;
  cardBack.spellcheck = false;
  cardBack.addEventListener("focus", function () {
    currCard.classList.remove("currCard");
    this.classList.add("currCard");
    currCard = this;
  });
  cardBack.classList.add("cardBack");
  fcArea.appendChild(cardFront);
  fcArea.appendChild(cardBack);
  fcArea.appendChild(buttons);
  mainContainer.after(fcArea);
  notesPreviewArea.addEventListener("click", fcPop);
  cardFront.focus();
}

function leaveFlashcardMode() {
  notesPreviewArea.removeEventListener("click", fcPop);
  document.body.classList.remove("flashcardMode");
  toggleWikiSearch();
  showList();
  try {
    document.getElementById("fcAlert").remove();
  } catch (err) {
    // console.log(err);
  }
  try {
    document.getElementById("fcArea").remove();
  } catch (err) {
    // console.log(err);
  }
}

function showFlashcards(noAnimation) {
  const { bookDiffPopup, bookDiffContent } = createPopupWindow();
  if (noAnimation != null && noAnimation) {
    bookDiffPopup.style.animation = "none";
  }
  const organized = flashcards.reduce(
    (arr2d, e) => {
      if (e.subject !== note.name) {
        return arr2d;
      }
      switch (e.learning) {
        case "unattempted":
          arr2d[0].push(e);
          break;
        case "know":
          arr2d[1].push(e);
          break;
        case "dontKnow":
          arr2d[2].push(e);
          break;
      }
      return arr2d;
    },
    [[], [], []]
  );

  const extra = document.createElement("div");
  extra.classList.add("extra");
  const editAll = document.createElement("div");
  editAll.classList.add("reset");
  editAll.innerText = "📝 Edit";
  editAll.addEventListener(
    "click",
    () => {
      editCards(flashcards.filter((e) => e.subject === note.name));
    },
    { once: true }
  );
  extra.appendChild(editAll);
  const reset = document.createElement("div");
  reset.classList.add("reset");
  reset.innerText = "🔁 Reset All";
  reset.addEventListener(
    "click",
    () => {
      flashcards = flashcards.map((e) => {
        e.learning = "unattempted";
        return e;
      });
      saveFlashcards();
      showFlashcards(true);
    },
    { once: true }
  );
  const pracAll = document.createElement("div");
  pracAll.classList.add("reset");
  pracAll.innerText = "🗂️ Practice All";
  pracAll.addEventListener(
    "click",
    () => {
      const cards = flashcards.filter((e) => e.subject === note.name);
      study([cards.shift()], cards);
    },
    { once: true }
  );
  extra.appendChild(reset);
  extra.appendChild(pracAll);
  bookDiffContent.appendChild(extra);
  organized.map((e, i) => {
    const wrapper = document.createElement("div");
    const info = document.createElement("div");
    info.classList.add("fcGroupInfo");
    const num = document.createElement("span");
    num.innerText = "0";
    switch (i) {
      case 0:
        info.innerText = "Unattempted - ";
        break;
      case 1:
        info.innerText = "Know - ";
        break;
      case 2:
        info.innerText = "Don't Know - ";
        break;
    }
    info.appendChild(num);
    const cards = document.createElement("div");
    cards.addEventListener("wheel", function (e) {
      this.scroll({
        left: this.scrollLeft + e.deltaY,
      });
    });
    cards.addEventListener(
      "click",
      () => {
        study([e.shift()], e);
      },
      { once: true }
    );
    cards.classList.add("fcCardList");

    e.forEach((card) => {
      num.innerText = parseInt(num.innerText) + 1;
      const cardFront = document.createElement("div");
      cardFront.addEventListener("contextmenu", function (e) {
        contextMenu(
          e,
          [
            {
              attr: card.id,
              text: `Edit Card`,
              click: function () {
                editCards([card]);
                delContextMenu();
              },
              appearance: "ios",
            },
            {
              attr: card.id,
              text: `Reset Card`,
              click: function () {
                flashcards.find(
                  (e) => e.id == this.getAttribute("data-props")
                ).learning = "unattempted";
                saveFlashcards();
                delContextMenu();
                showFlashcards(true);
              },
              appearance: "ios",
            },
            {
              attr: card.id,
              text: `Delete Card`,
              click: function () {
                this.innerText = "Confirm";
                this.classList.add("rios");
                this.addEventListener(
                  "click",
                  function () {
                    flashcards = flashcards.filter(
                      (e) => e.id != this.getAttribute("data-props")
                    );
                    saveFlashcards();
                    delContextMenu();
                    showFlashcards(true);
                  },
                  { once: true }
                );
              },
              appearance: "ios",
            },
          ],
          [`${e.clientX}px`, `${e.clientY}px`]
        );
      });
      cardFront.classList.add("cardFront");
      cardFront.innerText = card.front;
      cards.appendChild(cardFront);
    });

    if (!cards.innerHTML) {
      cards.classList.add("grid");
      cards.innerHTML = "<i>Cards for this notebook will appear here.</i>";
    } else {
      cards.classList.remove("grid");
    }

    wrapper.appendChild(info);
    wrapper.appendChild(cards);
    wrapper.classList.add("fcGroup");
    bookDiffContent.appendChild(wrapper);
  });

  mainContainer.after(bookDiffPopup);
}

function shuffle(array) {
  const newArr = [...array];
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex],
      newArr[currentIndex],
    ];
  }

  return newArr;
}

function editCards(cardArr) {
  if (cardArr.length === 0) {
    return 0;
  }

  const { bookDiffPopup, bookDiffContent } = createPopupWindow();
  bookDiffPopup.style.animation = "none";
  mainContainer.after(bookDiffPopup);

  const h2 = document.createElement("h2");
  h2.innerText = "Flashcard Editor";
  bookDiffContent.appendChild(h2);

  let count = 0;

  const copy = [...cardArr];

  copy.forEach((card) => {
    count++;
    const oneCard = document.createElement("div");
    oneCard.setAttribute("data-order", count);
    oneCard.classList.add("editableCard");

    const cardFront = document.createElement("div");
    cardFront.addEventListener("input", function () {
      card.front = this.innerText;
    });
    cardFront.innerText = card.front;
    cardFront.classList.add("cardFront");
    cardFront.contentEditable = true;
    cardFront.spellcheck = false;

    const cardBack = document.createElement("div");
    cardBack.addEventListener("input", function () {
      card.back = this.innerText;
    });
    cardBack.innerText = card.back;
    cardBack.classList.add("cardBack");
    cardBack.contentEditable = true;
    cardBack.spellcheck = false;

    oneCard.appendChild(cardFront);
    oneCard.appendChild(cardBack);

    bookDiffContent.appendChild(oneCard);
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("fcButtons");
  const check = document.createElement("button");
  check.innerText = "💾 Save";
  check.addEventListener(
    "click",
    () => {
      cardArr = copy;
      saveFlashcards();
      showFlashcards(true);
    },
    { once: true }
  );
  buttonContainer.appendChild(check);
  const exit = document.createElement("button");
  exit.innerText = "❌ Exit";
  exit.addEventListener(
    "click",
    () => {
      showFlashcards(true);
    },
    { once: true }
  );
  buttonContainer.appendChild(exit);

  bookDiffContent.appendChild(buttonContainer);
  bookDiffContent.children[1].firstChild.focus();
}

function study(cardArr, allCards) {
  const { bookDiffPopup, bookDiffContent } = createPopupWindow();
  bookDiffPopup.style.animation = "none";
  mainContainer.after(bookDiffPopup);

  if (!cardArr[0]) {
    showFlashcards(true);
    return;
  }
  const cardObj = cardArr[0];

  const container = document.createElement("div");
  container.classList.add("studyContainer");
  bookDiffContent.appendChild(container);

  const options = document.createElement("div");
  options.classList.add("studyingOptions");
  container.appendChild(options);

  const leave = document.createElement("div");
  leave.classList.add("reset");
  leave.innerText = "❌ Exit";
  leave.addEventListener("click", () => {
    showFlashcards(true);
  });
  options.appendChild(leave);

  const reset = document.createElement("div");
  reset.classList.add("reset");
  reset.innerText = "🔁 Reset Card";
  reset.addEventListener("click", () => {
    cardObj.learning = "unattempted";
    study(cardArr, allCards);
  });
  options.appendChild(reset);

  const back = document.createElement("div");
  back.classList.add("reset");
  back.innerText = "⏪ Back";
  back.style.opacity = ".5";
  if (cardArr.length > 1) {
    back.addEventListener("click", () => {
      allCards.push(cardArr.shift());
      study(cardArr, allCards);
    });
    back.style.opacity = "1";
  }
  options.appendChild(back);

  const skip = document.createElement("div");
  skip.classList.add("reset");
  skip.innerText = "⏩ Skip";
  skip.addEventListener("click", () => {
    study([allCards.shift(), ...cardArr], allCards);
  });
  options.appendChild(skip);

  const reshuffle = document.createElement("div");
  reshuffle.classList.add("reset");
  reshuffle.innerText = "🔀 Shuffle";
  reshuffle.addEventListener("click", (e) => {
    const shuffled = shuffle([cardArr.shift(), ...allCards]);
    notyf.success("Cards were shuffled");
    study([shuffled.shift(), ...cardArr], shuffled);
  });
  options.appendChild(reshuffle);

  const progress = document.createElement("span");
  progress.style.fontFamily = "monospace";
  progress.innerText = `${cardArr.length}/${allCards.length + cardArr.length}`;
  options.appendChild(progress);

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("quizlet");
  cardContainer.addEventListener("click", function () {
    this.classList.toggle("quizletActive");
  });
  const cardContent = document.createElement("div");
  cardContent.classList.add("qContent");

  cardContainer.appendChild(cardContent);

  const frontCard = document.createElement("div");
  frontCard.classList.add("qFront");
  frontCard.innerText = cardObj.front;
  container.appendChild(frontCard);

  const backCard = document.createElement("div");
  backCard.classList.add("qBack");
  backCard.innerText = cardObj.back;
  container.appendChild(backCard);

  cardContent.appendChild(frontCard);
  cardContent.appendChild(backCard);

  container.appendChild(cardContainer);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("fcButtons");
  const check = document.createElement("button");
  check.innerText = "✅ Know";
  if (cardObj.learning === "know") {
    check.style.background = "lightgreen";
    check.style.color = "black";
  }
  check.addEventListener("click", (e) => {
    cardObj.learning = "know";
    moneyAnimation(e, "😊");
    saveFlashcards();
    study([allCards.shift(), ...cardArr], allCards);
  });
  const x = document.createElement("button");
  x.addEventListener("click", (e) => {
    cardObj.learning = "dontKnow";
    moneyAnimation(e, "😔");
    saveFlashcards();
    study([allCards.shift(), ...cardArr], allCards);
  });
  x.innerText = "❌ Don't Know";
  if (cardObj.learning === "dontKnow") {
    x.style.background = "lightcoral";
    x.style.color = "black";
  }
  buttonContainer.appendChild(check);
  buttonContainer.appendChild(x);
  container.appendChild(buttonContainer);
}

// Todo stuff
async function initializeTodo() {
  // Todo data is stored in an inaccessible notebook. The active tasks are stored in the 'content' and the completed tasks are stored in the 'date'
  const response = await fetch(`/api/get/notebooks/todo__list`);
  if (response.ok) {
    let json = await response.json();
    events = JSON.parse(json["data"]["content"][0]);
    pastEvents = JSON.parse(json["data"]["date"]);
  } else if (response.status === 404) {
    events = [];
    pastEvents = [];
  } else {
    notyf.error("An error occurred when loading your calendar events.");
  }
}

async function saveTodo() {
  const response = await fetch("/api/save/notebooks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "todo__list",
      content: [JSON.stringify(events)],
      date: JSON.stringify(pastEvents),
    }),
  });
  if (!response.ok) {
    notyf.error("An error occurred when saving the to-do list");
  }
}

function renderTaskList(lookingAtPast, taskList, constraint) {
  while (taskList.firstChild) {
    taskList.firstChild.remove();
  }
  if (lookingAtPast) {
    document.getElementById("seePast").setAttribute("data-enabled", "true");
    document.getElementById("seePast").value = "View Active Tasks";
  } else {
    document.getElementById("seePast").setAttribute("data-enabled", "false");
    document.getElementById("seePast").value = "View Completed Tasks";
  }
  const lookAt = lookingAtPast ? pastEvents : events;
  const arr = !constraint
    ? lookAt
    : lookAt.filter((e) => e.extendedProps.category === constraint);
  if (!lookingAtPast) {
    arr.sort((a, b) => {
      const date1 = a.start;
      const date2 = b.start;
      if (date1 < date2) {
        return 1;
      }
      if (date1 > date1) {
        return -1;
      }
      // names must be equal
      return 0;
    });
  }
  arr.forEach((task) => {
    const event = document.createElement("div");
    event.classList.add("task");
    event.id = `task__${task.id}`;

    if (lookingAtPast) {
      event.addEventListener("contextmenu", (e) => {
        contextMenu(
          e,
          [
            {
              text: `Delete Event`,
              click: function () {
                this.innerText = "Confirm";
                this.classList.add("rios");
                this.addEventListener(
                  "click",
                  function () {
                    events = events.filter((e) => e.id !== task.id);
                    pastEvents = pastEvents.filter((e) => e.id !== task.id);
                    saveTodo();
                    document.getElementById(`task__${task.id}`).remove();
                    delContextMenu();
                  },
                  { once: true }
                );
              },
              appearance: "ios",
            },
          ],
          [`${e.clientX}px`, `${e.clientY}px`]
        );
      });
    }

    const eventTop = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (lookingAtPast) {
      checkbox.setAttribute("checked", "checked");
    }
    checkbox.setAttribute("data-id", task.id);
    if (lookingAtPast) {
      checkbox.addEventListener(
        "change",
        function () {
          this.parentElement.parentElement.remove();
          calendar.addEvent(task);
          events.push(pastEvents.filter((e) => e.id === task.id)[0]);
          pastEvents = pastEvents.filter((e) => e.id !== task.id);
          saveTodo();
        },
        { once: true }
      );
    } else {
      checkbox.addEventListener(
        "change",
        function () {
          const audio = new Audio("/assets/ding.mp3");
          audio.play();
          checkbox.classList.add("fade");
          checkbox.addEventListener(
            "animationend",
            function () {
              this.parentElement.parentElement.remove();
              calendar.getEventById(task.id).remove();
              pastEvents.push(events.filter((e) => e.id === task.id)[0]);
              events = events.filter((e) => e.id !== task.id);
              saveTodo();
            },
            { once: true }
          );
        },
        { once: true }
      );
    }
    const label = document.createElement("span");
    label.innerText = task.title;
    // label.contentEditable = true;
    // label.addEventListener("keydown", function (e) {
    //   if (e.key === "Enter") {
    //     e.preventDefault();
    //     this.blur();
    //   }
    // })
    // label.addEventListener("blur", function () {
    //   console.log(this.innerText)
    // })

    eventTop.appendChild(checkbox);
    eventTop.appendChild(label);

    const eventBottom = document.createElement("div");
    let dueDate;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = `${yyyy}-${mm}-${dd}`;

    if (task.start === today) {
      dueDate = `<b>Due ${task.start}</b>`;
    } else if (task.start < today) {
      dueDate = `<b><i>Due ${task.start}</i></b>`;
    } else {
      dueDate = `Due ${task.start}`;
    }
    eventBottom.innerHTML = `${task.extendedProps.category} ${dueDate}`;
    eventBottom.classList.add("eventBottom");
    if (lookingAtPast) {
      eventBottom.addEventListener(
        "click",
        () => {
          renderTaskList(true, taskList, task.extendedProps.category);
        },
        { once: true }
      );
    } else {
      eventBottom.addEventListener(
        "click",
        () => {
          renderTaskList(false, taskList, task.extendedProps.category);
        },
        { once: true }
      );
    }
    event.appendChild(eventTop);
    event.appendChild(eventBottom);

    taskList.prepend(event);
  });

  if (!taskList.innerHTML) {
    taskList.classList.add("grid");
    taskList.innerHTML = "<i>Tasks will appear here.</i>";
  } else {
    taskList.classList.remove("grid");
  }

  if (constraint) {
    const div = document.createElement("s");
    div.classList.add("filter");
    div.innerText = `Filter: ${constraint}`;
    taskList.prepend(div);
    if (lookingAtPast) {
      div.addEventListener(
        "click",
        () => {
          renderTaskList(true, taskList);
        },
        { once: true }
      );
    } else {
      div.addEventListener(
        "click",
        () => {
          renderTaskList(false, taskList);
        },
        { once: true }
      );
    }
  }
}

function showTodo(hereForInsertion) {
  if (
    hereForInsertion &&
    reservedNames.some((e) => e.data.name === note.name)
  ) {
    notyf.error("Reserved notebooks are read only");
    return 0;
  }

  const { bookDiffPopup, bookDiffContent } = createPopupWindow();
  mainContainer.after(bookDiffPopup);

  const todoContainer = document.createElement("div");
  todoContainer.id = "todoContainer";

  const addTaskContainer = document.createElement("div");
  addTaskContainer.id = "addTaskContainer";
  todoContainer.appendChild(addTaskContainer);

  const calendarContainer = document.createElement("div");
  todoContainer.appendChild(calendarContainer);

  if (hereForInsertion) {
    calendar = new Calendar(calendarContainer, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: "dayGridMonth",
      events: events,
      eventClick: (info) => {
        editor.insert(`:cal[${info.event.id}]`);
        updateAndSaveNotesLocally();
        hideBookDiffPopup();
      },
    });
  } else {
    calendar = new Calendar(calendarContainer, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: "dayGridMonth",
      events: events,
      eventClick: (info) => {
        try {
          const evInList = document.getElementById(`task__${info.event.id}`);
          evInList.addEventListener(
            "animationend",
            () => {
              evInList.classList.remove("getHighlighted");
            },
            {
              once: true,
            }
          );
          evInList.classList.add("getHighlighted"); // Add the class that animates
          evInList.scrollIntoView();
        } catch (err) {
          // console.log(err);
        }
      },
    });
  }

  const taskName = document.createElement("input");
  taskName.placeholder = "Task Name";
  addTaskContainer.appendChild(taskName);
  const taskCategory = document.createElement("input");
  taskCategory.placeholder = "Task Category";
  addTaskContainer.appendChild(taskCategory);

  const dp = document.createElement("input");
  dp.id = "datePicker";
  dp.readOnly = true;
  dp.placeholder = "Due Date";
  addTaskContainer.appendChild(dp);

  const submit = document.createElement("input");
  submit.setAttribute("type", "button");
  submit.id = "addTask";
  submit.value = "+ Add Task";
  submit.addEventListener("click", () => {
    if (dp.value && taskName.value) {
      const exactDate = Date.now();
      const eventObj = {
        id: exactDate,
        title: taskName.value,
        start: dp.value,
        extendedProps: {
          category: taskCategory.value || "misc",
        },
      };
      calendar.addEvent(eventObj);
      events.push(eventObj);
      saveTodo();

      taskName.value = ""
      taskCategory.value = ""
      dp.value = ""

      renderTaskList(false, taskList);
    }
  });

  addTaskContainer.appendChild(submit);

  const taskList = document.createElement("div");
  taskList.id = "taskList";
  addTaskContainer.appendChild(taskList);

  const seePast = document.createElement("input");
  seePast.id = "seePast";
  seePast.setAttribute("type", "button");
  seePast.setAttribute("data-enabled", "false");
  seePast.value = "View Completed Tasks";
  seePast.addEventListener("click", function () {
    if (this.getAttribute("data-enabled") === "false") {
      renderTaskList(true, taskList);
    } else {
      renderTaskList(false, taskList);
    }
    taskName.focus();
  });

  addTaskContainer.appendChild(seePast);

  bookDiffContent.appendChild(todoContainer);

  datePicker = new AirDatepicker("#datePicker", {
    locale: {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "Today",
      clear: "Clear",
      dateFormat: "yyyy-MM-dd",
      timeFormat: "hh:mm aa",
      firstDay: 0,
    },
  });
  calendar.render();
  renderTaskList(false, taskList);

  bookDiffExitContainer.addEventListener("click", hideBookDiffPopup, {
    once: true,
  });
  mainContainer.addEventListener("click", hideBookDiffPopup, { once: true });
  // document.addEventListener("keydown", hidePopups)
}

// Wikipedia
function toggleWikiSearch() {
  wikiEnabled = !wikiEnabled;
  brain.classList.toggle("grayscale");
}

async function wikiSearch(event) {
  let selection = window.getSelection().toString();
  if (!(selection.includes("\n") || !selection.length) && wikiEnabled) {
    let wiki = selection.trim().replace(/ /g, "_").toLowerCase();
    document.body.style.cursor = "wait";
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wiki}?redirect=true`,
      {
        cache: "default",
      }
    );
    if (response.ok) {
      const result = await response.json();
      let summary = `<b>${selection.trim()}</b>:<br>${DOMPurify.sanitize(
        result["extract_html"]
      )}<a href = 'https://en.wikipedia.org/wiki/${wiki}' target = '_blank'>Learn More</a>`;
      wikipediaTippy.setContent(`<div id = 'brain'>${summary}</div>`);
      moneyAnimation(event, "🧠");
    }
    document.body.style.cursor = "inherit";
  }
}

function moneyAnimation(e, symbol) {
  wikipediaBrainAnimation.style.top = `${e.clientY}px`;
  wikipediaBrainAnimation.style.left = `${e.clientX}px`;
  // https://stackoverflow.com/a/69970674
  const moneyAnimation = document.createElement("p");
  moneyAnimation.innerHTML = symbol;
  wikipediaBrainAnimation.appendChild(moneyAnimation);
  moneyAnimation.classList.add("wikipediaBrainAnimation"); // Add the class that animates
  moneyAnimation.addEventListener("animationend", moneyAnimation.remove, {
    once: true,
  });
}

// 'Editing window'
function cycleViewPreferences() {
  let viewPref = localStorage.getItem("/viewPref");
  switch (viewPref) {
    case "split":
      localStorage.setItem("/viewPref", "write");
      break;
    case "write":
      localStorage.setItem("/viewPref", "read");
      break;
    default:
      localStorage.setItem("/viewPref", "split");
      break;
  }
  editingWindow(localStorage.getItem("/viewPref"));
}

function editingWindow(choice) {
  switch (choice) {
    case "read":
      mode.innerText = "R";
      editor.setReadOnly(true);
      notesAreaContainer.classList.add("readMode");
      notesAreaContainer.classList.remove("writeMode");
      notesAreaContainer.classList.remove("splitMode");
      localStorage.setItem("/viewPref", "read");
      break;
    case "write":
      mode.innerText = "W";
      editor.setReadOnly(note.readOnly ? true : false);
      notesAreaContainer.classList.remove("readMode");
      notesAreaContainer.classList.add("writeMode");
      notesAreaContainer.classList.remove("splitMode");
      localStorage.setItem("/viewPref", "write");
      break;
    default:
      mode.innerText = "S";
      editor.setReadOnly(note.readOnly ? true : false);
      notesAreaContainer.classList.remove("readMode");
      notesAreaContainer.classList.remove("writeMode");
      notesAreaContainer.classList.add("splitMode");
      localStorage.setItem("/viewPref", "split");
  }
  notesPreviewArea.scrollTop = 0;
  notesTextArea.scrollTop = 0;
  editor.focus();
  editingMode.setContent(`View Mode: ${choice}`);
}

// 'hierarchy' stuff
async function getAncestors(bookName, optionalPreFetchedData) {
  let response = new Set();
  const parents =
    optionalPreFetchedData.parents ||
    (await getAnyBookContent(bookName, "parents")) ||
    [];

  if (!parents[0]) {
    return response;
  }

  parents.forEach(async (parent) => {
    response.add(parent);
    response = new Set([...response, ...(await getAncestors(parent, {}))]);
  });

  return response;
}

async function getDescendants(bookName, optionalPreFetchedData) {
  let response = new Set();
  const children =
    optionalPreFetchedData.children ||
    (await getAnyBookContent(bookName, "children")) ||
    [];

  if (!children[0]) {
    return response;
  }

  children.forEach(async (child) => {
    response.add(child);
    response = new Set([...response, ...(await getDescendants(child, {}))]);
  });

  return response;
}

async function getFamily(bookName, optionalPreFetchedData) {
  try {
    return library.get(bookName)["family"];
  } catch (err) {
    const ancestors = await getAncestors(bookName, optionalPreFetchedData);
    const descendants = await getDescendants(bookName, optionalPreFetchedData);
    const response = Array.from(ancestors).concat(Array.from(descendants));
    return response;
  }
}

async function createChild(parent, child) {
  const existingItem = await fetch(`/api/get/notebooks/${child}`);
  if (
    existingItem.status === 404 &&
    child &&
    parent &&
    !reservedNames.some((e) => e.data.name === parent)
  ) {
    const saveStatus = await fetch("/api/save/notebooks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: child,
        content: [""],
        date: new Date().toLocaleString(),
      }),
    });
    if (saveStatus.ok) {
      await nestNote(child, parent);
      switchNote(newName, 0);
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}

async function nestNote(child, parent) {
  if (child && parent && !reservedNames.some((e) => e.data.name === child)) {
    const result = await fetch(`/api/nest/${child}/${parent}`, {
      method: "POST",
    });
    if (result.ok) {
      try {
        library.get(child)["parents"].push(parent);
        library.get(child)["family"].push(parent);
      } catch (err) {
        // console.log(err);
      }

      try {
        library.get(parent)["children"].push(child);
        library.get(parent)["family"].push(child);
      } catch (err) {
        // console.log(err);
      }

      updateList();
      defineCmd();
    } else {
      notyf.error("An error occurred when nesting a notebook");
    }
  }
}

async function relinquishNote(child, parent) {
  if (child && parent) {
    const result = await fetch(`/api/relinquish/${child}/${parent}`, {
      method: "POST",
    });
    if (result.ok) {
      try {
        library.get(child)["parents"] = library
          .get(child)
          ["parents"].filter((e) => e !== parent);
        library.get(child)["family"] = library
          .get(child)
          ["family"].filter((e) => e !== parent);
      } catch (err) {
        // console.log(err);
      }

      try {
        library.get(parent)["children"] = library
          .get(parent)
          ["children"].filter((e) => e !== child);
        library.get(parent)["family"] = library
          .get(parent)
          ["family"].filter((e) => e !== child);
      } catch (err) {
        // console.log(err);
      }

      updateList();
      defineCmd();
    } else {
      notyf.error("An error occurred when relinquishing a notebook");
    }
  }
}

// ChatGPT
const gptPrompts = {
  flashcards:
    "Create flashcards from this note. Use GitHub flavored markdown to create a table of 2 columns, one column being terms and the other being definitions, do not label the columns however. Do not use any HTML tags.",
  tldr: "TLDR:",
};

async function AIFlashcards() {
  const generatedCards = [];

  const response = await chatGPT(editor.getValue(), gptPrompts.flashcards);
  const shadow = document.createElement("div");
  shadow.innerHTML = format(response);
  for (const td of shadow.getElementsByTagName("table")[0].rows) {
    if (td.children[0].innerText && td.children[0].innerText) {
      generatedCards.push({
        subject: note.name,
        front: td.children[0].innerText.replaceAll("<br>", "\n"),
        back: td.children[1].innerText.replaceAll("<br>", "\n"),
        id: Date.now(),
        learning: "unattempted",
      })
    }
  }

  editCards(generatedCards);
}

window.AIFlashcards = AIFlashcards


async function chatGPT(content, prompt) {
  const response = await fetch("/api/chatGPT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      prompt,
    }),
  });
  if (response.ok) {
    const json = await response.json();
    return json.data;
  } else {
    return `Error code ${response.status}.`;
  }
}

async function AISUmmary() {
  const name = note.name;
  const pg = note.pgN + 1;
  const loadingScreen = document.createElement("div");
  mainContainer.style.pointerEvents = "none";
  loadingScreen.id = "loading";
  loadingScreen.style.opacity = ".9";
  loadingScreen.innerHTML =
    '<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  mainContainer.after(loadingScreen);
  const AI = await chatGPT(editor.getValue(), gptPrompts.flashcards);
  reservedNames.find((e) => e.data.name === "AI-Summary").data.content = [
    `# ✨ AI Summary (:ref[${name}] - pg. ${pg})\n\n${AI.replaceAll(
      "<br>",
      "\n"
    )}]`,
  ];
  await switchNote("AI-Summary");
  updateAndSaveNotesLocally();
  loadingScreen.remove();
  mainContainer.style.pointerEvents = "inherit";
}

// Event listeners
// doc
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
    e.preventDefault();
    saveNoteBookToDb();
  } else if (e.ctrlKey && (e.key === "e" || e.key === "E")) {
    e.preventDefault();
    cycleViewPreferences();
  }
});

// main note area
mainContainer.addEventListener("click", delContextMenu);
mainContainer.addEventListener("contextmenu", delContextMenu);
notesPreviewArea.addEventListener("click", (e) => {
  wikiSearch(e);
});
// notesPreviewArea.addEventListener("scroll", function () {
//   if (this.scrollTop > 0) {
//     tabs.classList.add("topOverflow")
//   } else {
//     tabs.classList.remove("topOverflow")
//   }
// })
// notesTextArea.addEventListener("scroll", function () {
//   if (this.scrollTop > 0) {
//     tabs.classList.add("topOverflow")
//   } else {
//     tabs.classList.remove("topOverflow")
//   }
// })

// toolbar
document.getElementById("icon1").addEventListener("click", saveNoteBookToDb);
document.getElementById("icon2").addEventListener("click", (e) => {
  e.preventDefault();
  contextMenu(e, [
    {
      text: "Open Notebook",
      click: function () {
        let hasTyped = false;
        const storeHTML = this.innerHTML;
        this.classList.add("currPage");
        this.style.fontStyle = "italic";
        this.innerText = "Enter book name";
        this.contentEditable = true;
        this.focus();
        this.addEventListener(
          "beforeinput",
          function () {
            hasTyped = true;
            this.innerText = "";
          },
          { once: true }
        );
        this.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            if (hasTyped) {
              switchNote(this.innerText.replaceAll("/", ""));
              delContextMenu();
            } else {
              delContextMenu();
            }
          }
        });
        this.addEventListener(
          "blur",
          function () {
            this.contentEditable = false;
            this.innerHTML = storeHTML;
            this.classList.remove("currPage");
            this.style.fontStyle = "inherit";
            this.innerText = "Open Notebook";
          },
          { once: true }
        );
      },
      appearance: "ios",
    },
    {
      text: "Relinquish Notebook",
      click: async (e) => {
        const buttons = (await getAnyBookContent(note.name, "parents")).map(
          (parent) => {
            return {
              text: parent,
              click: () => {
                relinquishNote(note.name, parent);
                delContextMenu();
              },
              appearance: "ios",
            };
          }
        );
        contextMenu(e, buttons, [
          document.getElementById("contextMenu").style.left,
          document.getElementById("contextMenu").style.top,
        ]);
      },
      appearance: "ios",
    },
    {
      text: "Nest Notebook",
      click: async (e) => {
        const family = await getFamily(note.name);
        const json = await getList();
        const buttons = json.reduce((arr, e) => {
          if (e.name !== note.name && !family.includes(e.name)) {
            arr.push({
              text: e.name,
              click: () => {
                nestNote(note.name, e.name);
                delContextMenu();
              },
              appearance: "ios",
            });
          }
          return arr;
        }, []);
        contextMenu(e, buttons, [
          document.getElementById("contextMenu").style.left,
          document.getElementById("contextMenu").style.top,
        ]);
      },
      appearance: "ios",
    },
    {
      text: "Create Child",
      click: function () {
        let hasTyped = false;
        const storeHTML = this.innerHTML;
        this.classList.add("currPage");
        this.style.fontStyle = "italic";
        this.innerText = "Enter child name";
        this.contentEditable = true;
        this.focus();
        this.addEventListener(
          "beforeinput",
          function () {
            this.innerText = "";

            hasTyped = true;
          },
          { once: true }
        );
        this.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            if (hasTyped) {
              createChild(note.name, this.innerText.replaceAll("/", ""));
              delContextMenu();
            } else {
              delContextMenu();
            }
          }
        });
        this.addEventListener(
          "blur",
          function () {
            this.contentEditable = false;
            this.innerHTML = storeHTML;
            this.classList.remove("currPage");
            this.style.fontStyle = "inherit";
            this.innerText = "Copy Notebook";
          },
          { once: true }
        );
      },
      appearance: "ios",
    },
    {
      text: "Copy Notebook",
      click: function () {
        let hasTyped = false;
        const storeHTML = this.innerHTML;
        this.classList.add("currPage");
        this.style.fontStyle = "italic";
        this.innerText = "Enter copy name";
        this.contentEditable = true;
        this.focus();
        this.addEventListener(
          "beforeinput",
          function () {
            this.innerText = "";

            hasTyped = true;
          },
          { once: true }
        );
        this.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            if (hasTyped) {
              copyBook(this.innerText.replaceAll("/", ""));
            } else {
              delContextMenu();
            }
          }
        });
        this.addEventListener(
          "blur",
          function () {
            this.contentEditable = false;
            this.innerHTML = storeHTML;
            this.classList.remove("currPage");
            this.style.fontStyle = "inherit";
            this.innerText = "Copy Notebook";
          },
          { once: true }
        );
      },
      appearance: "ios",
    },
  ]);
});
document.getElementById("icon3").addEventListener("click", (e) => {
  contextMenu(e, [
    {
      text: "Delete Notebook",
      click: function () {
        this.classList.add("rios");
        this.innerText = "Confirm";
        this.addEventListener(
          "click",
          () => {
            deleteNoteBookFromDb();
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
  ]);
});
document
  .getElementById("getFile1")
  .addEventListener("change", insertAndSaveImage);
document.getElementById("icon5").addEventListener("click", (e) => {
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
  ]);
});
document.getElementById("icon6").addEventListener("click", () => {
  handlePageMovement(true, 1, false);
});
document.getElementById("icon7").addEventListener("click", (e) => {
  handlePageMovement(false, 1, false, e);
});
brain.addEventListener("click", (e) => {
  contextMenu(e, [
    {
      text: "Toggle Wiki Search",
      click: () => {
        toggleWikiSearch();
      },
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
  ]);
});
areNotesSavedIcon.addEventListener("animationend", function () {
  this.classList.remove("saved");
});
areNotesSavedIcon.addEventListener("click", (e) => {
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
  ]);
});
toolBar.addEventListener("click", delContextMenu);
toolBar.addEventListener("contextmenu", delContextMenu);
toolBar.addEventListener("contextmenu", (e) => e.preventDefault());

// side bar and list
document
  .getElementById("leftMostSideBar")
  .addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
document
  .getElementById("sideBarRetractList")
  .addEventListener("click", toggleList);
document.getElementById("newPage").addEventListener("click", () => {
  jumpToDesiredPage(note.content.length);
});
morePages.addEventListener("click", (e) => {
  showMorePages(e);
});
document.getElementById("goHome").addEventListener("click", () => {
  switchNote("home", 0);
});
list.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
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
      localStorage.setItem("/listSize", list.style.width.replace("px", ""));
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
document.getElementById("openCommandPal").addEventListener("click", () => {
  document.getElementsByClassName("mobile-button")[0].click();
});

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
    openCalendar.addEventListener("click", () => {
      showTodo(false);
    });
    flashcardPrac.addEventListener("click", () => {
      showFlashcards();
    });

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
    console.log(
      `%cLoad time: ${Date.now() - startTime}ms!`,
      "color:yellow;font-weight:bold;"
    );
  },
  { once: true }
);
