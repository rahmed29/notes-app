export { formatHDate, formatHTime };

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
