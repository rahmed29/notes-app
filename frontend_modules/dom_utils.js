import { border, mainContainer } from "./important_stuff/dom_refs.js";

export {
  loading,
  stopLoading,
  eid,
  attemptRemoval,
  appendText,
  getTopMostAncestor,
  alertUser,
  stopAlert,
  setInnerHTML,
};

function alertUser(text) {
  const existingAlert = eid("fcAlert");
  if (existingAlert && existingAlert.innerText === text) {
    return;
  }
  const alert = document.createElement("div");
  alert.id = "fcAlert";
  alert.innerText = text;
  document.body.classList.add("alerted");
  mainContainer.after(alert);
}

function stopAlert() {
  document.body.classList.remove("alerted");
  attemptRemoval([eid("fcAlert")]);
}

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
