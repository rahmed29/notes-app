import { loading, stopLoading } from "./dom_utils";
import { switchNote } from "./note_utils";
import { AINotif } from "./palettes/notif_palette";
import { editReserved } from "./data/reserved_notes";
import { note } from "./data/note";
import notes_api from "./important_stuff/api";

export { prompt_ai, AISUmmary, aiGenerating };

let aiGenerating = false;

async function prompt_ai(content, prompt, aiChoice) {
  if (network.isOffline) {
    return;
  }
  // I will handle this case in each individual function that uses this function, however this is failsafe so nothing slips through
  if (note.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return null;
  }
  aiGenerating = true;
  loading();
  const response = await notes_api.post[aiChoice]({
    content,
    prompt,
  })
  aiGenerating = false;
  stopLoading();
  if (response.ok) {
    const json = await response.json();
    return json.data;
  } else {
    return 0;
  }
}

async function AISUmmary(aiChoice = "chatgpt") {
  if (network.isOffline) {
    return;
  }
  if (note.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return;
  }
  const name = note.name;
  const pg = note.pgN + 1;
  const AI = await prompt_ai(
    note.content[note.pgN || 0],
    "Summarize the given content. Surround any tex expressions with dollar signs",
    aiChoice
  );
  if (AI !== 0) {
    editReserved("AI-Summary", [
      `# ✨ AI Summary (:ref[${name}:${pg}])\n\n${AI.replaceAll("<br>", "\n")}`,
    ]);
    AINotif("Summary", name, async () => {
      await switchNote("AI-Summary");
    });
  } else {
    notyf.error("A summary could not be generated");
  }
}
