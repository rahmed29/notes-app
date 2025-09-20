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
import { imageList, listInMemory } from "../data/list.js";
import { toggleList } from "../resize_list.js";
import { changeTheme } from "../theming.js";
import { accents, insertPage, jumpToDesiredPage } from "../dom_formatting.js";
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
import { editReserved, reserved } from "../data/reserved_notes.js";
import { setCurrentPublicBook } from "../publishing.js";
import { changeSettings, getSetting } from "../important_stuff/settings.js";
import localforage from "localforage";
import notes_api from "../important_stuff/api.js";
import { insertStickyNote, insertTemplate } from "../snippets.js";
import { excludedNames } from "../../shared_modules/validNoteName.js";

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
    name: "Clear local storage",
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
    name: "Open notification palette",
    searchTerm: "notifs restore state revert",
    handler: showNotifs,
  },
  {
    name: "Search for text",
    searchTerm: "find text",
    handler: () => showSearch(true),
  },
  {
    name: "List users",
    searchTerm: "user list show users find users",
    populatorV: 0,
    populator: async () => {
      const users = await notes_api.get.users();
      if (!users.ok) {
        return [
          {
            name: tags.statusText,
            info: tags.status,
          },
        ];
      }
      const json = await users.json();
      return json.data.map((e) => ({
        name: e.settings.nickname
          ? `${e.settings.nickname} (${e.email})`
          : e.email,
        icon: e.settings.pfp
          ? `<img src="${e.settings.pfp}" style="width: 2em; height: 2em; border-radius: 50%; object-fit: cover;">`
          : "?",
        handler: () => {
          console.log("Nothing here yet");
        },
      }));
    },
  },
  {
    name: "New page",
    searchTerm: "create page create new page",
    handler: () => jumpToDesiredPage(note.content.length),
  },
  {
    name: "Insert page after current page",
    searchTerm: "create page",
    handler: () => insertPage("->"),
  },
  {
    name: "Insert page before current page",
    searchTerm: "create page",
    handler: () => insertPage("<-"),
  },
  {
    name: "Go to page",
    searchTerm: "switch pages jump to pages",
    populator: () => {
      return note.content.map((e, i) => ({
        name: getTitle(e),
        searchTerm: `${(i + 1).toString()} ${
          i === note.content.length - 1 ? "last" : ""
        }`,
        handler: () => jumpToDesiredPage(i),
      }));
    },
  },
  {
    name: "Previous page",
    searchTerm: "back pages prev pages",
    handler: () => jumpToDesiredPage(note.pgN - 1),
  },
  {
    name: "Find notebook by tag",
    searchTerm: "tag search tags filter by tag filter tags find by tag",
    populator: async () => {
      const tags = await notes_api.get.tags();
      if (!tags.ok) {
        return [
          {
            name: tags.statusText,
            info: tags.status,
          },
        ];
      }
      const arr = await tags.json();
      return arr.data.map((e) => ({
        name: `${e}`,
        handler: () =>
          switchNote("Tag-Viewer", {
            props: e,
          }),
      }));
    },
  },
  // {
  //   name: "Find By Recent Tag",
  //   searchTerm: "tag search recent tags filter by recent tag",
  //   populator: () => {
  //     return getSetting("recents_tags", []).map((e) => ({
  //       name: `${e}`,
  //       handler: () =>
  //         switchNote("Tag-Viewer", {
  //           props: e,
  //         }),
  //     }));
  //   },
  // },
  {
    name: "Next page",
    searchTerm: "forward pages",
    handler: () => jumpToDesiredPage(note.pgN + 1),
  },
  {
    name: "Open a recent notebook",
    searchTerm:
      "open recent notebook open notebooks switch notebooks open recents go to notebook",
    populator: () => {
      return getSetting("recents", []).map((e) => ({
        name: `${e}`,
        handler: () => switchNote(e),
      }));
    },
  },
  {
    name: "Open all recent notebooks",
    searchTerm:
      "open recent notebooks switch notebooks open recents go to notebook",
    handler: async () => {
      await switchNote(getSetting("recents", []).shift());
      for (const tab of getSetting("recents", [])) {
        makeTabInDom(tab);
      }
    },
  },
  {
    name: "Clear recent notebooks list",
    searchTerm: "clear recents clear all",
    handler: () => {
      changeSettings("recents", []);
      if (note.name === "home") {
        note.reservedData.beforeOpen[0]();
        accents();
      }
    },
  },
  {
    name: "Clear recent tags list",
    searchTerm: "clear recents clear all",
    handler: () => {
      changeSettings("recents_tags", []);
      if (note.name === "home") {
        note.reservedData.beforeOpen[0]();
        accents();
      }
    },
  },
  {
    name: "View public notebooks",
    searchTerm:
      "open public notebooks open shared notebooks view shared notebooks",
    populator: async () => {
      const publics = await notes_api.get.published();
      if (!publics.ok) {
        return [
          {
            name: tags.statusText,
            info: tags.status,
          },
        ];
      }
      const json = await publics.json();
      const children = json.data.map((e) => ({
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
      }));
      return children;
    },
  },
  {
    name: "Open a saved notebook",
    searchTerm:
      "open saved notebooks open notebooks switch notebooks view saved notebooks go to notebook",
    populator: async () => {
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
    name: "Copy this notebook",
    searchTerm:
      "make a clone notebook make a copy notebook clone this notebook",
    handler: () => cmInput(note.name, "copy"),
  },
  {
    name: "Create child notebook",
    searchTerm: "make child notebooks",
    handler: () => cmInput(note.name, "child"),
  },
  {
    name: "View this notebook's parents",
    searchTerm:
      "view parents go to parent notebook open parents open parent notebooks view parent notebooks",
    populator: async () => {
      const parents = await getAnyBookContent(note.name, "parents");
      return parents.map((e) => ({
        name: `${e}`,
        handler: () => switchNote(e),
      }));
    },
  },
  {
    name: "View this notebook's children",
    searchTerm:
      "view child notebooks view children go to child notebook open children open child notebooks",
    populator: async () => {
      const children = await getAnyBookContent(note.name, "children");
      return children.map((e) => ({
        name: `${e}`,
        handler: () => switchNote(e),
      }));
    },
  },
  {
    name: "Rename this notebook",
    searchTerm: "edit",
    handler: () => cmInput(note.name, "rename"),
  },
  {
    name: "Open a notebook",
    searchTerm: "open notebooks go to notebook new notebook",
    handler: () => cmInput(note.name, "open"),
  },
  {
    name: "Close this tab",
    searchTerm: "close tab close current tab",
    handler: () => closeTab(note.name),
  },
  {
    name: "Close a tab",
    populator: () => {
      return Array.from(savedWS)
        .reverse()
        .map((e) => ({
          name: `${e}`,
          handler: () => closeTab(e),
        }));
    },
  },
  {
    name: "Close all tabs",
    handler: async () => {
      for (const tab of Array.from(savedWS)) {
        await closeTab(tab);
      }
    },
  },
  {
    name: "Go to tab",
    searchTerm: "switch tabs",
    populator: () => {
      return Array.from(savedWS)
        .reverse()
        .map((e) => ({
          name: `${e}`,
          handler: () => switchNote(e),
        }));
    },
  },
  {
    name: "Previous tab",
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
    name: "Next tab",
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
    name: "Save this notebook",
    searchTerm: "save notebook",
    handler: () => saveNoteBookToDb(note.name),
  },
  {
    name: "Upload and insert file",
    searchTerm:
      "insert and upload image insert and upload file insert image insert pdf",
    handler: () => eid("getFile1").click(),
  },
  {
    name: "Insert saved file",
    searchTerm: "upload image upload file insert image insert pdf insert file",
    populatorV: 0,
    populator: async () => {
      return imageList.map((e) => {
        return {
          name: e,
          icon: `<img src="/uploads/${e}" style="width: 2em; height: 2em; border-radius: 50%; object-fit: cover;">`,
          handler: () => insertTemplate(`![{{^}}](/uploads/${e})`),
        };
      });
    },
  },
  {
    name: "Nest this notebook",
    searchTerm: "nest notebook child",
    populator: async () => {
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
    name: "Relinquish this notebook from a parent",
    searchTerm: "unnest",
    populator: async () => {
      return (await getAnyBookContent(note.name, "parents")).map((parent) => ({
        name: `${parent}`,
        handler: () => relinquishNote(note.name, parent),
      }));
    },
  },
  {
    name: "Compare local notes to database",
    searchTerm: "db diff",
    handler: showBookDiffPopup,
  },
  {
    name: "Create flashcards",
    searchTerm: "quizlet flashcard mode",
    handler: flashcardMode,
  },
  {
    name: "Delete this page",
    searchTerm: "trash remove page delete page",
    children: [
      {
        name: "Confirm",
        handler: deletePage,
      },
    ],
  },
  {
    name: "Delete this notebook",
    searchTerm: "trash remove delete notebook",
    children: [
      {
        name: "Confirm",
        handler: () => deleteNoteBookFromDb(note.name),
      },
    ],
  },
  {
    name: "Download all notebooks",
    info: ".zip",
    searchTerm: "export zip",
    handler: () => window.open("/api/export?downloadAll=true"),
  },
  {
    name: "Download this notebook",
    info: ".zip",
    searchTerm: "export zip",
    handler: () => {
      // check if it exists in excludedNames cause we don't want the user (me, literally THE user. The one user.) trying to download stuff like user settings
      // There is no reason for them not to be able to other than the backend won't add those to the zip.
      // I could make it so if you download all notebooks it doesn't add them to zip, but if you do a single it can do it idk
      if (!excludedNames.includes(note.name) && !reserved(note.name)) {
        window.open(`/api/export?name=${note.name}`);
      } else {
        notyf.error("This notebook cannot be downloaded");
      }
    },
  },
  {
    name: "Force update this notebook",
    searchTerm: "local storage force update notebook",
    children: [
      {
        name: "Confirm",
        handler: forceUpdateNotes,
      },
    ],
  },
  {
    name: "View uploaded images",
    searchTerm: "uploads",
    handler: () => switchNote("Your-Uploads"),
  },
  {
    name: "Go home",
    handler: () => switchNote("home"),
  },
  {
    name: "View note map",
    searchTerm:
      "view graph view note graph view notemap note-map open note map open notemap",
    handler: () => switchNote("Note-Map"),
  },
  {
    name: "Edit user settings",
    searchTerm: "open user config open config edit config edit user config",
    handler: () => switchNote("user__config"),
  },
  {
    name: "Edit snippets",
    searchTerm:
      "edit templates open snippets create templates create snippets make templates make snippets",
    handler: () => switchNote("snippets"),
  },
  {
    name: "Practice flashcards",
    searchTerm: "quizlet open flashcards",
    handler: () => showFlashcards(true, [note.name]),
  },
  {
    name: "Insert scratch pad content",
    searchTerm:
      "import sticky note content import scratch pad content import scratchpad content insert scratchpad content insert sticky note content",
    handler: insertStickyNote,
  },
  {
    name: "Insert snippet",
    searchTerm: "insert template insert snippets",
    populator: async () => {
      const snippets = await notes_api.get.snippets();
      if (!snippets.ok) {
        return [
          {
            name: tags.statusText,
            info: tags.status,
          },
        ];
      }
      const json = await snippets.json();
      return json.data.map((e) => ({
        name: getTitle(e),
        handler: () => insertTemplate(e),
      }));
    },
  },
  {
    name: "Toggle vim mode",
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
    name: "Change theme",
    searchTerm: "dark light color scheme set theme",
    children: themes.map((e) => ({
      name: e.name
        .split("_")
        .map((e) => e.substring(0, 1).toUpperCase() + e.substring(1))
        .join(" "),
      searchTerm: e.theme_type,
      handler: () => changeTheme(e.name),
    })),
  },
  {
    name: "Switch view",
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
    name: "Toggle wikipedia search",
    handler: toggleWikiSearch,
  },
  {
    name: "Toggle list",
    searchTerm: "hide tree list show tree list",
    handler: toggleList,
  },
  {
    name: "Enable auto save",
    searchTerm: "autosave",
    handler: enableAutosave,
  },
  {
    name: "Disable auto save",
    searchTerm: "autosave",
    handler: disableAutosave,
  },
].sort((a, b) => a.name.localeCompare(b.name));
