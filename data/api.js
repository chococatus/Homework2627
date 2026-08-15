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
