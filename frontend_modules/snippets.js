import { note } from "./data/note";
import { reserved } from "./data/reserved_notes";
import { delay, nth } from "./data_utils";
import { stickyNotesTextArea } from "./important_stuff/dom_refs";
import { editor } from "./important_stuff/editor";

export { insertSnippet, insertStickyNote, insertTemplate };

function insertStickyNote() {
  insertSnippet(stickyNotesTextArea.value);
}

function insertTemplate(snippet) {
  snippet = snippet.split("\n");
  if (snippet[0] && snippet[0].substring(0, 3) === "// ") {
    snippet.shift();
  }
  while (snippet[0] !== undefined && snippet[0] === "") {
    snippet.shift();
  }
  snippet = snippet.join("\n");
  let rowColumn = [0, 0];
  snippet = snippet
    .replaceAll("{{page}}", note.pgN + 1)
    .replaceAll("{{pg}", note.pgN + 1)
    .replaceAll("{{title}}", note.name)
    .replaceAll("{{today}}", new Date().toLocaleDateString())
    .replaceAll("{{pagenth}}", note.pgN + 1)
    .replaceAll("{{pgnth}}", nth(note.pgN + 1));
  snippet = snippet
    .split("\n")
    .map((e, i) => {
      if (e.includes("{{^}}")) {
        rowColumn = [i + 1, e.indexOf("{{^}}")];
        return e.replaceAll("{{^}}", "");
      }
      return e;
    })
    .join("\n");
  insertSnippet(snippet, rowColumn);
}

async function insertSnippet(snippet, rowColumn) {
  if (!reserved(note.name)) {
    const { row, column } = editor.getCursorPosition()
    editor.insert(snippet);
    editor.focus();
    if (rowColumn && rowColumn.length === 2) {
      editor.gotoLine(rowColumn[0] + row, rowColumn[1] + column);
    }
  } else {
    notyf.error("This notebook is read only");
  }
}
