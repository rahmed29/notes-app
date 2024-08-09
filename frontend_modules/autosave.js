import { eid } from "./dom_utils";

export {
  enableAutosave,
  disableAutosave,
  toggleAutosave,
  saving,
  doneSaving,
  autosavingEnabled,
  isSaving,
  noteBeingAutoSaved,
};

let noteBeingAutoSaved = null;
let autosavingEnabled = null;
let isSaving = false;

function enableAutosave() {
  autosavingEnabled = true;
  localStorage.setItem("/autosave", "true");
  eid("autoSaveSpinner").style.display = "inline-block";
}

function disableAutosave() {
  autosavingEnabled = false;
  localStorage.setItem("/autosave", "false");
  eid("autoSaveSpinner").style.display = "none";
}

function toggleAutosave() {
  if (autosavingEnabled) {
    disableAutosave();
  } else {
    enableAutosave();
  }
}

function saving(name) {
  isSaving = true;
  noteBeingAutoSaved = name;
}

function doneSaving() {
  isSaving = false;
  noteBeingAutoSaved = null;
}
