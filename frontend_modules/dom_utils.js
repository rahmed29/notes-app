import { mainContainer } from "../main";

export { loading, stopLoading, attemptRemoval, eid }

function eid(id) {
  return document.getElementById(id)
}

function attemptRemoval(eles) {
  eles.forEach((ele) => {
    try {
      ele.remove();
    } catch (err) {}
  })
}

window.attemptRemoval = attemptRemoval

function loading() {
  const loadingScreen = document.createElement("div");
  mainContainer.style.pointerEvents = "none";
  loadingScreen.id = "loading";
  loadingScreen.style.opacity = ".9";
  loadingScreen.innerHTML =
    '<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  mainContainer.after(loadingScreen);
}

function stopLoading() {
  attemptRemoval(eid("loading"))
  mainContainer.style.pointerEvents = "inherit";
}
