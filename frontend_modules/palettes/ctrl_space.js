import themes from "../themes/index.js";
import {
  deleteNoteBookFromDb,
  deletePage,
  forceUpdateNotes,
  switchNote,
  saveNoteBookToDb,
} from "../note_utils.js";
import { note } from "../data/note.js";
import removeMD from "../../shared_modules/removeMD.js";
import { getFamily, nestNote, relinquishNote } from "../hierarchy.js";
import { listInMemory } from "../data/list.js";
import { toggleList } from "../resize_list.js";
import { changeTheme } from "../theming.js";
import { jumpToDesiredPage } from "../dom_formatting.js";
import { AISUmmary } from "../ai_utils.js";
import { toggleWikiSearch } from "../wikipedia.js";
import { editingWindow } from "../editing_window.js";
import { insertStickyNote } from "../sticky_note.js";
import { showBookDiffPopup } from "../popups/book_diff.js";
import { flashcardMode, showFlashcards } from "../popups/flashcards.js";
import { createPalette } from "./cmd.js";
import { eid } from "../dom_utils.js";
import { closeTab, savedWS } from "../tabs.js";
import { editor } from "../important_stuff/editor.js";
import { showSearch } from "./ctrl_f.js";
import { showNotifs } from "./notif_palette.js";
import { disableAutosave, enableAutosave } from "../autosave.js";
import { cmInput } from "./cm_input.js";
import { getAnyBookContent } from "../get_book_content.js";
import { editReserved } from "../data/reserved_notes.js";
import { setCurrentPublicBook } from "../publishing.js";
import { showUserList } from "./user_list.js";
// import { showTodo } from "../popups/todo.js";

export { showPal };

function showPal() {
  createPalette(
    "Search for commands...",
    (results, text, render, filter) => {
      render(1, filter(commands, text), results);
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
    name: "List Users",
    searchTerm: "user list show users find users",
    handler: () => showUserList(),
  },
  {
    name: "New Page",
    searchTerm: "create page",
    handler: () => jumpToDesiredPage(note.content.length),
  },
  {
    name: "Go to Page",
    searchTerm: "switch pages jump to pages",
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
    searchTerm: "back pages",
    handler: () => jumpToDesiredPage(note.pgN - 1),
  },
  {
    name: "Next Page",
    searchTerm: "forward pages",
    handler: () => jumpToDesiredPage(note.pgN + 1),
  },
  {
    name: "Open Recent Notebooks",
    searchTerm: "open notebooks switch notebooks",
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
    name: "View Public Notebooks",
    searchTerm: "open public notebooks open shared notebooks",
    populater: async () => {
      const publics = await fetch("/api/get/published");
      const json = await publics.json();
      const children = json.data.map((e) => {
        return {
          name: `${e.name} (${e.user})`,
          handler: async () => {
            editReserved("Shared-Notebook", e.content);
            setCurrentPublicBook([e.name, e.user]);
            await closeTab("Shared-Notebook", {
              refresh: true,
              switchAsFallBack: true,
            });
          },
        };
      });
      return children;
    },
  },
  {
    name: "Open Saved Notebook",
    searchTerm: "open notebooks switch notebooks",
    populater: async () => {
      return listInMemory.map((e) => ({
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
    searchTerm: "close tab",
    handler: () => closeTab(note.name),
  },
  {
    name: "Close Tab",
    populater: () => {
      return Array.from(savedWS)
        .reverse()
        .map((e) => {
          return {
            name: `${e}`,
            handler: () => closeTab(e),
          };
        });
    },
  },
  {
    name: "Go to Tab",
    searchTerm: "switch tabs",
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
    searchTerm: "back tabs",
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
    searchTerm: "next tabs",
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
      return listInMemory.reduce((arr, e) => {
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
    searchTerm: "view graph view note graph view notemap note-map",
    handler: () => switchNote("Note-Map"),
  },
  {
    name: "Practice Flashcards",
    searchTerm: "quizlet open flashcards",
    handler: () => showFlashcards(true, [note.name]),
  },
  // {
  //   name: "Open Calendar",
  //   searchTerm: "open todo",
  //   handler: () => showTodo(),
  // },
  // {
  //   name: "Insert Calendar Event",
  //   searchTerm: "import todo insert todo",
  //   handler: () => showTodo(true),
  // },
  {
    name: "Insert Scratchpad Content",
    searchTerm: "import sticky note import scratchpad insert sticky note",
    handler: insertStickyNote,
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
  {
    name: "Enable Auto Save",
    searchTerm: "autosave",
    handler: enableAutosave,
  },
  {
    name: "Disable Auto Save",
    searchTerm: "autosave",
    handler: disableAutosave,
  },
].sort((a, b) => a.name.localeCompare(b.name));
