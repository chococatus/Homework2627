/**
 * Local Storage Helpers
 * ---------------------
 * Keeps the student's display name on this device only.
 */

const STORAGE_KEY = "kkoekkori-student-name";

function saveStudentName(name) {
  localStorage.setItem(STORAGE_KEY, String(name || "").trim());
}

function getSavedStudentName() {
  return localStorage.getItem(STORAGE_KEY);
}

function clearStudentName() {
  localStorage.removeItem(STORAGE_KEY);
}
