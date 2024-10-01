export { settings, changeSettings, getSetting };

let settings;

function changeSettings(key, value) {
  if (settings === undefined) {
    settings = JSON.parse(localStorage.getItem("$settings")) || {};
  }
  settings[key] = value;
  localStorage.setItem("$settings", JSON.stringify(settings));
}

function getSetting(key, defaultValue = null) {
  if (settings === undefined) {
    settings = JSON.parse(localStorage.getItem("$settings")) || {};
  }
  if (settings[key] !== undefined) {
    return settings[key];
  } else {
    return defaultValue;
  }
}
