export { formatHDate, formatHTime, hToIsoDate, isIsoDate };

function isIsoDate(str) {
  if (str.includes("T")) {
    // this is datetime, we don't support that
    return false;
  } else {
    // this is date only
    if (!/\d{4}-\d{2}-\d{2}/.test(str)) return false;
  }
  const d = new Date(str);
  return (
    d instanceof Date && !isNaN(d.getTime()) && d.toISOString().startsWith(str)
  ); // valid date
}

// returns an iso string from a human readable date string like "next week" or "sept 3, 2024", etc.
function hToIsoDate(str) {
  if (isIsoDate(str)) {
    return str;
  }
  if (str.trim() === "day after tomorrow" || str.trim() === "day after tmrw") {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  }
  if (
    str.trim() === "tomorrow" ||
    str.trim() === "tmrw" ||
    str.trim() === "in a day"
  ) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }
  if (str.trim() === "today") {
    return new Date().toISOString().split("T")[0];
  }
  if (str.trim() === "in a week" || str.trim() === "next week") {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  }
  if (str.trim() === "in a month" || str.trim() === "next month") {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  }
  if (str.trim() === "in a year" || str.trim() === "next year") {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  }
  if (str.trim() === "yesterday") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }
  if (str.trim().match(/in\s+(\d+)\s+day/)) {
    const d = new Date();
    d.setDate(d.getDate() + parseInt(str.trim().match(/in\s+(\d+)\s+day/)[1]));
    return d.toISOString().split("T")[0];
  }
  if (str.trim().match(/in\s+(\d+)\s+week/)) {
    const d = new Date();
    d.setDate(
      d.getDate() + parseInt(str.trim().match(/in\s+(\d+)\s+week/)[1]) * 7
    );
    return d.toISOString().split("T")[0];
  }
  if (str.trim().match(/in\s+(\d+)\s+month/)) {
    const d = new Date();
    d.setMonth(
      d.getMonth() + parseInt(str.trim().match(/in\s+(\d+)\s+month/)[1])
    );
    return d.toISOString().split("T")[0];
  }
  if (str.trim().match(/in\s+(\d+)\s+year/)) {
    const d = new Date();
    d.setFullYear(
      d.getFullYear() + parseInt(str.trim().match(/in\s+(\d+)\s+year/)[1])
    );
    return d.toISOString().split("T")[0];
  }

  const components = str
    .split(" ")
    .map((e) => e.toLowerCase().replaceAll(",", ""));

  const months = {
    january: [1, 31],
    jan: [1, 31],
    february: [2, 28],
    feb: [2, 28],
    march: [3, 31],
    mar: [3, 31],
    april: [4, 30],
    apr: [4, 30],
    may: [5, 31],
    june: [6, 30],
    july: [7, 31],
    jul: [7, 31],
    august: [8, 31],
    aug: [8, 31],
    september: [9, 30],
    sep: [9, 30],
    sept: [9, 30],
    october: [10, 31],
    oct: [10, 31],
    november: [11, 30],
    nov: [11, 30],
    december: [12, 31],
    dec: [12, 31],
  };

  const month = months[components.find((e) => months[e.toLowerCase().trim()])];
  if (!month) {
    return false;
  }
  const day = components.find((e) => e >= 1 && e <= month[1]) || 1;
  const year =
    components.find((e) => e >= 1000 && e < 9999) || new Date().getFullYear();
  return `${year}-${month[0].toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

function formatHDate(dateStr) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const suffixes = ["th", "st", "nd", "rd"];
  const dateParts = dateStr.split("-");
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1]) - 1];
  const day = parseInt(dateParts[2]);

  let suffix;
  switch (day % 10) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }

  return DOMPurify.sanitize(`${month} ${day}${suffix}, ${year}`);
}

function formatHTime(ms) {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  let response = "";
  switch (true) {
    case hours > 0:
      response += `${Math.floor(hours)}h `;
    case minutes > 0:
      response += `${Math.floor(minutes % 60)}m `;
    case seconds >= 0:
      response += `${Math.floor(seconds % 60)}s`;
  }
  return response;
}
