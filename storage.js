/**
 * Local Storage Helpers
 * ---------------------
 * Keeps the student's display name and homework progress on this device only.
 */

const STORAGE_KEY = "kkoekkori-student-name";
const HOMEWORK_PROGRESS_KEY = "kkoekkori-homework-progress-v1";

function saveStudentName(name) {
  localStorage.setItem(STORAGE_KEY, String(name || "").trim());
}

function getSavedStudentName() {
  return localStorage.getItem(STORAGE_KEY);
}

function clearStudentName() {
  localStorage.removeItem(STORAGE_KEY);
}

function getHomeworkProgressStore() {
  try {
    const saved = localStorage.getItem(HOMEWORK_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn("[Progress] Could not read saved progress:", error);
    return {};
  }
}

function getHomeworkProgressKey(week, activity) {
  const studentName = String(getSavedStudentName() || "").trim();
  return studentName + "|" + String(week) + "|" + String(activity);
}

function getActivityProgress(week, activity) {
  const store = getHomeworkProgressStore();
  return store[getHomeworkProgressKey(week, activity)] || "";
}

function saveActivityProgress(week, activity, status) {
  const rank = { "": 0, attempted: 1, correct: 2 };
  if (!rank[status]) {
    return;
  }

  const key = getHomeworkProgressKey(week, activity);
  const store = getHomeworkProgressStore();
  const previous = store[key] || "";

  if ((rank[previous] || 0) >= rank[status]) {
    return;
  }

  store[key] = status;
  localStorage.setItem(HOMEWORK_PROGRESS_KEY, JSON.stringify(store));
}

function getProgressStar(status) {
  if (status === "correct") {
    return "🌟";
  }
  if (status === "attempted") {
    return "⭐";
  }
  return "";
}

function getWeekProgressStatus(week, hasStory) {
  const activities = hasStory
    ? ["story", "speaking", "quiz"]
    : ["speaking", "quiz"];

  const statuses = activities.map(function (activity) {
    return getActivityProgress(week, activity);
  });

  if (statuses.some(function (status) { return !status; })) {
    return "";
  }

  if (statuses.every(function (status) { return status === "correct"; })) {
    return "correct";
  }

  return "attempted";
}
