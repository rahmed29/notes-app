import { saveNoteBookToDb } from "./note_utils";
import { note } from "./data/note";
import { reserved } from "./data/reserved_notes";
import { synced, generalInfoPageNumber } from "./important_stuff/tooltips";
import {
  topLeftPageNumber,
  generalInfoPageNumberEle,
  previewContent,
  morePages,
} from "./important_stuff/dom_refs";
import morphdom from "morphdom";
import format from "./micromark_directives";
import {
  confirmation_cm,
  contextMenu,
  delContextMenu,
  scrollCM,
} from "./context_menu";
import { switchTab, editTabText } from "./tabs";
import { showPagePreview } from "./list_utils";
import { deleteImageFromDb } from "./images";
import { currTheme } from "./theming";
import tippy from "tippy.js";
import { eid } from "./dom_utils";
import { editor } from "./important_stuff/editor";
import { autosavingEnabled } from "./autosave";
import { getTitle } from "../shared_modules/removeMD";
import { imageList, listInMemory } from "./data/list";
import getAnyBookContent from "./get_book_content";
import localforage from "localforage";
import { arraysAreEqual, charDifferCount, properLink } from "./data_utils";
import { setSizeDetails } from "./throttle";
import Prism from "prismjs";

import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";

export {
  jumpWrapper,
  jumpToDesiredPage,
  handlePageMovement,
  accents,
  updateAndSaveNotesLocally,
  syncStatus,
  formatNonText,
  insertPage,
};

// event listeners and stuff we need to destroy on repaints
let lastDynamicTippy = null;

const pageHandlers = [];
const previewHandlers = [];

function jumpWrapper() {
  jumpToDesiredPage(this.getAttribute("data-page"));
}

function insertPage(direction, currPage = note.pgN) {
  if (reserved(note.name)) {
    notyf.error("This notebook is read only");
    return;
  }
  const newPages = [];
  const newAceSession = [];
  if (direction === "->") {
    for (let i = 0; i < note.content.length; i++) {
      if (i === currPage + 1) {
        newPages.push("");
        newAceSession.push("");
      }
      newPages.push(note.content[i]);
      newAceSession.push(note.aceSessions[i]);
    }
  } else if (direction === "<-") {
    for (let i = 0; i < note.content.length; i++) {
      if (i === currPage) {
        newPages.push("");
        newAceSession.push("");
      }
      newPages.push(note.content[i]);
      newAceSession.push(note.aceSessions[i]);
    }
  }
  note.content = newPages;
  note.aceSessions = newAceSession;
  accents();
  if (direction === "->") {
    jumpToDesiredPage(currPage + 1);
  } else if (direction === "<-") {
    jumpToDesiredPage(currPage);
  }
}

function jumpToDesiredPage(desired) {
  if (desired < 0 || parseInt(desired) === NaN) {
    desired = 0;
  }
  if (desired < note.pgN) {
    handlePageMovement({
      direction: "<-",
      amount: note.pgN - desired,
    });
  } else if (desired > note.pgN) {
    handlePageMovement({
      direction: "->",
      amount: desired - note.pgN,
      shouldCreateNewPage: true,
    });
  }
}

// This handles all page movement. It will not create a new pages by default but can if needed.
// jumpToDesiredPage just uses this but allows the creation of a new page when the desired page is out of bounds
// If you don't allow page creation but pass in the event from a button being clicked it adds a context menu on that button ask if a new page should be created,.
function handlePageMovement({
  direction,
  amount,
  shouldCreateNewPage = false,
  event,
} = {}) {
  if (!note.content) {
    return;
  }
  if (direction === "<-" && note.pgN > 0) {
    note.pgN -= amount;
    accents();
  } else if (direction === "->") {
    if (
      note.pgN + amount >= note.content.length &&
      shouldCreateNewPage &&
      !reserved(note.name)
    ) {
      note.content.push("");
      note.pgN += amount;
      accents();
      if (autosavingEnabled) {
        saveNoteBookToDb(note.name, true);
      }
      // defineCmd();
    } else if (
      note.pgN + amount >= note.content.length &&
      !shouldCreateNewPage &&
      event &&
      !reserved(note.name)
    ) {
      contextMenu(
        event,
        [
          {
            text: "New Page",
            click: () => {
              jumpToDesiredPage(note.content.length);
              delContextMenu();
            },
          },
        ],
        [`${event.clientX - 160}px`, "75px"]
      );
    } else if (!(note.pgN + amount >= note.content.length)) {
      note.pgN += amount;
      accents();
    }
  }
}

