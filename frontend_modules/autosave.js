import { eid } from "./dom_utils";

export {
  enableAutosave,
  disableAutosave,
  toggleAutosave,
  saving,
  doneSaving,
  autosavingEnabled,
  isSaving,
};

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

function saving() {
  isSaving = true;
}

function doneSaving() {
  isSaving = false;
}
