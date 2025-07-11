import { mainContainer } from "../important_stuff/dom_refs";
import { delContextMenu } from "../context_menu";
import { hideStickyNotes } from "../sticky_note";
import { attemptRemoval, eid } from "../dom_utils";
import { editor } from "../important_stuff/editor";
import { globalPaletteClose } from "../mediators/popup_closers";

export { createPopupWindow, closePopupWindow };

let stuffToCleanUp = [];
let popupRef;

function escape(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    closePopupWindow();
  }
}

const hiddenNodes = [];

function createPopupWindow(
  { closers = [], noAnimation = false } = { closers: [], noAnimation: false },
) {
  closePopupWindow();
  globalPaletteClose();
  for (const node of document.querySelectorAll("*")) {
    hiddenNodes.push({
      tabIndex: node.tabIndex,
      ref: node,
    });
    node.tabIndex = -1;
  }
  stuffToCleanUp = closers;
  const modalContainer = document.createElement("div");
  popupRef = modalContainer;
  if (noAnimation) {
    modalContainer.style.animation = "none";
  }
  modalContainer.id = "popupModal";
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
  modalContainer.addEventListener("click", closePopupWindow);
  bookDiffExitContainer.addEventListener("click", closePopupWindow, {
    once: true,
  });
  editor.session.on("change", closePopupWindow);
  mainContainer.after(modalContainer);
  document.addEventListener("keydown", escape);
  bookDiffContent.focus();
  return bookDiffContent;
}

function closePopupWindow() {
  for (const { tabIndex, ref } of hiddenNodes) {
    ref.tabIndex = tabIndex;
  }
  hiddenNodes.length = 0;
  attemptRemoval([eid("popupModal")]);
  delContextMenu();
  document.removeEventListener("keydown", escape);
  popupRef = null;
  for (const func of stuffToCleanUp) {
    func();
  }
  editor.session.off("change", closePopupWindow);
}
