import { accents } from "./dom_formatting";
import { switchNote, library } from "./note_utils";
import { undoButton, undoTip } from "../main";

export { allowSingleRedo };

let timeoutID = 0;
let lastUndo = () => {};

function allowSingleRedo(noteName, { content, aceSessions} ) {
  clearTimeout(timeoutID);
  undoButton.classList.add("gone");
  undoButton.removeEventListener("click", lastUndo);
  undoButton.classList.add("gone");
  undoButton.removeEventListener("click", undo);
  var undo = async (e) => {
    await switchNote(noteName);
    (library.get(noteName).content = content),
      (library.get(noteName).aceSessions =aceSessions);
    undoButton.classList.add("gone");
    accents();
  };
  undoButton.classList.remove("gone");
  timeoutID = setTimeout(() => {
    undoButton.classList.add("gone");
    undoButton.removeEventListener("click", undo);
  }, 10000);
  undoButton.addEventListener("click", undo, { once: true });
  undoTip.setContent(`Undo Recent Major Change to: ${noteName}`)
  lastUndo = undo;
}
