import { reservedNames, note, switchNote } from "./note_utils";
import { updateAndSaveNotesLocally } from "./dom_formatting";
import { mainContainer } from "../main";

export { chatGPT, AISUmmary, loading, stopLoading };

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

async function chatGPT(content, prompt) {
  if (note.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return null;
  }
  const response = await fetch("/api/chatGPT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      prompt,
    }),
  });
  if (response.ok) {
    const json = await response.json();
    return json.data;
  } else {
    return null;
  }
}

async function AISUmmary() {
  const name = note.name;
  const pg = note.pgN + 1;
  loading();
  const AI =
    (await chatGPT(note.content[note.pgN], "TLDR:")) || `An error occurred.`;
  reservedNames.find((e) => e.data.name === "AI-Summary").data.content = [
    `# ✨ AI Summary (:ref[${name}] - pg. ${pg})\n\n${AI.replaceAll(
      "<br>",
      "\n"
    )}`,
  ];
  stopLoading();
  await switchNote("AI-Summary");
  updateAndSaveNotesLocally();
}
