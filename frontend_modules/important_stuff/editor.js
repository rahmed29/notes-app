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
        var selectedText = editor.getSelectedText();
        var selectionRange = editor.getSelectionRange();

        if (selectedText) {
          // Surround the selected text with asterisks
          editor.insert(e + selectedText + e);

          // Calculate the new range (including the inserted asterisks)
          var newStart = selectionRange.start;
          var newEnd = editor.getSelectionRange().end;

          // Set the selection to include both the asterisks and the selected text
          editor.getSelection().setRange({
            start: newStart,
            end: newEnd,
          });
        } else {
          // Insert a single asterisk if no text is selected
          editor.insert(e);
        }
      },
    });
  });
}
