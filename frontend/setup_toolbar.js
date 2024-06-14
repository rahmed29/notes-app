import { brain, toolBar } from "../main";
import { contextMenu, delContextMenu } from "./context_menu";
import {
  deletePage,
  note,
  saveNoteBookToDb,
  deleteNoteBookFromDb,
  forceUpdateNotes,
} from "./note_utils";
import { editingWindow } from "./editing_window";
import { handlePageMovement } from "./dom_formatting";
import { toggleWikiSearch } from "./wikipedia";
import { AISUmmary } from "./chat_gpt";
import { insertStickyNote } from "./sticky_note";
import { showTodo } from "./calendar";
import { flashcardMode } from "./flashcards";
import { encryptCurrentBook, decryptCurrentBook } from "./encryption";
import { insertAndSaveImage } from "./images";
import { listContextMenu } from "./list_utils";

export default setupToolbar;

function setupToolbar() {
  // toolbar
  document.getElementById("icon1").addEventListener("click", saveNoteBookToDb);
  document
    .getElementById("icon2")
    .addEventListener("click", (e) => listContextMenu(e, true));
  document.getElementById("icon3").addEventListener("click", (e) =>
    contextMenu(e, [
      {
        text: "Delete Notebook",
        click: function () {
          this.classList.add("rios");
          this.innerText = "Confirm";
          this.addEventListener(
            "click",
            () => {
              deleteNoteBookFromDb(note.name);
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
    ])
  );
  document
    .getElementById("getFile1")
    .addEventListener("change", insertAndSaveImage);
  document.getElementById("icon5").addEventListener("click", (e) =>
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
    ])
  );
  document
    .getElementById("icon6")
    .addEventListener("click", () => handlePageMovement(true, 1, false));
  document
    .getElementById("icon7")
    .addEventListener("click", (e) => handlePageMovement(false, 1, false, e));
  brain.addEventListener("click", (e) =>
    contextMenu(e, [
      {
        text: "Toggle Wiki Search",
        click: () => toggleWikiSearch(),
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
    ])
  );
  areNotesSavedIcon.addEventListener("animationend", function () {
    this.classList.remove("saved");
  });
  areNotesSavedIcon.addEventListener("click", (e) =>
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
      {
        text: note.isEncrypted ? "Decrypt Notebook" : "Encrypt Notebook",
        click: () => {
          if (note.isEncrypted) {
            decryptCurrentBook();
          } else {
            encryptCurrentBook();
          }
          delContextMenu();
        },
        appearance: "ios",
      },
      note.isEncrypted
        ? {
            text: "Change Password",
            click: () => {
              const newPassword = prompt("Enter a new password");
              if (newPassword != null) {
                note.password = newPassword;
                saveNoteBookToDb(note.name);
              }
              delContextMenu();
            },
            appearance: "ios",
          }
        : null,
    ])
  );
  toolBar.addEventListener("contextmenu", (e) => e.preventDefault());
}
