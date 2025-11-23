import {
  brain,
  toolBar,
  areNotesSavedIcon,
  tabs,
} from "../important_stuff/dom_refs";
import { confirmation_cm, contextMenu, delContextMenu } from "../context_menu";
import {
  deletePage,
  saveNoteBookToDb,
  deleteNoteBookFromDb,
  forceUpdateNotes,
} from "../note_utils";
import { editingWindow } from "../editing_window";
import { handlePageMovement } from "../dom_formatting";
import { toggleWikiSearch } from "../wikipedia";
// import { AISUmmary, aiGenerating } from "../ai_utils";
import { flashcardMode } from "../popups/flashcards";
import { showBookDiffPopup } from "../popups/book_diff";
import { insertAndSaveImage } from "../images";
import themes from "../themes";
import { changeTheme } from "../theming";
import { eid } from "../dom_utils";
import { autosavingEnabled, toggleAutosave } from "../autosave";
import { listContextMenu } from "../modify_note_context_menu";
import { note } from "../data/note";
import { updateList } from "../list_utils";
import { publishBook, unpublishBook } from "../publishing";
import { changeSettings, getSetting } from "../important_stuff/settings";
import notes_api from "../important_stuff/api";
import { getTitle } from "../../shared_modules/removeMD";
import { insertStickyNote, insertTemplate } from "../snippets";
// import { showTodo } from "../popups/todo";

export default setupToolbar;

async function decryptCurrentBook() {
  if (
    note.isEncrypted &&
    confirm(
      "This will immediately save your notebook in an unencrypted state. Proceed?",
    )
  ) {
    note.isEncrypted = false;
    note.password = undefined;
    await saveNoteBookToDb(note.name);
    document.body.classList.remove("isEncrypted");
    updateList();
  }
}

async function encryptCurrentBook() {
  if (!note.isEncrypted) {
    const possiblePassword = prompt("Enter a password") || undefined;
    // user cancelled prompt or entered empty string
    if (possiblePassword !== undefined) {
      note.password = possiblePassword;
      note.isEncrypted = true;
      await saveNoteBookToDb(note.name);
      document.body.classList.add("isEncrypted");
      localStorage.removeItem(note.name);
      updateList();
    }
  } else {
    notyf.error("Note is already encrypted");
  }
}

function setupToolbar() {
  tabs.addEventListener("wheel", (e) => {
    e.preventDefault();
    tabs.scroll({
      left: tabs.scrollLeft + e.deltaY,
    });
  });
  // toolbar
  eid("icon1").addEventListener("click", () => {
    if (!note.readOnly) {
      saveNoteBookToDb(note.name);
    }
  });
  eid("icon2").addEventListener("click", (e) => listContextMenu(e, true));
  eid("icon3").addEventListener("click", (e) => {
    if (note.readOnly) {
      return;
    }
    contextMenu(
      e,
      [
        note.saved
          ? {
              icon: "delete",
              text: "Delete Notebook",
              click: (props, ele) =>
                confirmation_cm(ele, () => deleteNoteBookFromDb(note.name)),
            }
          : null,
        {
          icon: "drive_file_move",
          text: "Delete This Page",
          click: (props, ele) => confirmation_cm(ele, deletePage),
        },
      ],
      [`${e.clientX - 160}px`, "75px"],
    );
  });
  eid("getFile1").addEventListener("change", () => {
    if (!note.readOnly) {
      insertAndSaveImage();
    }
  });
  eid("icon5").addEventListener("click", (e) =>
    contextMenu(
      e,
      [
        {
          text: "Split",
          click: () => {
            changeSettings("viewPref", "split");
            editingWindow("split");
            delContextMenu();
          },
        },
        {
          text: "Read",
          click: () => {
            changeSettings("viewPref", "read");
            editingWindow("read");
            delContextMenu();
          },
        },
        {
          text: "Write",
          click: () => {
            changeSettings("viewPref", "write");
            editingWindow("write");
            delContextMenu();
          },
        },
        { spacer: true },
        {
          text: "Change Theme",
          children: themes.map((e) => {
            if (e.hidden) {
              return null;
            }
            return {
              text: e.name
                .split("_")
                .map((e) => e.substring(0, 1).toUpperCase() + e.substring(1))
                .join(" "),
              click: () => changeTheme(e.name),
            };
          }),
        },
      ],
      [`${e.clientX - 160}px`, "75px"],
    ),
  );
  eid("icon6").addEventListener("click", () => {
    handlePageMovement({
      direction: "<-",
      amount: 1,
    });
  });
  eid("icon7").addEventListener("click", (e) => {
    handlePageMovement({
      direction: "->",
      amount: 1,
      event: e,
    });
  });
  brain.addEventListener("click", (e) =>
    contextMenu(
      e,
      [
        {
          text: "Toggle Wiki Search",
          click: () => toggleWikiSearch(),
        },
        {
          text: "Create Flashcards",
          click: () => {
            flashcardMode();
            delContextMenu();
          },
        },
        { spacer: true },
        {
          text: "Insert Scratch Pad",
          click: () => {
            insertStickyNote();
            delContextMenu();
          },
        },
        {
          text: "Insert Snippet",
          populator: async (e) => {
            const snippets = await notes_api.get.snippets();
            if (!snippets.ok) {
              return [{ text: "An error occurred", appearance: "unavailable" }];
            }
            const json = await snippets.json();
            return json.data.map((e) => ({
              text: getTitle(e),
              click: () => {
                insertTemplate(e);
                delContextMenu();
              },
            }));
          },
        },
      ],
      [`${e.clientX - 160}px`, "75px"],
    ),
  );
  if (!getSetting("wikiEnabled", true)) {
    brain.classList.add("grayscale");
    brain.setAttribute("data-disabled", "");
  }
  areNotesSavedIcon.addEventListener("animationend", () =>
    areNotesSavedIcon.classList.remove("saved"),
  );
  areNotesSavedIcon.addEventListener("click", (e) => {
    if (note.readOnly) {
      return;
    }
    contextMenu(
      e,
      [
        {
          text: "More Details",
          click: () => {
            showBookDiffPopup();
            delContextMenu();
          },
        },
        {
          text: autosavingEnabled ? "Disable Auto Save" : "Enable Auto Save",
          click: () => {
            toggleAutosave();
            delContextMenu();
          },
        },
        {
          text: "Force Update",
          click: (props, ele) => confirmation_cm(ele, forceUpdateNotes),
        },
        {
          text: note.isPublic ? "Make Private" : "Make Public",
          click: () => {
            if (note.isPublic) {
              unpublishBook(note.name);
            } else {
              publishBook(note.name);
            }
            delContextMenu();
          },
        },
        // {
        //   text: note.isEncrypted ? "Decrypt Notebook" : "Encrypt Notebook",
        //   click: () => {
        //     if (note.isEncrypted) {
        //       decryptCurrentBook();
        //     } else {
        //       encryptCurrentBook();
        //     }
        //     delContextMenu();
        //   },
        // },
        // note.isEncrypted
        //   ? {
        //       text: "Change Password",
        //       click: () => {
        //         const newPassword = prompt("Enter a new password") || undefined;
        //         // user cancelled prompt or entered empty string
        //         if (newPassword !== undefined) {
        //           note.password = newPassword;
        //           saveNoteBookToDb(note.name);
        //         }
        //         delContextMenu();
        //       },
        //     }
        //   : null,
      ],
      [`${e.clientX - 160}px`, "75px"],
    );
  });
  toolBar.addEventListener("contextmenu", (e) => e.preventDefault());
}
