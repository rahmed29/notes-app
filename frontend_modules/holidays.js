const specialDates = [
  {
    name: "Christmas",
    date: "12-25",
    confetti: ["🎄", "🎅", "❄️", "⛄", "🎁", "🌟"],
  },
  {
    name: "Halloween",
    date: "10-31",
    confetti: ["🎃", "👻", "🕸️", "🕷️", "🧛‍♂️", "🧙‍♀️"],
  },
  {
    name: "New Year's Day",
    date: "1-1",
    confetti: ["🎆", "🎇", "🥂", "🍾", "🕛", "🎉", "✨", "🎊"],
  },
  {
    name: "Thanksgiving",
    date: function () {
      // Thanksgiving (fourth Thursday in November)
      const today = new Date();
      const month = today.getMonth();
      const day = today.getDate();
      const year = today.getFullYear();

      const firstDayOfMonth = new Date(year, 10, 1); // November 1st
      const firstThursday =
        firstDayOfMonth.getDate() + ((7 - firstDayOfMonth.getDay()) % 7); // First Thursday of November
      const fourthThursday = firstThursday + 21; // Fourth Thursday

      return month === 10 && day >= fourthThursday && day <= fourthThursday + 6;
    },
    confetti: ["🦃", "🍂", "🍁", "🍗", "🥧", "🍽️"],
  },
  {
    name: "Valentine's Day",
    date: "2-14",
    confetti: ["❤️", "💌", "🌹", "💘", "🥰", "💋"],
  },
  {
    name: "Easter",
    date: "4-4",
    confetti: ["🐰", "🥚", "🌸", "🐣", "🌷", "🥕"],
  },
  {
    name: "St. Patrick's Day",
    date: "3-17",
    confetti: ["🍀", "☘️", "🍻", "🌈", "🍀", "🎩"],
  },
  {
    name: "Independence Day",
    date: "7-4",
    confetti: ["🎆", "🎇", "🔥", "🍔", "🌭"],
  },
  {
    name: "Mother's Day",
    date: "5-14",
    confetti: ["💐", "👩‍👧‍👦", "❤️", "🌸", "🥰"],
  },
  {
    name: "Father's Day",
    date: "6-18",
    confetti: ["👨‍👧‍👦", "🧔", "🍻", "🎣", "⚽"],
  },
  {
    name: "Labor Day",
    date: "9-1",
    confetti: ["💼", "🔨", "⚒️", "🛠️", "🏖️"],
  },
  {
    name: "Veterans Day",
    date: "11-11",
    confetti: ["🎖️", "🎖", "🦅"],
  },
  {
    name: "April Fools' Day",
    date: "4-1",
    confetti: ["🤡", "😂", "🤪", "🙃", "🎉", "🥳"],
  },
  {
    name: "Black Friday",
    date: "11-24",
    confetti: ["🛍️", "💸", "📦", "💰", "🛒"],
  },
  {
    name: "Hanukkah",
    date: function () {
      // Hanukkah (starts on 25th of Kislev in the Hebrew calendar)
      const today = new Date();
      const month = today.getMonth();
      const day = today.getDate();

      // The start date of Hanukkah can vary in the Gregorian calendar each year
      const hanukkahStartDate = new Date(today.getFullYear(), 11, 25); // Example date for 2024

      return month === 11 && day === hanukkahStartDate.getDate();
    },
    confetti: ["🕎", "🕯️", "🍩", "🕍", "💙"],
  },
  {
    name: "Diwali",
    date: "10-21",
    confetti: ["🪔", "🎆", "🎇", "🪙", "🌼", "🍬"],
  },
  {
    name: "Chinese New Year",
    date: function () {
      // Chinese New Year (starts between January 21 and February 20)
      const today = new Date();
      const month = today.getMonth();
      const day = today.getDate();

      // Example: Chinese New Year starts on February 1st for 2024, but varies each year
      const chineseNewYearStart = new Date(today.getFullYear(), 1, 1); // Adjust for the exact start date

      return (
        month === chineseNewYearStart.getMonth() &&
        day === chineseNewYearStart.getDate()
      );
    },
    confetti: ["🐉", "🧧", "🎆", "🎇", "🍊", "🍜"],
  },
];

export default specialDates;
