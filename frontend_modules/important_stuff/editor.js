export { setupEditor, editor };

let editor;

let oncursor = [
  {
    name: "scrollDown",
    bindKey: { win: "down", mac: "down" },
    exec: () => {
      document
        .querySelector(".ace_text-input")
        .scrollIntoView({ block: "center" });
      editor.navigateDown(1);
    },
    passEvent: true,
  },
  {
    name: "scrollUp",
    bindKey: { win: "up", mac: "up" },
    exec: () => {
      document
        .querySelector(".ace_text-input")
        .scrollIntoView({ block: "center" });
      editor.navigateUp(1);
    },
    passEvent: true,
  },
];

function setupEditor(onchange) {
  editor = ace.edit("editor");
  // editor.setTheme("ace/theme/chrome");
  editor.setOptions({
    maxLines: Infinity,
  });
  editor.on("change", onchange);
  editor.renderer.setShowGutter(false);
  oncursor.forEach((cmd) => {
    editor.commands.addCommand(cmd);
  });
  editor.commands.bindKey("F1", null);
  editor.commands.bindKey("ctrl+,", null);
  editor.commands.bindKey("ctrl+/", null);
  editor.commands.bindKey("ctrl+l", null);
  editor.commands.bindKey("ctrl+e", null);
  editor.setOption("showPrintMargin", false);
}
