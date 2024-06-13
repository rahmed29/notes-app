import { mainContainer, editor } from "../main";
import { clearTaskTippys, datePicker, calendar } from "./calendar";
import { delContextMenu } from "./context_menu";
import { hideStickyNotes } from "./sticky_note";
import { editCardsRejection, setRejectToNull } from "./flashcards";

export { createPopupWindow, closePopupWindow };

// TODO: Wrap in modal container that takes up entire page
function createPopupWindow() {
  closePopupWindow();
  const bookDiffPopup = document.createElement("div");
  bookDiffPopup.addEventListener("click", () => {
    delContextMenu();
    hideStickyNotes();
  });
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
  mainContainer.addEventListener("click", closePopupWindow, { once: true });
  editor.session.on("change", closePopupWindow);
  return { bookDiffPopup, bookDiffContent };
}

function closePopupWindow() {
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
  try {
    editCardsRejection(new Error("Exited"));
    setRejectToNull();
  } catch (err) {
    // console.log(err);
  }
  clearTaskTippys();
  mainContainer.removeEventListener("click", closePopupWindow);
  editor.session.off("change", closePopupWindow);
}
