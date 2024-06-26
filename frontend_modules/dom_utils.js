import { border } from "../main";

export { loading, stopLoading, eid, attemptRemoval };

function eid(id) {
  return document.getElementById(id);
}

function attemptRemoval(eles) {
  eles.forEach((ele) => {
    try {
      ele.remove();
    } catch (err) {}
  });
}
function loading() {
 border.classList.add("shine-effect")
}

function stopLoading() {
  border.classList.remove("shine-effect")
}
