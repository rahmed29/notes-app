
import { showBookDiffPopup } from "./book_diff";
import { createPalette, render_p } from "./cmd";
import { accents } from "./dom_formatting";
import { library, note, switchNote } from "./note_utils";

export { allowSingleRedo, AINotif, showNotifs };

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
        handler: () => {
          showBookDiffPopup(note.content, content)
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
    (results, text) => {
      render_p(
        2,
        notifStack.filter((e) =>
          e.name.toLowerCase().includes(text.toLowerCase())
        ),
        results
      );
    },
    (results) => {
      render_p(2, notifStack, results);
    }
  );
}
