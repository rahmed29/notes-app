export {
  getWrittenPages,
  arraysAreEqual,
  charDifferCount,
  properLink,
  throttle,
  fakeEvent,
  nth,
  delay,
  updateLtdArr,
};

function updateLtdArr(arr, item, max = 10) {
  arr = arr.filter((e) => e !== item);
  arr.unshift(item);
  if (arr.length > max) {
    arr.pop();
  }
  return arr;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nth(num) {
  num = parseInt(num);
  switch (num) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${num}th`;
  }
}

function fakeEvent(ele) {
  return {
    preventDefault: () => {},
    stopPropagation: () => {},
    target: ele,
    clientX: 0,
    clientY: 0,
  };
}

function throttle(
  {
    delay = 300,
    condition = false,
    beforeTimeout = () => {},
    callback = () => {},
    afterTimeout = () => {},
    fallbackCondition = false,
    fallback = () => {},
  } = {
    delay: 300,
    condition: false,
    beforeTimeout: () => {},
    callback: () => {},
    afterTimeout: () => {},
    fallbackCondition: false,
    fallback: () => {},
  },
) {
  if (condition) {
    beforeTimeout();
    setTimeout(() => {
      callback();
      afterTimeout();
    }, delay);
  } else if (fallbackCondition) {
    fallback();
  }
}

function properLink(link) {
  return link.split(".").pop() === "pdf" ? "[{{^}}]" : "![{{^}}]";
}

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
