
import { showBookDiffPopup } from "../popups/book_diff";
import { createPalette } from "./cmd";
import { accents } from "../dom_formatting";
import { getAnyBookContent, library, switchNote } from "../note_utils";

export { allowSingleRedo, youDeleted, AINotif, showNotifs };

let notifStack = [];


function appendNotif(object) {
  notifStack.unshift(object)
  // maximum number of notifications
  if (notifStack.length > 10) {
    notifStack.pop();
  }
}

function AINotif(choice, name, handler) {
  notyf.success(`AI ${choice} available in your notification palette`)
  const id = Date.now();
  appendNotif({
    name: `${name} - AI ${choice} from ${new Date().toLocaleTimeString()} available`,
    icon: "✨",
    id,
    children: [
      {
        name: `View ${choice}`,
        icon: "?",
        handler,
      },
      {
        name: "Clear Notification",
        icon: "?",
        handler: () => {
          notifStack = notifStack.filter((e) => e.id !== id);
        },
      },
    ],
  });
}

function youDeleted(noteName) {
  if (!localStorage.getItem(noteName)) {
    return;
  }
  const id = Date.now();
  appendNotif({
    name: `${noteName} - Book was deleted at ${new Date().toLocaleTimeString()} but is still available in local storage`,
    icon: "💡",
    id,
    children: [
      {
        name: "View Notebook",
        icon: "?",
        handler: async () => {
          await switchNote(noteName);
        },
      },
      {
        name: "Clear Notification",
        icon: "?",
        handler: () => {
          notifStack = notifStack.filter((e) => e.id !== id);
        },
      },
    ],
  });
}

function allowSingleRedo(noteName, { content, aceSessions }) {
  const id = Date.now();
  appendNotif({
    name: `${noteName} - A state from ${new Date().toLocaleTimeString()} is available to recover`,
    icon: "&#8617;",
    id,
    children: [
      {
        name: "Restore State",
        icon: "?",
        handler: async () => {
          await switchNote(noteName);
          (library.get(noteName).content = content),
            (library.get(noteName).aceSessions = aceSessions);
          accents();
        },
      },
      {
        name: "Compare to Current State",
        icon: "?",
        handler: async () => {
          showBookDiffPopup((await getAnyBookContent(noteName, "content")) || [""], content)
        },
      },
      {
        name: "Clear Notification",
        icon: "?",
        handler: () => {
          notifStack = notifStack.filter((e) => e.id !== id);
        },
      },
    ],
  });
}

function showNotifs() {
  createPalette(
    "Search notifications...",
    (results, text, render, filter) => {
      render(
        2,
        filter(notifStack, text),
        results
      );
    },
    (results, render) => {
      render(2, notifStack, results);
    }
  );
}
