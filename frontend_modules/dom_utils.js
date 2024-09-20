import { border, mainContainer } from "./important_stuff/dom_refs.js";
import { currTheme } from "./theming.js";

export {
  loading,
  stopLoading,
  eid,
  attemptRemoval,
  appendText,
  getTopMostAncestor,
  alertUser,
  stopAlert,
  editAlert,
  setInnerHTML,
};

let alerts = [];

function maintainAlerts() {
  if (alerts.length === 0) {
    document.body.classList.remove("alerted");
    attemptRemoval([eid("fcAlert")]);
    return;
  }
  const topAlert = alerts.slice(-1)[0];
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

function editAlert(id, text, color = currTheme ? currTheme.destructive : "red") {
  const alert = alerts.find((alert) => alert.id === id);
  if (!alert) {
    return;
  } else {
    alert.text = text;
    alert.color = color;
  }
  maintainAlerts();
}

function alertUser(id, text, color = currTheme ? currTheme.destructive : "red") {
  if (alerts.find((alert) => alert.id === id)) {
    return;
  }
  alerts.push({ id, text, color });
  maintainAlerts();
}

window.alertUser = alertUser;

function stopAlert(id) {
  if (id) {
    alerts = alerts.filter((alert) => alert.id !== id);
  } else {
    alerts.pop();
  }
  maintainAlerts();
}

window.stopAlert = stopAlert;

function getTopMostAncestor(node) {
  while (
    node &&
    node.parentNode &&
    node.parentNode !== document &&
    node.parentNode.tagName !== "HTML" &&
    node.parentNode.tagName !== "BODY"
  ) {
    node = node.parentNode;
  }
  return node;
}

var setInnerHTML = (ele, html) => (ele.innerHTML = DOMPurify.sanitize(html));

var appendText = (ele, text, relativeFontSize = 0.75) =>
  setInnerHTML(
    ele,
    ele.innerHTML +
      `<span style = 'font-size: ${relativeFontSize}em'>&nbsp;&nbsp;${text}</span`
  );

var eid = (id) => document.getElementById(id);

var loading = () => border.classList.add("shine-effect");

var stopLoading = () => border.classList.remove("shine-effect");

function attemptRemoval(eles) {
  if (!Array.isArray(eles)) {
    eles = [eles];
  }
  eles.forEach((ele) => {
    try {
      ele.remove();
    } catch (err) {}
  });
}
