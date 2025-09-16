import { updateLtdArr } from "./data_utils";
import notes_api from "./important_stuff/api";
import { changeSettings, getSetting } from "./important_stuff/settings";
import { editTabText } from "./tabs";

export { getTags, setOpenTag };

let openTag = undefined;

function setOpenTag(tag) {
  openTag = tag;
}

async function getTags(tag) {
  if (!tag && !openTag) {
    return "# 🏷️ Tag Viewer\n\n---\n\n";
  }
  if (tag) {
    changeSettings(
      "recents_tags",
      updateLtdArr(getSetting("recents_tags", []), tag),
    );
  }
  editTabText("Tag-Viewer", `Tag: #${tag || openTag}`, true);
  let content = `# 🏷️ Tag Viewer\n\n---\n\n:tag[${tag || openTag || ""}]\n\n`;
  const tags = await notes_api.get.tagged(tag || openTag);
  if (!tags.ok) {
    content += "An error occurred when retrieving tags.";
    return content;
  }
  const json = await tags.json();
  const list = json.data.map((e) => `- :ref[${e.name}:${e.page}]`);
  content += list.join("\n");
  if (tag) {
    openTag = tag;
  }
  return content;
}
