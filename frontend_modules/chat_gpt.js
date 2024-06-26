import { loading, stopLoading } from "./dom_utils";
import { note, switchNote, editReserved } from "./note_utils";
import { AINotif } from "./notif_palette";
import { ollama } from "./ollama";

export { chatGPT, AISUmmary };

async function chatGPT(content, prompt) {
  // I will handle this case in each individual function that uses this function, however this is failsafe so nothing slips through
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

async function AISUmmary(aiChoice=0) {
  if (note.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return;
  }
  const name = note.name;
  const pg = note.pgN + 1;
  const AI = aiChoice === 0 ? (await chatGPT(note.content[note.pgN], "TLDR:")) || "An error occurred." : (await ollama(note.content[note.pgN], "TLDR: ") || "An error occurred.");
  editReserved("AI-Summary", [
    `# ✨ AI Summary (:ref[${name}] - pg. ${pg})\n\n${AI.replaceAll(
      "<br>",
      "\n"
    )}`,
  ]);
  AINotif("Summary", name, async () => {
    await switchNote("AI-Summary");
  });
}
