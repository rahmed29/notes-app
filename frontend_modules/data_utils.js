export { getWrittenPages, timer, arraysAreEqual, charDifferCount };

function charDifferCount(a, b) {
  let diffChars = 0;
  for (let i = 0, n = Math.max(a.length, b.length); i < n; i++) {
    const page1 = a[i] ? a[i].length : 0;
    const page2 = b[i] ? b[i].length : 0;
    diffChars += Math.abs(page1 - page2);
  }
  return diffChars;
}

function arraysAreEqual(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

// a small function that filters an array with the given logic (or compares to an empty string by default), but won't return an empty array
function getWrittenPages(arr, logic = (str) => str !== "", defaultValue = "") {
  const response = arr.filter((e) => logic(e));
  if (!response.length) {
    response.push(defaultValue);
  }
  return response;
}

var timer = (ms) => new Promise((res) => setTimeout(res, ms));
