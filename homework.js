/**
 * Homework Data (Google Sheets: "Homework" worksheet)
 * ---------------------------------------------------
 * Temporary sample data. Later this will be loaded from the
 * semester's Google Sheet without changing UI code.
 *
 * Each semester uses a new spreadsheet (e.g. Homework_2026_Fall).
 * Only the data source changes — not the application logic.
 */

const HOMEWORK = [
  { week: 1,  title: "Vowel ㅏ",       published: true  },
  { week: 2,  title: "Vowel ㅑ",       published: true  },
  { week: 3,  title: "Consonant ㄱ",   published: true  },
  { week: 4,  title: "Consonant ㄴ",   published: false },
  { week: 5,  title: "Consonant ㄷ",   published: false },
  { week: 6,  title: "Consonant ㄹ",   published: false },
  { week: 7,  title: "Consonant ㅁ",   published: false },
  { week: 8,  title: "Consonant ㅂ",   published: false },
  { week: 9,  title: "Consonant ㅅ",   published: false },
  { week: 10, title: "Consonant ㅇ",   published: false },
  { week: 11, title: "Consonant ㅈ",   published: false },
  { week: 12, title: "Consonant ㅊ",   published: false },
  { week: 13, title: "Consonant ㅋ",   published: false },
  { week: 14, title: "Consonant ㅌ",   published: false },
];

/** Total stars available for the semester (one per week). */
const TOTAL_SEMESTER_STARS = 14;

/**
 * Return only homework that has been published so far.
 * Future (unpublished) weeks are hidden from the list.
 * @returns {object[]}
 */
function getPublishedHomework() {
  return HOMEWORK.filter(function (item) {
    return item.published;
  });
}

/**
 * Find a single homework entry by week number.
 * @param {number} week
 * @returns {object|undefined}
 */
function getHomeworkByWeek(week) {
  return HOMEWORK.find(function (item) {
    return item.week === week;
  });
}
