import { confirmation_cm, contextMenu, delContextMenu } from "./context_menu";
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
            click: () => cmInput(note.name, "open"),
          }
        : {
            props: this.getAttribute("data-bookname"),
            text: "Open Notebook",
            click: (props) => {
              switchNote(props);
              delContextMenu();
            },
          },
      toolBar
        ? null
        : {
            props: this.getAttribute("data-bookname"),
            text: "Open in Background",
            click: (props) => {
              makeTabInDom(props, false);
              delContextMenu();
            },
          },
      toolBar
        ? null
        : {
            props: this.getAttribute("data-bookname"),
            text: "Open & Close Current Tab",
            click: (props) => {
              closeTab(note.name, {
                refresh: true,
                goto: props,
                page: 0,
              });
              delContextMenu();
            },
          },
      { spacer: true },
      {
        props: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Rename Notebook",
        click: (props) => cmInput(props, "rename"),
      },
      {
        props: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Copy Notebook",
        click: (props) => cmInput(props, "copy"),
      },
      toolBar
        ? null
        : {
            props: toolBar ? undefined : this.getAttribute("data-bookname"),
            text: "Delete Notebook",
            click: (props, ele) =>
              confirmation_cm(ele, () =>
                deleteNoteBookFromDb(toolBar ? note.name : props),
              ),
          },
      { spacer: true },
      {
        props: toolBar ? undefined : this.getAttribute("data-bookname"),
        text: "Nest Notebook",
        populator: async (props) => {
          const noteName = toolBar ? note.name : props;
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
        props: toolBar ? "" : this.getAttribute("data-bookname"),
        text: "Relinquish Notebook",
        populator: async function (props) {
          const noteName = toolBar ? note.name : props;
          return (await getAnyBookContent(noteName, "parents")).map(
            (parent) => ({
              text: parent,
              click: () => {
                relinquishNote(noteName, parent);
                delContextMenu();
              },
            }),
          );
        },
      },
      {
        props: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Create Child",
        click: (props) => cmInput(props, "child"),
      },
      { spacer: true },
      {
        props: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Force Update",
        click: (props, ele) =>
          confirmation_cm(ele, () => {
            forceUpdateNotes(props);
          }),
      },
    ],
    toolBar ? [`${e.clientX - 160}px`, "75px"] : null,
  );
}
