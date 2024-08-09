import {
  note,
  getWrittenPages,
  getAnyBookContent,
  reserved,
  saveNoteBookToDb,
} from "./note_utils";
import { synced, generalInfoPageNumber } from "./important_stuff/tooltips";
import {
  topLeftPageNumber,
  generalInfoPageNumberEle,
  previewContent,
  morePages,
} from "./important_stuff/dom_refs";
import morphdom from "morphdom";
import { format } from "./micromark_directives";
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
import Prism from "prismjs";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import { autosavingEnabled, doneSaving, isSaving, noteBeingAutoSaved, saving } from "./autosave";

export {
  jumpWrapper,
  jumpToDesiredPage,
  handlePageMovement,
  accents,
  updateAndSaveNotesLocally,
  syncStatus,
  formatNonText,
};

// event listeners and stuff we need to destroy on repaints
let lastDynamicTippy = null;

let pageHandlers = [];
let previewHandlers = [];

function jumpWrapper() {
  jumpToDesiredPage(this.getAttribute("data-page"));
}

function jumpToDesiredPage(desired) {
  if (desired < note.pgN) {
    handlePageMovement({
      direction: "<-",
      amount: note.pgN - desired,
      shouldCreateNewPage: true,
    });
  } else if (desired > note.pgN) {
    handlePageMovement({
      direction: "->",
      amount: desired - note.pgN,
      shouldCreateNewPage: true,
    });
  }
}

function handlePageMovement({
  direction,
  amount,
  shouldCreateNewPage = false,
  event,
} = {}) {
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
      // defineCmd();
    } else if (
      note.pgN + amount >= note.content.length &&
      !shouldCreateNewPage &&
      event
    ) {
      contextMenu(
        event,
        [
          {
            text: "New Page",
            click: (e) => {
              e.stopPropagation();
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

function accents(focusEditor = true) {
  if (!note.aceSessions[note.pgN]) {
    const newSession = ace.createEditSession(note.content[note.pgN]);
    editor.setSession(newSession);
    editor.session.setUseWrapMode(true);
    editor.session.setMode("ace/mode/markdown");
    editor.session.on("change", updateAndSaveNotesLocally);
    editor.session.on("change", () => {
      if (autosavingEnabled && !isSaving) {
        saving(note.name);
        // timeout to prevent the server from being overloaded
        setTimeout(() => {
          if (note.name === noteBeingAutoSaved) {
            saveNoteBookToDb(note.name, true);
          }
          doneSaving();
        }, 500);
      }
    });
    note.aceSessions[note.pgN] = newSession;
    editor.setSession(note.aceSessions[note.pgN]);
  } else {
    editor.setSession(note.aceSessions[note.pgN]);
  }
  window.history.replaceState(null, null, `/${note.name}?${note.pgN + 1}`);
  updateAndSaveNotesLocally();
  createPageNumbers();
  if (focusEditor) {
    editor.focus();
  }
}

async function updateAndSaveNotesLocally() {
  note.content[note.pgN] = editor.getValue();
  if (!reserved(note.name) && !note.isEncrypted) {
    localStorage.setItem(note.name, JSON.stringify(note.content));
  }
  syncStatus();
  previewHandlers = previewHandlers.reduce(
    (arr, { element, type, listener }) => {
      element.removeEventListener(type, listener);
      return arr;
    },
    []
  );
  const v = document.createElement("div");
  try {
    v.innerHTML = format(editor.getValue());
  } catch (err) {
    v.innerHTML = format(editor.getValue(), {
      includeMath: false,
    });
  }
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

function syncStatus() {
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
    let writtenPages = getWrittenPages(note.content);
    // let writtenPages = note.content;
    if (JSON.stringify(writtenPages) === JSON.stringify(note.dbSave)) {
      // content is synced
      editTabText(note.name, note.name);
      synced.setContent(`Notes were saved at ${note.date}`);
      areNotesSavedIcon.style.filter = "none";
    } else {
      // content is not in sync with db
      editTabText(note.name, `* ${note.name}`);
      synced.setContent(
        `Notes shown differ from saved notes by ${Math.abs(
          JSON.stringify(note.content).length -
            JSON.stringify(note.dbSave).length
        )} chars`
      );
      areNotesSavedIcon.style.filter = "grayscale(1)";
    }
  }
}

function formatNonText(ele) {
  for (const node of ele.getElementsByClassName("reference")) {
    const button = document.createElement("button");
    button.innerText = node.innerText;
    button.setAttribute("data-bookname", node.getAttribute("data-bookname"));
    button.setAttribute("data-page", node.getAttribute("data-page"));
    button.classList.add("reference");
    button.addEventListener("click", switchTab);
    previewHandlers.push({
      element: button,
      type: "click",
      listener: switchTab,
    });
    button.addEventListener("mouseover", referToolTip);
    previewHandlers.push({
      element: button,
      type: "mouseover",
      listener: referToolTip,
    });
    button.addEventListener("focus", referToolTip);
    previewHandlers.push({
      element: button,
      type: "focus",
      listener: referToolTip,
    });
    node.replaceWith(button);
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
  }
  Prism.highlightAllUnder(ele);
}

// page numbers on the left
function createPageNumbers() {
  pageHandlers = pageHandlers.reduce((arr, { element, type, listener }) => {
    element.removeEventListener(type, listener);
    return arr;
  }, []);
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
    {
      attr: this.src,
      text: "Open Image",
      click: function () {
        window.open(`${this.getAttribute("data-props")}`, "_blank");
        delContextMenu();
      },
    },
    {
      attr: this.src.slice(this.src.indexOf("/uploads/") + 9),
      text: "Delete Image",
      click: function () {
        // TODO: Handle images in the notebook that aren't uploaded (just links to URLs)
        confirmation_cm(this, () =>
          deleteImageFromDb(this.getAttribute("data-props"))
        );
      },
    },
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
            )[parseInt(this.getAttribute("data-page"))]
          );
    lastDynamicTippy.setContent(
      `<div class = 'pagePreviewContainer'>${content}</div>`
    );
    lastDynamicTippy.show();
  } catch (err) {
    lastDynamicTippy.destroy();
  }
  // console.log(document.getElementsByClassName("tippy-content")[0].parentElement.parentElement)
}
