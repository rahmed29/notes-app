import { editingModeTippy } from "./important_stuff/tooltips";
import {
  mode,
  notesAreaContainer,
  notesPreviewArea,
  notesTextArea,
} from "./important_stuff/dom_refs";
import { note } from "./data/note";
import { editor } from "./important_stuff/editor";

export { cycleViewPreferences, editingWindow };

// 'Editing window'
function cycleViewPreferences() {
  let viewPref = localStorage.getItem("/viewPref");
  switch (viewPref) {
    case "split":
      localStorage.setItem("/viewPref", "write");
      break;
    case "write":
      localStorage.setItem("/viewPref", "read");
      break;
    default:
      localStorage.setItem("/viewPref", "split");
      break;
  }
  editingWindow(localStorage.getItem("/viewPref"));
}

function editingWindow(choice) {
  switch (choice) {
    case "read":
      mode.innerText = "R";
      editor.setReadOnly(true);
      notesAreaContainer.classList.add("readMode");
      notesAreaContainer.classList.remove("writeMode");
      notesAreaContainer.classList.remove("splitMode");
      localStorage.setItem("/viewPref", "read");
      break;
    case "write":
      mode.innerText = "W";
      editor.setReadOnly(note.readOnly);
      notesAreaContainer.classList.remove("readMode");
      notesAreaContainer.classList.add("writeMode");
      notesAreaContainer.classList.remove("splitMode");
      localStorage.setItem("/viewPref", "write");
      break;
    default:
      mode.innerText = "S";
      editor.setReadOnly(note.readOnly);
      notesAreaContainer.classList.remove("readMode");
      notesAreaContainer.classList.remove("writeMode");
      notesAreaContainer.classList.add("splitMode");
      localStorage.setItem("/viewPref", "split");
  }
  notesPreviewArea.scrollTop = 0;
  notesTextArea.scrollTop = 0;
  editor.focus();
  editingModeTippy.setContent(`View Mode: ${choice}`);
}
