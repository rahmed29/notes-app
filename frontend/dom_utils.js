import { mainContainer } from "../main";

export { loading, stopLoading }

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
  try {
    document.getElementById("loading").remove();
  } catch (err) {}
  mainContainer.style.pointerEvents = "inherit";
}
