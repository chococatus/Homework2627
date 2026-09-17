const API_URL =
  "https://script.google.com/macros/s/AKfycbydvgjibp1ZbUbJpUxAjGpO6unRKq2U-Tuhz4B1WNMtGDHfd0DbfcHI9DPQBbY0tGUw/exec";

async function fetchJson(sheetName) {
  const url = sheetName
    ? API_URL + "?sheet=" + encodeURIComponent(sheetName)
    : API_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load data.");
  }

  return await response.json();
}

async function saveWeekProgress(student, week, status) {
  const studentName = String(student || "").trim();
  const weekId = String(week || "").trim();
  const star = getProgressStar(status);

  if (!studentName || !weekId || !star) {
    return;
  }

  const body = new URLSearchParams();
  body.set("action", "saveProgress");
  body.set("student", studentName);
  body.set("week", weekId);
  body.set("status", star);

  const response = await fetch(API_URL, {
    method: "POST",
    body: body,
  });

  if (!response.ok) {
    throw new Error("Failed to save progress.");
  }

  const result = await response.json();
  if (!result || result.ok !== true) {
    throw new Error(result && result.error ? result.error : "Failed to save progress.");
  }

  return result;
}