// For rendering we've implemented a few optimizations:
// - Throttle the rendering function when the note is very large
// - Memoization in the function that uses micromark
function accents(focusEditor = true) {
  if (!note.aceSessions[note.pgN]) {
    const newSession = ace.createEditSession(note.content[note.pgN]);
    editor.setSession(newSession);
    editor.session.setUseWrapMode(true);
    editor.session.setMode("ace/mode/markdown");
    note.aceSessions[note.pgN] = newSession;
    editor.setSession(note.aceSessions[note.pgN]);
  } else {
    editor.setSession(note.aceSessions[note.pgN]);
  }
  if (history.state === null) {
    window.history.replaceState(
      { sancta: true, note: note.name, page: note.pgN },
      null,
      `/${note.name}?${note.pgN + 1}`
    );
  } else if (history.state.sancta && history.state.note !== note.name) {
    window.history.pushState(
      { sancta: true, note: note.name, page: note.pgN },
      null,
      `/${note.name}?${note.pgN + 1}`
    );
  } else if (history.state.sancta && history.state.note === note.name) {
    window.history.replaceState(
      { sancta: true, note: note.name, page: note.pgN },
      null,
      `/${note.name}?${note.pgN + 1}`
    );
  }
  updateAndSaveNotesLocally();
  createPageNumbers();
  if (focusEditor) {
    editor.focus();
  }
}

async function updateAndSaveNotesLocally() {
  const md = editor.getValue();
  if (md.length > 4000) {
    setSizeDetails(true, md.length);
  } else {
    setSizeDetails(false, 0);
  }
  note.content[note.pgN] = md;
  const noteInList = listInMemory.find((e) => e.name === note.name);
  if (noteInList) {
    noteInList.excerpt = note.content.map((e) => getTitle(e));
  }
  if (!reserved(note.name) && !note.isEncrypted) {
    // no need to await
    localforage.setItem(note.name, {
      content: note.content,
      timestamp: Date.now(),
    });
  }
  syncStatus();
  if (lastDynamicTippy) {
    lastDynamicTippy.destroy();
    lastDynamicTippy = null;
  }
  previewHandlers.forEach((e) => {
    e.element.removeEventListener(e.type, e.listener);
  });
  previewHandlers.length = 0;
  const v = document.createElement("div");
  v.innerHTML = format(md);
  v.id = "fill";
  morphdom(previewContent, v);
  formatNonText(previewContent);
  letterCount.innerText = editor
    .getValue()
    .replace(/\s+/g, "")
    .length.toString()
    .padStart(5, "0");
  wordCount.innerText = notesPreviewArea.innerText
    .split(/\s+/)
    .filter((e) => e !== "")
    .length.toString()
    .padStart(5, "0");
}

async function syncStatus() {
  return new Promise((resolve) => {
    if (reserved(note.name)) {
      // note name reserved
      editTabText(note.name, note.name);
      areNotesSavedIcon.style.filter = "grayscale(1)";
    } else if (!note.saved) {
      // note not saved
      editTabText(note.name, `* ${note.name}`);
      synced.setContent(`Notes are not saved`);
      areNotesSavedIcon.style.filter = "hue-rotate(270deg)";
    } else {
      // note is saved
      // let writtenPages = note.content;
      if (arraysAreEqual(note.content, note.dbSave)) {
        // content is synced
        editTabText(note.name, note.name);
        synced.setContent(
          `Notes were saved at ${new Date(note.date).toLocaleString()}`
        );
        areNotesSavedIcon.style.filter = "none";
      } else {
        // content is not in sync with db
        if (!autosavingEnabled) {
          // Add the asterisk (only if not autosaving, since autosaving saves quickly so the asterisk would be annoying)
          editTabText(note.name, `* ${note.name}`);
        }
        synced.setContent(
          `Notes shown differ from saved notes by ${charDifferCount(
            note.content,
            note.dbSave
          )} chars`
        );
        areNotesSavedIcon.style.filter = "grayscale(1)";
      }
    }
    resolve();
  });
}

