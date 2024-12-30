import { eid } from "./dom_utils";
import { changeSettings } from "./important_stuff/settings";

export {
  enableAutosave,
  disableAutosave,
  toggleAutosave,
  saving,
  autosavingEnabled,
  isAutoSaving,
  noteBeingAutoSaved,
};

let noteBeingAutoSaved = undefined;
// live bindings allow for these booleans to be read accurately from other modules
// I could have it so that instead of checking against `autosavingEnabled`, we just check against `getSetting("autosave", true)`
// Same thing with `currTheme` in `theming.js`
// idk which is better probably not what im doing now but im too lazy to change it now
let autosavingEnabled = false;
let isAutoSaving = false;

function enableAutosave() {
  autosavingEnabled = true;
  changeSettings("autosave", true);
  eid("autoSaveSpinner").style.display = "inline-block";
}

function disableAutosave() {
  autosavingEnabled = false;
  changeSettings("autosave", false);
  eid("autoSaveSpinner").style.display = "none";
}

function toggleAutosave() {
  if (autosavingEnabled) {
    disableAutosave();
  } else {
    enableAutosave();
  }
}

function saving(cond, name) {
  isAutoSaving = cond;
  noteBeingAutoSaved = name;
}
