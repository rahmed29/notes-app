export { setupEditor, editor };

let editor;
function setupEditor(onchange) {
  editor = ace.edit("editor");
  // editor.setTheme("ace/theme/chrome");
  editor.setOptions({
    maxLines: Infinity,
  });
  editor.on("change", onchange);
  editor.renderer.setShowGutter(false);
  editor.commands.bindKey("F1", null);
  editor.commands.bindKey("ctrl+,", null);
  editor.commands.bindKey("ctrl+/", null);
  editor.commands.bindKey("ctrl+l", null);
  editor.commands.bindKey("ctrl+e", null);
  editor.setOption("showPrintMargin", false);
}
