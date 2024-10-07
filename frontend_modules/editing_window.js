import { editingModeTippy } from "./important_stuff/tooltips";
import {
  mode,
  notesAreaContainer,
  notesPreviewArea,
  notesTextArea,
} from "./important_stuff/dom_refs";
import { note } from "./data/note";
import { editor } from "./important_stuff/editor";
import { changeSettings, getSetting } from "./important_stuff/settings";

export { cycleViewPreferences, editingWindow };

function cycleViewPreferences() {
  let viewPref = getSetting("viewPref");
  switch (viewPref) {
    case "split":
      changeSettings("viewPref", "write");
      break;
    case "write":
      changeSettings("viewPref", "read");
      break;
    default:
      changeSettings("viewPref", "split");
      break;
  }
  editingWindow(getSetting("viewPref"));
}

function editingWindow(choice) {
  switch (choice) {
    case "read":
      mode.innerText = "R";
      editor.setReadOnly(true);
      notesAreaContainer.classList.add("readMode");
      notesAreaContainer.classList.remove("writeMode");
      notesAreaContainer.classList.remove("splitMode");
      changeSettings("viewPref", "read");
      break;
    case "write":
      mode.innerText = "W";
      editor.setReadOnly(note.readOnly);
      notesAreaContainer.classList.remove("readMode");
      notesAreaContainer.classList.add("writeMode");
      notesAreaContainer.classList.remove("splitMode");
      changeSettings("viewPref", "write");
      break;
    default:
      mode.innerText = "S";
      editor.setReadOnly(note.readOnly);
      notesAreaContainer.classList.remove("readMode");
      notesAreaContainer.classList.remove("writeMode");
      notesAreaContainer.classList.add("splitMode");
      changeSettings("viewPref", "split");
  }
  notesPreviewArea.scrollTop = 0;
  notesTextArea.scrollTop = 0;
  editor.focus();
  editingModeTippy.setContent(`View Mode: ${choice}`);
}
