import { attemptRemoval, eid } from "./dom_utils";
import { currTheme } from "./theming";

export { alertUser, stopAlert, editAlert };

let alerts = [];

function maintainAlerts() {
  if (alerts.length === 0) {
    document.body.classList.remove("alerted");
    attemptRemoval([eid("fcAlert")]);
    return;
  }
  const topAlert = alerts[alerts.length - 1];
  if (eid("fcAlert")) {
    eid("fcAlert").innerText = topAlert.text;
    eid("fcAlert").style.backgroundColor = topAlert.color;
    return;
  }
  const alert = document.createElement("div");
  alert.id = "fcAlert";
  alert.innerText = topAlert.text;
  alert.style.backgroundColor = topAlert.color;
  document.body.classList.add("alerted");
  mainContainer.after(alert);
}

function editAlert(
  id,
  text,
  color = currTheme ? currTheme.destructive : "red",
) {
  const alert = alerts.find((alert) => alert.id === id);
  if (!alert) {
    return;
  } else {
    alert.text = text;
    alert.color = color;
  }
  maintainAlerts();
}

function alertUser(
  id,
  text,
  color = currTheme ? currTheme.destructive : "red",
) {
  if (alerts.find((alert) => alert.id === id)) {
    return;
  }
  alerts.push({ id, text, color });
  maintainAlerts();
}

function stopAlert(id) {
  if (id) {
    alerts = alerts.filter((alert) => alert.id !== id);
  } else {
    alerts.pop();
  }
  maintainAlerts();
}
