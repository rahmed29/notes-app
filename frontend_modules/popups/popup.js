import {
  bottomLeftGeneralInfo,
  bottomRightTools,
  mainContainer,
  notesPreviewArea,
  toolBar,
} from "../important_stuff/dom_refs";
import { delContextMenu } from "../context_menu";
import { hideStickyNotes } from "../sticky_note";
import { attemptRemoval, eid, getTopMostAncestor } from "../dom_utils";
import { closePalette } from "../palettes/cmd";
import { editor } from "../important_stuff/editor";

export { createPopupWindow, closePopupWindow };

let stuffToCleanUp = [];
let popupRef = null;

function stopBgTab(e) {
  if (e.key === "Tab") {
    // Still trying to figure out the best way to handle this
    // for now I just removed all access to background
    e.preventDefault();
    return;
    if (getTopMostAncestor(document.activeElement) !== popupRef) {
      e.preventDefault();
      popupRef.focus();
    }
  }
}

function escape(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    closePopupWindow();
  }
}

function createPopupWindow({ closers = [], noAnimation = false } = {}) {
  closePopupWindow();
  closePalette();
  stuffToCleanUp = closers;
  const modalContainer = document.createElement("div");
  popupRef = modalContainer;
  if (noAnimation) {
    modalContainer.style.animation = "none";
  }
  modalContainer.id = "popupModal";
  modalContainer.addEventListener("click", closePopupWindow);
  const bookDiffPopup = document.createElement("div");
  bookDiffPopup.addEventListener("click", (e) => {
    delContextMenu();
    hideStickyNotes();
    e.stopPropagation();
  });
  modalContainer.appendChild(bookDiffPopup);
  bookDiffPopup.id = "bookDiffPopup";
  const bookDiffHeader = document.createElement("div");
  bookDiffHeader.id = "bookDiffHeader";
  const bookDiffExitContainer = document.createElement("button");
  bookDiffExitContainer.id = "bookDiffExitContainer";
  const bookDiffExit = document.createElement("div");
  bookDiffExit.id = "bookDiffExit";
  bookDiffExitContainer.appendChild(bookDiffExit);
  bookDiffHeader.appendChild(bookDiffExitContainer);
  bookDiffPopup.appendChild(bookDiffHeader);
  const bookDiffContent = document.createElement("div");
  bookDiffContent.id = "bookDiffContent";
  bookDiffPopup.appendChild(bookDiffContent);
  bookDiffExitContainer.addEventListener("click", closePopupWindow, {
    once: true,
  });
  editor.session.on("change", closePopupWindow);
  mainContainer.after(modalContainer);
  document.addEventListener("keydown", stopBgTab);
  document.addEventListener("keydown", escape);
  return bookDiffContent;
}

function closePopupWindow() {
  attemptRemoval([eid("popupModal")]);
  document.removeEventListener("keydown", stopBgTab);
  document.removeEventListener("keydown", escape);
  popupRef = null;
  for (const func of stuffToCleanUp) {
    func();
  }
  editor.session.off("change", closePopupWindow);
}
