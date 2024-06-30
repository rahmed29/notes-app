import { border } from "../main";

export { loading, stopLoading, eid, attemptRemoval };

function attemptRemoval(eles) {
  eles.forEach((ele) => {
    try {
      ele.remove();
    } catch (err) {}
  });
}

var eid = (id) => document.getElementById(id);

var loading = () => border.classList.add("shine-effect");

var stopLoading = () => border.classList.remove("shine-effect");
