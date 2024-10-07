import {
  confirmation_cm,
  contextMenu,
  delContextMenu,
} from "./context_menu";
import {
  deleteNoteBookFromDb,
  forceUpdateNotes,
  switchNote,
} from "./note_utils";
import { closeTab, makeTabInDom } from "./tabs";
import { cmInput } from "./palettes/cm_input";
import { getFamily, nestNote, relinquishNote } from "./hierarchy";
import { listInMemory } from "./data/list";
import { note } from "./data/note";
import getAnyBookContent from "./get_book_content";

// this is messy
export function listContextMenu(e, toolBar) {
  contextMenu(
    e,
    [
      toolBar
        ? {
            text: "Open Notebook",
            click: function () {
              cmInput(note.name, "open");
            },
          }
        : {
            attr: this.getAttribute("data-bookname"),
            text: "Open Notebook",
            click: function () {
              switchNote(this.getAttribute("data-props"));
              delContextMenu();
            },
          },
      toolBar
        ? null
        : {
            attr: this.getAttribute("data-bookname"),
            text: "Open in Background",
            click: function () {
              makeTabInDom(this.getAttribute("data-props"), false);
              delContextMenu();
            },
          },
      toolBar
        ? null
        : {
            attr: this.getAttribute("data-bookname"),
            text: "Open & Close Current Tab",
            click: function () {
              closeTab(note.name, {
                refresh: true,
                goto: this.getAttribute("data-props"),
                page: 0,
              });
              delContextMenu();
            },
          },
      { spacer: true },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Rename Notebook",
        click: function () {
          cmInput(this.getAttribute("data-props"), "rename");
        },
      },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Copy Notebook",
        click: function () {
          cmInput(this.getAttribute("data-props"), "copy");
        },
      },
      toolBar
        ? null
        : {
            attr: toolBar ? "" : this.getAttribute("data-bookname"),
            text: "Delete Notebook",
            click: function () {
              confirmation_cm(this, () =>
                deleteNoteBookFromDb(
                  toolBar ? note.name : this.getAttribute("data-props")
                )
              );
            },
          },
      { spacer: true },
      {
        attr: toolBar ? "" : this.getAttribute("data-bookname"),
        text: "Nest Notebook",
        populator: async function (e) {
          const noteName = toolBar
            ? note.name
            : this.getAttribute("data-props");
          const family = await getFamily(noteName);
          return listInMemory.reduce((arr, e) => {
            if (e.name !== noteName && !family.includes(e.name)) {
              arr.push({
                text: e.name,
                click: () => {
                  nestNote(noteName, e.name);
                  delContextMenu();
                },
              });
            }
            return arr;
          }, []);
        },
      },
      {
        attr: toolBar ? "" : this.getAttribute("data-bookname"),
        text: "Relinquish Notebook",
        populator: async function () {
          const noteName = toolBar
            ? note.name
            : this.getAttribute("data-props");
          return (await getAnyBookContent(noteName, "parents")).map(
            (parent) => {
              return {
                text: parent,
                click: () => {
                  relinquishNote(noteName, parent);
                  delContextMenu();
                },
              };
            }
          );
        },
      },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Create Child",
        click: function () {
          cmInput(this.getAttribute("data-props"), "child");
        },
      },
      { spacer: true },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Force Update",
        click: function () {
          confirmation_cm(this, () => {
            forceUpdateNotes(this.getAttribute("data-props"));
          });
        },
      },
    ],
    toolBar ? [`${e.clientX - 160}px`, "75px"] : null
  );
}
