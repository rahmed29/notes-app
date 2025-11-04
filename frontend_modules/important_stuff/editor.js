export { setupEditor, editor };

let editor;

function setupEditor(onchange) {
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

  const surrounders = ["*", "~", "_", "="];

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
  surrounders.forEach((e) => {
    editor.commands.addCommand({
      name: e,
      bindKey: { win: e, mac: e },
      exec: function (editor) {
        let selectedText = editor.getSelectedText();
        let selectionRange = editor.getSelectionRange();

        if (selectedText) {
          editor.insert(e + selectedText + e);

          let newStart = selectionRange.start;
          let newEnd = editor.getSelectionRange().end;

          editor.getSelection().setRange({
            start: newStart,
            end: newEnd,
          });
        } else {
          editor.insert(e);
        }
      },
    });
  });
}
