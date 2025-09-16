export {
  setGlobalPaletteClose,
  setGlobalPopupClose,
  globalPaletteClose,
  globalPopupClose,
};

// Palette and popup both depend on each other's functions (closePopupWindow and closePalette), because we don't want the palette and the popup open at the same time, so they should close each other.
// Here we create a Mediator Module where we define placeholders for these functions.
// In palette and popup modules we import these placeholders
// In the main module, we import closePopupWindow and closePalette functions from the palette and popup modules and pass them to the Mediator Module
let globalPaletteClose;
let globalPopupClose;

function setGlobalPaletteClose(close) {
  globalPaletteClose = close;
}

function setGlobalPopupClose(close) {
  globalPopupClose = close;
}
