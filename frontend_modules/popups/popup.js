import { editor, mainContainer } from "../../main";
import { clearTaskTippys, deleteCalendar } from "./calendar";
import { delContextMenu } from "../context_menu";
import { hideStickyNotes } from "../sticky_note";
import { setRejectToNull } from "./flashcards";
import { attemptRemoval, eid } from "../dom_utils";

export { createPopupWindow, closePopupWindow };

function createPopupWindow(noAnimation) {
  closePopupWindow();
  const modalContainer = document.createElement("div");
  if (noAnimation) {
    modalContainer.style.animation = "none";
  }
  modalContainer.id = "popupModal";
  modalContainer.addEventListener("click", (e) => {
    closePopupWindow();
  });
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
  const bookDiffExitContainer = document.createElement("div");
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
  mainContainer.after(modalContainer)
  return bookDiffContent;
}

function closePopupWindow() {
  attemptRemoval([eid("popupModal")])
  deleteCalendar();
  setRejectToNull();
  clearTaskTippys();
  editor.session.off("change", closePopupWindow);
}
