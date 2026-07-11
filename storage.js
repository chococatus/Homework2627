/**
 * Local Storage Helpers
 * ---------------------
 * Remembers which student was last chosen so returning users
 * skip the selection screen.
 */

const STORAGE_KEY = "kkoekkori-selected-student";

/**
 * Save the selected student's id to Local Storage.
 * @param {string} studentId
 */
function saveSelectedStudent(studentId) {
  localStorage.setItem(STORAGE_KEY, studentId);
}

/**
 * Read the saved student id, or null if none is stored.
 * @returns {string|null}
 */
function getSavedStudentId() {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Remove the saved student so the selection screen appears again.
 */
function clearSelectedStudent() {
  localStorage.removeItem(STORAGE_KEY);
}
