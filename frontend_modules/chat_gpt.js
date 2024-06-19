import { reservedNames, note, switchNote } from "./note_utils";
import { updateAndSaveNotesLocally } from "./dom_formatting";
import { loading, stopLoading } from "./dom_utils";

export { chatGPT, AISUmmary };

async function chatGPT(content, prompt) {
  if (note.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return null;
  }
  loading();
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
  stopLoading();
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
  const AI =
    (await chatGPT(note.content[note.pgN], "TLDR:")) || `An error occurred.`;
  reservedNames.find((e) => e.data.name === "AI-Summary").data.content = [
    `# ✨ AI Summary (:ref[${name}] - pg. ${pg})\n\n${AI.replaceAll(
      "<br>",
      "\n"
    )}`,
  ];
  await switchNote("AI-Summary");
  updateAndSaveNotesLocally();
}
