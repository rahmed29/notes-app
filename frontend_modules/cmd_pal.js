import themes from "./themes/index.js";
import {
  note,
  deleteNoteBookFromDb,
  deletePage,
  forceUpdateNotes,
  switchNote,
  saveNoteBookToDb,
  getAnyBookContent,
} from "./note_utils.js";
import { removeMD } from "./text_formatting.js";
import { getFamily, nestNote, relinquishNote } from "./hierarchy.js";
import { getList, toggleList } from "./list_utils.js";
import { changeTheme } from "./theming.js";
import { jumpToDesiredPage } from "./dom_formatting.js";
import { AISUmmary } from "./chat_gpt.js";
import { toggleWikiSearch } from "./wikipedia.js";
import { editingWindow } from "./editing_window.js";
import { editor } from "../main.js";
import { showTodo } from "./calendar.js";
import { insertStickyNote } from "./sticky_note.js";
import { showBookDiffPopup } from "./book_diff.js";
import { flashcardMode, showFlashcards } from "./flashcards.js";
import { createPalette, closePalette } from "./new_cmd.js";

export { showPal, defineCmd };

let commands;

function showPal() {
  function render(arr, results) {
    while (results.firstChild) {
      results.firstChild.remove();
    }
    arr.forEach((cmd) => {
      const item = document.createElement("div");
      if (cmd.children) {
        item.addEventListener("click", () => {
          createPalette(
            "Search for commands...",
            (results, text) => {
              render(cmd.children.filter((e) => e.name.toLowerCase().includes(text.toLowerCase())), results)
            },
            (results, text) => {
              render(cmd.children, results)
            }
          );
        })
      } else {
        item.addEventListener("click", () => {
          cmd.handler();
          closePalette();
        })
      }
      item.classList.add("item");
      item.innerText = cmd.name;
      results.appendChild(item);
    });
  }

  createPalette(
    "Search for commands...",
    (results, text) => {
      render(commands.filter((e) => e.name.toLowerCase().includes(text.toLowerCase())), results)
    },
    (results, text) => {
      render(commands, results)
    }
  );
}

// Re-Instantiate the command palette
async function defineCmd() {
  const cmdPgs = note.content.map((e, i) => {
    return {
      name: `${removeMD(e.split("\n")[0])}`,
      handler: () => jumpToDesiredPage(i),
    };
  });

  const family = await getFamily(note.name);
  const json = await getList();
  const cmdList = json.map((e) => ({
    name: `${e.name}`,
    handler: () => switchNote(e.name),
  }));

  const cmdNest = json.reduce((arr, e) => {
    if (e.name !== note.name && !family.includes(e.name)) {
      arr.push({
        name: `${e.name}`,
        handler: () => nestNote(note.name, e.name),
      });
    }
    return arr;
  }, []);

  const cmdRel = (await getAnyBookContent(note.name, "parents")).map(
    (parent) => ({
      name: `${parent}`,
      handler: () => relinquishNote(note.name, parent),
    })
  );

  commands = [
    {
      name: "New Page",
      handler: () => jumpToDesiredPage(note.content.length),
    },
    {
      name: "Go to Page",
      children: cmdPgs,
    },
    {
      name: "Open Notebook",
      children: cmdList,
    },
    {
      name: "Save Notebook",
      handler: () => saveNoteBookToDb(note.name),
    },
    {
      name: "Insert Image",
      handler: () => document.getElementById("getFile1").click(),
    },
    {
      name: "Nest Notebook",
      children: cmdNest,
    },
    {
      name: "Relinquish Notebook",
      children: cmdRel,
    },
    {
      name: "Compare Local Notes to DB",
      handler: showBookDiffPopup,
    },
    {
      name: "AI Summary",
      handler: AISUmmary,
    },
    {
      name: "Create Flashcards",
      handler: flashcardMode,
    },
    {
      name: "Delete This Page",
      children: [
        {
          name: "Confirm",
          handler: deletePage,
        },
      ],
    },
    {
      name: "Delete Notebook",
      children: [
        {
          name: "Confirm",
          handler: () => deleteNoteBookFromDb(note.name),
        },
      ],
    },
    {
      name: "Force Update Notebook",
      children: [
        {
          name: "Confirm",
          handler: forceUpdateNotes,
        },
      ],
    },
    {
      name: "Practice Flashcards",
      handler: showFlashcards,
    },
    {
      name: "Open Calendar",
      handler: () => showTodo(false),
    },
    // {
    //   name: "Open Sticky Note",
    //   handler: showStickyNotes,
    // },
    {
      name: "Import Sticky Note",
      handler: insertStickyNote,
    },
    {
      name: "Insert Calendar Event",
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
      children: themes.map((e) => {
        return {
          name: e.name
            .split("_")
            .map((e) => e.slice(0, 1).toUpperCase() + e.slice(1))
            .join(" "),
          handler: () => changeTheme(e.name),
        };
      }),
    },
    {
      name: "Switch View",
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
      handler: toggleList,
    },
  ];
}