function formatNonText(ele, listeners = true) {
  if (
    ele.firstChild &&
    ele.firstChild.tagName === "P" &&
    ele.firstChild.innerText.substring(0, 3) === "// "
  ) {
    ele.firstChild.classList.add("firstLineComment");
  }
  Prism.highlightAllUnder(ele);
  if (listeners) {
    for (const node of ele.getElementsByClassName("reference")) {
      node.addEventListener(
        window.isOnMobile ? "dblclick" : "click",
        switchTab
      );
      previewHandlers.push({
        element: node,
        type: window.isOnMobile ? "dblclick" : "click",
        listener: switchTab,
      });
      node.addEventListener("mouseover", referToolTip);
      previewHandlers.push({
        element: node,
        type: "mouseover",
        listener: referToolTip,
      });
      node.addEventListener("focus", referToolTip);
      previewHandlers.push({
        element: node,
        type: "focus",
        listener: referToolTip,
      });
    }
    for (const node of ele.getElementsByClassName("sanctaTag")) {
      node.addEventListener("click", switchTab);
      previewHandlers.push({
        element: node,
        type: "click",
        listener: switchTab,
      });
    }
    for (const node of ele.getElementsByTagName("img")) {
      node.addEventListener("contextmenu", removeImageToolTip);
      previewHandlers.push({
        element: node,
        type: "contextmenu",
        listener: removeImageToolTip,
      });
    }
    for (const node of ele.getElementsByTagName("a")) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
      if (properLink(node.href) === "[PDF]") {
        node.addEventListener("contextmenu", removeImageToolTip);
        previewHandlers.push({
          element: node,
          type: "contextmenu",
          listener: removeImageToolTip,
        });
      }
    }
  }
}

// page numbers on the left
function createPageNumbers() {
  pageHandlers.forEach((e) => {
    e.element.removeEventListener(e.type, e.listener);
  });
  pageHandlers.length = 0;
  while (topLeftPageNumber.firstChild) {
    topLeftPageNumber.firstChild.remove();
  }
  generalInfoPageNumberEle.innerText = note.pgN + 1;
  generalInfoPageNumber.setContent(`Page ${note.pgN + 1}`);
  const timesToGo = Math.min(note.content.length, 9);
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
  const currPage = eid(`whereTo${note.pgN}`) || morePages;
  currPage.classList.add("currPage");
}

function removeImageToolTip(e) {
  contextMenu(e, [
    navigator.clipboard
      ? {
          props: this.src || this.href,
          text: "Copy Link",
          click: (props) => {
            navigator.clipboard.writeText(props);
            delContextMenu();
          },
        }
      : null,
    navigator.clipboard
      ? {
          props:
            properLink(new URL(this.src).pathname).replaceAll("{{^}}", "") +
            `(${new URL(this.src).pathname})`,
          text: "Copy Markdown",
          click: (props) => {
            navigator.clipboard.writeText(props);
            delContextMenu();
          },
        }
      : null,
    {
      props: this.src || this.href,
      text: "Open File",
      click: (props) => {
        window.open(props, "_blank");
        delContextMenu();
      },
    },
    imageList.includes(
      (this.src || this.href).substring(
        (this.src || this.href).indexOf("/uploads/") + 9
      )
    )
      ? {
          props: (this.src || this.href).substring(
            (this.src || this.href).indexOf("/uploads/") + 9
          ),
          text: "Delete File",
          click: (props, ele) =>
            confirmation_cm(ele, () => deleteImageFromDb(props)),
        }
      : null,
  ]);
}

// tooltip for :ref[] to notebooks
async function referToolTip() {
  if (lastDynamicTippy) {
    lastDynamicTippy.destroy();
    lastDynamicTippy = null;
  }
  delContextMenu();
  lastDynamicTippy = tippy([this], {
    theme: currTheme.theme_type,
    animation: "shift-toward-subtle",
    content: "Loading...",
    allowHTML: true,
    interactive: true,
    arrow: false,
    placement: "bottom",
  })[0];
  try {
    const content = format(
      (await getAnyBookContent(this.getAttribute("data-bookname"), "content"))[
        parseInt(this.getAttribute("data-page"))
      ]
    );
    lastDynamicTippy.setContent(
      `<div class = 'pagePreviewContainer'>${content}</div>`
    );
    lastDynamicTippy.show();
  } catch (err) {
    lastDynamicTippy.destroy();
  }
}
