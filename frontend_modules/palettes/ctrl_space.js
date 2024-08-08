import themes from "../themes/index.js";
import {
  note,
  deleteNoteBookFromDb,
  deletePage,
  forceUpdateNotes,
  switchNote,
  saveNoteBookToDb,
  getAnyBookContent,
} from "../note_utils.js";
import removeMD from "../../modules/removeMD.js";
import { getFamily, nestNote, relinquishNote } from "../hierarchy.js";
import { cmInput, getList, toggleList } from "../list_utils.js";
import { changeTheme } from "../theming.js";
import { jumpToDesiredPage } from "../dom_formatting.js";
import { AISUmmary } from "../ai_utils.js";
import { toggleWikiSearch } from "../wikipedia.js";
import { editingWindow } from "../editing_window.js";
import { showTodo } from "../popups/calendar.js";
import { insertStickyNote } from "../sticky_note.js";
import { showBookDiffPopup } from "../popups/book_diff.js";
import { flashcardMode, showFlashcards } from "../popups/flashcards.js";
import { createPalette } from "./cmd.js";
import { eid } from "../dom_utils.js";
import { closeTab, savedWS } from "../tabs.js";
import { editor } from "../important_stuff/editor.js";
import { showSearch } from "./ctrl_f.js";
import { showNotifs } from "./notif_palette.js";

export { showPal };

function showPal() {
  createPalette(
    "Search for commands...",
    (results, text, render, filter) => {
      render(
        1,
        filter(commands, text),
        results
      );
    },
    (results, render) => {
      render(1, commands, results);
    }
  );
}

