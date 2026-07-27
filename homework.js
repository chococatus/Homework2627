/**
 * Homework Data (Google Sheets: "Homework" worksheet)
 * ---------------------------------------------------
 * Temporary sample data. Later this will be loaded from the
 * semester's Google Sheet without changing UI code.
 *
 * Each semester uses a new spreadsheet (e.g. Homework_2026_Fall).
 * Only the data source changes — not the application logic.
 */


/** Total stars available for the semester (one per week). */
const TOTAL_SEMESTER_STARS = 14;
const HOMEWORK_CACHE_KEY = "kkoekkori-homework-cache";

/**
 * Return only homework that has been published so far.
 * Future (unpublished) weeks are hidden from the list.
 * @returns {object[]}
 */
let homeworkData = [];
let homeworkLoadPromise = null;

function loadCachedHomeworkData() {
  try {
    const cached = localStorage.getItem(HOMEWORK_CACHE_KEY);
    if (!cached) {
      return;
    }

    const parsed = JSON.parse(cached);
    if (Array.isArray(parsed) && parsed.length > 0) {
      homeworkData = parsed;
    }
  } catch (error) {
    console.error("Failed to load cached homework data:", error);
  }
}

function getPublishedHomework() {
  return homeworkData.filter(function (item) {
    return item && item.published === true;
  });
}

async function loadHomeworkData() {
  if (typeof getHomeworkList !== "function") {
    return;
  }

  if (homeworkLoadPromise) {
    return homeworkLoadPromise;
  }

  loadCachedHomeworkData();

  homeworkLoadPromise = getHomeworkList()
    .then(function (data) {
      if (Array.isArray(data) && data.length > 0) {
        homeworkData = data;
        localStorage.setItem(HOMEWORK_CACHE_KEY, JSON.stringify(data));
      }
    })
    .catch(function (error) {
      console.error(error);
    })
    .finally(function () {
      homeworkLoadPromise = null;
    });

  return homeworkLoadPromise;
}

/**
 * Find a single homework entry by week number.
 * @param {number} week
 * @returns {object|undefined}
 */
function getHomeworkByWeek(week) {
  return homeworkData.find(function (item) {
    return item && item.week === week;
  });
}
