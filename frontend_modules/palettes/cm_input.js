import { delContextMenu } from "../context_menu";
import { copyBook, createChild } from "../hierarchy";
import { renameNote, switchNote } from "../note_utils";
import { createPalette } from "./cmd";

export { cmInput };

function cmInput(noteName, choice) {
  const choices = {
    open: "Enter a book name",
    child: "Enter a name for the child",
    copy: "Enter a name for the copy",
    rename: "Enter a new name",
  };
  createPalette(
    choices[choice],
    (results, text, render) => {
      render(
        2,
        [
          {
            name: text,
            icon: "📖",
            handler: () => {
              switch (choice) {
                case "open":
                  switchNote(text);
                  break;
                case "child":
                  createChild(noteName, text);
                  break;
                case "copy":
                  copyBook(text, noteName);
                  break;
                case "rename":
                  renameNote(noteName, text);
                  break;
              }
            },
          },
        ],
        results,
      );
    },
    null,
    false,
  );
  delContextMenu();
}
