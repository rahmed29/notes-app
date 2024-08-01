import { border } from "./important_stuff/dom_refs.js";

export { loading, stopLoading, eid, attemptRemoval, appendText, getTopMostAncestor };

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

var appendText = (ele, text, relativeFontSize = 0.75) =>
  (ele.innerHTML += `<span style = 'font-size: ${relativeFontSize}em'>&nbsp;&nbsp;${text}</span`);

var eid = (id) => document.getElementById(id);

var loading = () => border.classList.add("shine-effect");

var stopLoading = () => border.classList.remove("shine-effect");

function attemptRemoval(eles) {
  eles.forEach((ele) => {
    try {
      ele.remove();
    } catch (err) {}
  });
}
