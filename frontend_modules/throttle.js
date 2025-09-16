export { sizeDetails, isRendering, setSizeDetails, rendering };

// Size details tells us if the note is large and how large it is
let sizeDetails = [false, 0];
let isRendering = false;

function setSizeDetails(large, size) {
  sizeDetails = [large, size];
}

function rendering(cond) {
  isRendering = cond;
}
