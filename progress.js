/**
 * Progress Data (Google Sheets: "Progress" worksheet)
 * ---------------------------------------------------
 * Temporary sample data. Later this will be loaded from the
 * semester's Google Sheet, keyed by student id and week.
 *
 * Status values:
 *   "completed" — homework finished
 *   "started"   — homework begun but not finished
 *   (no record) — not yet started
 */

const PROGRESS = [
  { studentId: "minsoo", week: 1, status: "completed" },
  { studentId: "minsoo", week: 2, status: "completed" },
  { studentId: "minsoo", week: 3, status: "started"   },

  { studentId: "jiwoo",  week: 1, status: "completed" },
  { studentId: "jiwoo",  week: 2, status: "started"   },
];

/** The week number currently active for the class. */
const CURRENT_WEEK = 3;

/**
 * Look up a student's progress record for one week.
 * @param {string} studentId
 * @param {number} week
 * @returns {string|undefined} — "completed", "started", or "not_started"
 */
function getWeekProgress(studentId, week) {
  const record = PROGRESS.find(function (entry) {
    return entry.studentId === studentId && entry.week === week;
  });
  return record ? record.status : "not_started";
}


/**
 * Count how many semester stars a student has earned.
 * For now, each completed week = one star (sample logic).
 * @param {string} studentId
 * @returns {number}
 */
function getStarsEarned(studentId) {
  return PROGRESS.filter(function (entry) {
    return entry.studentId === studentId && entry.status === "completed";
  }).length;
}

/**
 * Return semester stars for display.
 * Uses sample overrides until Google Sheets provides real totals.
 * @param {string} studentId
 * @returns {number}
 */
function getStarsEarnedWithFallback(studentId) {
  // Temporary per-student sample totals (matches demo: 4 / 14 Stars)
  const SAMPLE_STARS = {
    minsoo: 4,
    jiwoo:  1,
  };

  if (SAMPLE_STARS[studentId] !== undefined) {
    return SAMPLE_STARS[studentId];
  }

  const earned = getStarsEarned(studentId);
  return earned > 0 ? earned : 4;
}
