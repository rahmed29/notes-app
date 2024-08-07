export { setupEditor, editor };

let editor = null;
function setupEditor() {
  editor = ace.edit("editor");
  // editor.setTheme("ace/theme/chrome");
  editor.setOptions({
    maxLines: Infinity,
  });
  editor.renderer.setShowGutter(false);
  // disable ace editor command palette
  editor.commands.bindKey("F1", null);
  // editor.commands.bindKey("ctrl+f", null);
  editor.commands.bindKey("ctrl+,", null);
  editor.setOption("showPrintMargin", false);
}
