import {
  note,
  reservedNames,
  getWrittenPages,
  getAnyBookContent,
} from "./note_utils";
import {
  editor,
  topLeftPageNumber,
  generalInfoPageNumberEle,
  synced,
  generalInfoPageNumber,
  previewContent,
} from "../main";
import morphdom from "morphdom";
import { format } from "./text_formatting";
import { contextMenu, delContextMenu } from "./context_menu";
import { switchTab, editTabText } from "./tabs";
import { showPagePreview, scrollCM } from "./list_utils";
import { deleteImageFromDb } from "./images";
import { defineCmd } from "./ctrl_space";
import { currTheme } from "./theming";
import tippy from "tippy.js";

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
      ], [`${e.clientX-160}px`, "75px"]);
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
  window.history.replaceState(null, null, `/${note.name}?${note.pgN + 1}`);
  updateAndSaveNotesLocally();
  createPageNumbers();
  editor.focus();
}

async function updateAndSaveNotesLocally() {
  note.content[note.pgN] = editor.getValue();
  if (
    !reservedNames.some((e) => e.data.name === note.name) &&
    !note.isEncrypted
  ) {
    localStorage.setItem(note.name, JSON.stringify(note.content));
  }
  syncStatus();
  previewHandlers = previewHandlers.reduce((arr, { element, type, listener }) => {
    element.removeEventListener(type, listener);
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

function syncStatus() {
  if (reservedNames.some((e) => e.data.name === note.name)) {
    // note name reserved
    editTabText(note.name, note.name)
    areNotesSavedIcon.style.filter = "grayscale(1)";
    document.title = note.name;
  } else if (!note.saved) {
    // note not saved
    editTabText(note.name, `* ${note.name}`)
    synced.setContent(`Notes are not saved`);
    areNotesSavedIcon.style.filter = "hue-rotate(270deg)";
    document.title = `* ${note.name}`;
  } else {
    // note is saved
    let writtenPages = getWrittenPages(note.content);
    if (JSON.stringify(writtenPages) === JSON.stringify(note.dbSave)) {
      // content is synced
      editTabText(note.name, note.name)
      synced.setContent(`Notes were saved at ${note.timeOfSave}`);
      areNotesSavedIcon.style.filter = "none";
      document.title = note.name;
    } else {
      // content is not in sync with db
      editTabText(note.name, `* ${note.name}`)
      synced.setContent(
        `Notes shown differ from saved notes by ${Math.abs(
          JSON.stringify(note.content).length - JSON.stringify(note.dbSave).length
        )} chars`
      );
      areNotesSavedIcon.style.filter = "grayscale(1)";
      document.title = `* ${note.name}`;
    }
  }
}

function formatNonText(ele) {
  for (const node of ele.getElementsByClassName("reference")) {
    node.addEventListener("click", switchTab);
    previewHandlers.push({
      element: node,
      type: "click",
      listener: switchTab,
    });
    node.addEventListener("mouseover", referToolTip);
    previewHandlers.push({
      element: node,
      type: "mouseover",
      listener: referToolTip,
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
}

// page numbers on the left
function createPageNumbers() {
  pageHandlers = pageHandlers.reduce((arr, { element, type, listener}) => {
    element.removeEventListener(type, listener);
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

function removeImageToolTip(e) {
  contextMenu(
    e,
    [
      {
        attr: this.src,
        text: "Open Image",
        click: function () {
          window.open(`${this.getAttribute("data-props")}`, "_blank");
          delContextMenu();
        },
        appearance: "ios",
      },
      {
        attr: this.src.slice(this.src.indexOf("/uploads/") + 9),
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
    ]
  );
}

// tooltip for [[references]] to notebooks
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
  } catch (err) {
    lastDynamicTippy.destroy();
  }
  // console.log(document.getElementsByClassName("tippy-content")[0].parentElement.parentElement)
}
