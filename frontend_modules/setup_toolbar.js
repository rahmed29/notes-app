import { brain, toolBar, areNotesSavedIcon } from "../main";
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
import { AISUmmary, aiGenerating } from "./ai_utils";
import { insertStickyNote } from "./sticky_note";
import { showTodo } from "./calendar";
import { flashcardMode } from "./flashcards";
import { showBookDiffPopup } from "./book_diff";
import { encryptCurrentBook, decryptCurrentBook } from "./encryption";
import { insertAndSaveImage } from "./images";
import { listContextMenu } from "./list_utils";
import themes from "./themes";
import { changeTheme } from "./theming";
import { eid } from "./dom_utils";

export default setupToolbar;

function setupToolbar() {
  // toolbar
  eid("icon1").addEventListener("click", () => saveNoteBookToDb(note.name));
  eid("icon2").addEventListener("click", (e) => listContextMenu(e, true));
  eid("icon3").addEventListener("click", (e) =>
    contextMenu(
      e,
      [
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
      ],
      [`${e.clientX - 160}px`, "75px"]
    )
  );
  eid("getFile1").addEventListener("change", insertAndSaveImage);
  eid("icon5").addEventListener("click", (e) =>
    contextMenu(
      e,
      [
        {
          text: "Split",
          click: () => {
            localStorage.setItem("/viewPref", "split");
            editingWindow("split");
            delContextMenu();
          },
          appearance: "ios",
        },
        {
          text: "Read",
          click: () => {
            localStorage.setItem("/viewPref", "read");
            editingWindow("read");
            delContextMenu();
          },
          appearance: "ios",
        },
        {
          text: "Write",
          click: () => {
            localStorage.setItem("/viewPref", "write");
            editingWindow("write");
            delContextMenu();
          },
          appearance: "ios",
        },
        {
          text: "Change theme",
          click: () => {
            const buttons = themes.map((e) => {
              return {
                text: e.name
                  .split("_")
                  .map((e) => e.slice(0, 1).toUpperCase() + e.slice(1))
                  .join(" "),
                click: () => {
                  changeTheme(e.name);
                },
                appearance: "ios",
              };
            });
            contextMenu(e, buttons, [
              eid("contextMenu").style.left,
              eid("contextMenu").style.top,
            ]);
          },
          appearance: "ios",
        },
      ],
      [`${e.clientX - 160}px`, "75px"]
    )
  );
  eid("icon6").addEventListener("click", () =>
    handlePageMovement(true, 1, false)
  );
  eid("icon7").addEventListener("click", (e) =>
    handlePageMovement(false, 1, false, e)
  );
  brain.addEventListener("click", (e) =>
    contextMenu(
      e,
      [
        {
          text: "Toggle Wiki Search",
          click: () => toggleWikiSearch(),
          appearance: "ios",
        },
        {
          text: "AI Summary",
          click: () => {
            contextMenu(
              e,
              [
                {
                  text: "ChatGPT",
                  click: () => {
                    delContextMenu();
                    AISUmmary("chatgpt");
                  },
                  appearance: "ios",
                },
                {
                  text: "Ollama",
                  click: () => {
                    delContextMenu();
                    AISUmmary("ollama");
                  },
                  appearance: "ios",
                },
              ],
              [eid("contextMenu").style.left, eid("contextMenu").style.top]
            );
          },
          appearance: aiGenerating ? "unavailable" : "ios",
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
      ],
      [`${e.clientX - 160}px`, "75px"]
    )
  );
  areNotesSavedIcon.addEventListener("animationend", function () {
    this.classList.remove("saved");
  });
  areNotesSavedIcon.addEventListener("click", (e) =>
    contextMenu(
      e,
      [
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
              () => {
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
      ],
      [`${e.clientX - 160}px`, "75px"]
    )
  );
  toolBar.addEventListener("contextmenu", (e) => e.preventDefault());
}