const commands = [
  {
    name: "Clear Local Storage",
    searchTerm: "reset local storage update delete",
    children: [
      {
        name: "Confirm",
        handler: () => {
          Object.entries(localStorage).forEach(([key, value]) => {
            if (key.slice(0, 1) !== "/") {
              localStorage.removeItem(key);
            }
          });
          window.location.reload();
        },
      },
    ],
  },
  {
    name: "Open Notification Palette",
    searchTerm: "ai summary notifs ai flashcards restore state revert",
    handler: showNotifs,
  },
  {
    name: "Search for Text",
    searchTerm: "find text",
    handler: () => showSearch(true),
  },
  {
    name: "New Page",
    searchTerm: "create page",
    handler: () => jumpToDesiredPage(note.content.length),
  },
  {
    name: "Go to Page",
    searchTerm: "switch page jump to page",
    populater: () => {
      return note.content.map((e, i) => {
        return {
          name: `${removeMD(e.split("\n")[0])}`,
          searchTerm: (i + 1).toString(),
          handler: () => jumpToDesiredPage(i),
        };
      });
    },
  },
  {
    name: "Previous Page",
    searchTerm: "back",
    handler: () => jumpToDesiredPage(note.pgN - 1),
  },
  {
    name: "Next Page",
    handler: () => jumpToDesiredPage(note.pgN + 1),
  },
  {
    name: "Open Recent Notebooks",
    searchTerm: "open notebooks",
    populater: () => {
      return JSON.parse(localStorage.getItem("/recents")).map((e) => {
        return {
          name: `${e}`,
          handler: () => switchNote(e),
        };
      });
    },
  },
  {
    name: "Open Saved Notebook",
    searchTerm: "open notebooks",
    populater: async () => {
      const json = await getList();
      return json.map((e) => ({
        name: `${e.name}`,
        handler: () => switchNote(e.name),
      }));
    },
  },
  {
    name: "Copy Notebook",
    handler: () => cmInput(note.name, "copy"),
  },
  {
    name: "Create Child Notebook",
    handler: () => cmInput(note.name, "child"),
  },
  {
    name: "Rename Notebook",
    searchTerm: "edit",
    handler: () => cmInput(note.name, "rename"),
  },
  {
    name: "Open Notebook",
    searchTerm: "open notebooks",
    handler: () => cmInput(note.name, "open"),
  },
  {
    name: "Close Current Tab",
    handler: () => closeTab(note.name),
  },
  {
    name: "Go to Tab",
    searchTerm: "switch tab",
    populater: () => {
      return Array.from(savedWS)
        .reverse()
        .map((e) => {
          return {
            name: `${e}`,
            handler: () => switchNote(e),
          };
        });
    },
  },
  {
    name: "Previous Tab",
    searchTerm: "back",
    handler: () => {
      const tabs = Array.from(savedWS);
      const index = tabs.indexOf(note.name);
      if (index === tabs.length - 1) {
        switchNote(tabs[0]);
      } else {
        switchNote(tabs[index + 1]);
      }
    },
  },
  {
    name: "Next Tab",
    handler: () => {
      const tabs = Array.from(savedWS).reverse();
      const index = tabs.indexOf(note.name);
      if (index === tabs.length - 1) {
        switchNote(tabs[0]);
      } else {
        switchNote(tabs[index + 1]);
      }
    },
  },
  {
    name: "Save Notebook",
    handler: () => saveNoteBookToDb(note.name),
  },
  {
    name: "Insert Image",
    searchTerm: "upload image",
    handler: () => eid("getFile1").click(),
  },
  {
    name: "Nest Notebook",
    searchTerm: "child",
    populater: async () => {
      const family = await getFamily(note.name);
      const json = await getList();
      return json.reduce((arr, e) => {
        if (e.name !== note.name && !family.includes(e.name)) {
          arr.push({
            name: `${e.name}`,
            handler: () => nestNote(note.name, e.name),
          });
        }
        return arr;
      }, []);
    },
  },
  {
    name: "Relinquish Notebook",
    searchTerm: "unnest",
    populater: async () => {
      return (await getAnyBookContent(note.name, "parents")).map((parent) => ({
        name: `${parent}`,
        handler: () => relinquishNote(note.name, parent),
      }));
    },
  },
  {
    name: "Compare Local Notes to Database",
    searchTerm: "db diff",
    handler: showBookDiffPopup,
  },
  {
    name: "AI Summary",
    searchTerm: "chatgpt ollama",
    children: [
      {
        name: "ChatGPT",
        handler: () => AISUmmary("chatgpt"),
      },
      {
        name: "Ollama",
        handler: () => AISUmmary("ollama"),
      },
    ],
  },
  {
    name: "Create Flashcards",
    searchTerm: "flashcard mode",
    handler: flashcardMode,
  },
  {
    name: "Delete This Page",
    searchTerm: "trash remove",
    children: [
      {
        name: "Confirm",
        handler: deletePage,
      },
    ],
  },
  {
    name: "Delete Notebook",
    searchTerm: "trash remove",
    children: [
      {
        name: "Confirm",
        handler: () => deleteNoteBookFromDb(note.name),
      },
    ],
  },
  {
    name: "Force Update Notebook",
    searchTerm: "local storage",
    children: [
      {
        name: "Confirm",
        handler: forceUpdateNotes,
      },
    ],
  },
  {
    name: "View Uploaded Images",
    searchTerm: "uploads",
    handler: () => switchNote("Your-Uploads"),
  },
  {
    name: "Go Home",
    handler: () => switchNote("home"),
  },
  {
    name: "View Note Map",
    searchTerm: "view graph view note graph view",
    handler: () => switchNote("Note-Map"),
  },
  {
    name: "Practice Flashcards",
    searchTerm: "quizlet",
    handler: showFlashcards,
  },
  {
    name: "Open Calendar",
    searchTerm: "open todo open tasks",
    handler: () => showTodo(false),
  },
  {
    name: "Insert Scratchpad Content",
    searchTerm: "import sticky note import scratchpad",
    handler: insertStickyNote,
  },
  {
    name: "Insert Calendar Event",
    searchTerm: "import event import calendar event import todo import task",
    handler: () => showTodo(true),
  },
  {
    name: "Toggle Vim Mode",
    handler: () => {
      if (notesTextArea.hasAttribute("data-vim")) {
        editor.setKeyboardHandler("ace/keyboard/vscode");
        notesTextArea.removeAttribute("data-vim");
      } else {
        editor.setKeyboardHandler("ace/keyboard/vim");
        notesTextArea.setAttribute("data-vim", "");
      }
    },
  },
  {
    name: "Change Theme",
    searchTerm: "dark light color scheme",
    children: themes.map((e) => {
      return {
        name: e.name
          .split("_")
          .map((e) => e.slice(0, 1).toUpperCase() + e.slice(1))
          .join(" "),
        searchTerm: e.theme_type,
        handler: () => changeTheme(e.name),
      };
    }),
  },
  {
    name: "Switch View",
    searchTerm: "edit split read write",
    children: [
      {
        name: "Split",
        handler: () => {
          editingWindow("split");
        },
      },
      {
        name: "Read",
        handler: () => {
          editingWindow("read");
        },
      },
      {
        name: "Write",
        handler: () => {
          editingWindow("write");
        },
      },
    ],
  },
  {
    name: "Toggle Wikipedia Search",
    handler: toggleWikiSearch,
  },
  {
    name: "Toggle List",
    searchTerm: "hide tree show tree",
    handler: toggleList,
  },
].sort((a, b) => a.name.localeCompare(b.name));
