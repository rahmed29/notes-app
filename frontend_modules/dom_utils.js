import { border } from "./important_stuff/dom_refs.js";

export {
  loading,
  stopLoading,
  eid,
  attemptRemoval,
  appendText,
  getTopMostAncestor,
  setInnerHTML,
};

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
      `<span style = 'font-size: ${relativeFontSize}em'>&nbsp;&nbsp;${text}</span`,
  );

var eid = (id) => document.getElementById(id);

var loading = () => border.classList.add("shine-effect");

var stopLoading = () => border.classList.remove("shine-effect");

// attempts to call the `remove` method on each element in the array
// returns an array of elements that were not removed
function attemptRemoval(eles) {
  const nodesNotDeleted = [];
  if (!Array.isArray(eles)) {
    eles = [eles];
  }
  eles.forEach((ele) => {
    try {
      ele.remove();
    } catch (err) {
      nodesNotDeleted.push(ele);
    }
  });
  return nodesNotDeleted;
}
