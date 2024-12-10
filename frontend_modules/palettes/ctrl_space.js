import themes from "../themes/index.js";
import {
  deleteNoteBookFromDb,
  deletePage,
  forceUpdateNotes,
  switchNote,
  saveNoteBookToDb,
} from "../note_utils.js";
import { note } from "../data/note.js";
import { getTitle } from "../../shared_modules/removeMD.js";
import { getFamily, nestNote, relinquishNote } from "../hierarchy.js";
import { listInMemory } from "../data/list.js";
import { toggleList } from "../resize_list.js";
import { changeTheme } from "../theming.js";
import { accents, insertPage, jumpToDesiredPage } from "../dom_formatting.js";
import { AISUmmary } from "../ai_utils.js";
import { toggleWikiSearch } from "../wikipedia.js";
import { editingWindow } from "../editing_window.js";
import { showBookDiffPopup } from "../popups/book_diff.js";
import { flashcardMode, showFlashcards } from "../popups/flashcards.js";
import { createPalette } from "./cmd.js";
import { eid } from "../dom_utils.js";
import { closeTab, makeTabInDom, savedWS } from "../tabs.js";
import { editor } from "../important_stuff/editor.js";
import { showSearch } from "./ctrl_f.js";
import { showNotifs } from "./notif_palette.js";
import { disableAutosave, enableAutosave } from "../autosave.js";
import { cmInput } from "./cm_input.js";
import getAnyBookContent from "../get_book_content.js";
import { editReserved } from "../data/reserved_notes.js";
import { setCurrentPublicBook } from "../publishing.js";
import { showUserList } from "./user_list.js";
import { changeSettings, getSetting } from "../important_stuff/settings.js";
import localforage from "localforage";
import notes_api from "../important_stuff/api.js";
import { searchTag } from "./tags_pal.js";
import { insertStickyNote, insertTemplate } from "../snippets.js";

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
        handler: async () => {
          await localforage.clear();
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
    name: "Insert Page After Current Page",
    searchTerm: "create page",
    handler: () => insertPage("->"),
  },
  {
    name: "Insert Page Before Current Page",
    searchTerm: "create page",
    handler: () => insertPage("<-"),
  },
  {
    name: "Go to Page",
    searchTerm: "switch pages jump to pages",
    populater: () => {
      return note.content.map((e, i) => {
        return {
          name: getTitle(e),
          searchTerm: `${(i + 1).toString()} ${
            i === note.content.length - 1 ? "last" : ""
          }`,
          handler: () => jumpToDesiredPage(i),
        };
      });
    },
  },
  {
    name: "Previous Page",
    searchTerm: "back pages prev pages",
    handler: () => jumpToDesiredPage(note.pgN - 1),
  },
  {
    name: "Find By Tag",
    searchTerm: "tag search tags filter by tag",
    handler: () => searchTag(),
  },
  {
    name: "Find By Recent Tag",
    searchTerm: "tag search recent tags filter by recent tag",
    populater: () => {
      return getSetting("recents_tags", []).map((e) => {
        return {
          name: `${e}`,
          handler: () =>
            switchNote("Tag-Viewer", {
              props: e,
            }),
        };
      });
    },
  },
  {
    name: "Next Page",
    searchTerm: "forward pages",
    handler: () => jumpToDesiredPage(note.pgN + 1),
  },
  {
    name: "Open Recent Notebook",
    searchTerm: "open notebooks switch notebooks open recents",
    populater: () => {
      return getSetting("recents", []).map((e) => {
        return {
          name: `${e}`,
          handler: () => switchNote(e),
        };
      });
    },
  },
  {
    name: "Open All Recent Notebooks",
    searchTerm: "open notebooks switch notebooks open recents",
    handler: async () => {
      await switchNote(getSetting("recents", []).shift());
      for (const tab of getSetting("recents", [])) {
        makeTabInDom(tab);
      }
    },
  },
  {
    name: "Clear Recent Notebooks",
    searchTerm: "clear recents",
    handler: () => {
      changeSettings("recents", []);
    },
  },
  {
    name: "Clear Recent Tags",
    handler: () => {
      changeSettings("recents_tags", []);
    },
  },
  {
    name: "View Public Notebooks",
    searchTerm:
      "open public notebooks open shared notebooks view shared notebooks",
    populater: async () => {
      const publics = await notes_api.get.published();
      if (!publics.ok) {
        return [
          {
            name: "An error occurred",
            info: publics.statusText,
          },
        ];
      }
      const json = await publics.json();
      const children = json.data.map((e) => {
        return {
          name: `${e.name} (${e.user})`,
          handler: async () => {
            editReserved("Public-Notebook", e.content);
            setCurrentPublicBook([e.name, e.user]);
            await closeTab("Public-Notebook", {
              refresh: true,
              switchAsFallBack: true,
            });
          },
          info:
            Date.now() - e.date < 1000 * 60 * 60 * 24 * 2
              ? "Updated Recently"
              : "",
        };
      });
      return children;
    },
  },
  {
    name: "Open Saved Notebook",
    searchTerm: "open notebooks switch notebooks view saved notebooks",
    populater: async () => {
      return listInMemory.map((e) => ({
        name: `${e.name}`,
        handler: () => switchNote(e.name),
        info:
          Date.now() - e.date < 1000 * 60 * 60 * 24 * 2
            ? "Updated Recently"
            : "",
      }));
    },
  },
  {
    name: "Copy Notebook",
    handler: () => cmInput(note.name, "copy"),
  },
  {
    name: "Create Child Notebook",
    searchTerm: "make child notebooks",
    handler: () => cmInput(note.name, "child"),
  },
  {
    name: "View Parent Notebooks",
    searchTerm:
      "view parents go to parent notebook open parents open parent notebooks",
    populater: async () => {
      const parents = await getAnyBookContent(note.name, "parents");
      return parents.map((e) => {
        return {
          name: `${e}`,
          handler: () => switchNote(e),
        };
      });
    },
  },
  {
    name: "View Child Notebooks",
    searchTerm:
      "view children go to child notebook open children open child notebooks",
    populater: async () => {
      const children = await getAnyBookContent(note.name, "children");
      return children.map((e) => {
        return {
          name: `${e}`,
          handler: () => switchNote(e),
        };
      });
    },
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
    name: "Close All Tabs",
    handler: async () => {
      for (const tab of Array.from(savedWS)) {
        await closeTab(tab);
      }
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
    searchTerm: "back tabs prev tabs",
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
    name: "Insert File",
    searchTerm: "upload image upload file insert image insert pdf",
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
    searchTerm: "trash remove page delete page",
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
    name: "Download All Notebooks",
    info: ".zip",
    searchTerm: "export zip",
    handler: () => window.open("/api/export?downloadAll=true"),
  },
  {
    name: "Download Current Notebook",
    info: ".zip",
    searchTerm: "export zip",
    handler: () => window.open(`/api/export?name=${note.name}`),
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
    searchTerm:
      "view graph view note graph view notemap note-map open note map open notemap",
    handler: () => switchNote("Note-Map"),
  },
  {
    name: "Edit User Settings",
    searchTerm: "open user config open config edit config edit user config",
    handler: () => switchNote("user__config"),
  },
  {
    name: "Edit Snippets",
    searchTerm:
      "edit templates open snippets create templates create snippets make templates make snippets",
    handler: () => switchNote("snippets"),
  },
  {
    name: "Practice Flashcards",
    searchTerm: "quizlet open flashcards",
    handler: () => showFlashcards(true, [note.name]),
  },
  {
    name: "Insert Scratch Pad Content",
    searchTerm:
      "import sticky note content import scratch pad content import scratchpad content insert scratchpad content insert sticky note content",
    handler: insertStickyNote,
  },
  {
    name: "Insert Snippet",
    searchTerm: "insert template insert snippets",
    populater: async () => {
      const snippets = await notes_api.get.snippets();
      if (!snippets.ok) {
        return [
          {
            name: "An error occurred",
            info: snippets.statusText,
          },
        ];
      }
      const json = await snippets.json();
      return json.data.map((e) => {
        return {
          name: getTitle(e),
          handler: () => insertTemplate(e),
        };
      });
    },
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
    searchTerm: "dark light color scheme set theme",
    children: themes.map((e) => {
      return {
        name: e.name
          .split("_")
          .map((e) => e.substring(0, 1).toUpperCase() + e.substring(1))
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
