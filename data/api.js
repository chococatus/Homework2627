const API_URL =
"https://script.google.com/macros/s/AKfycbydvgjibp1ZbUbJpUxAjGpO6unRKq2U-Tuhz4B1WNMtGDHfd0DbfcHI9DPQBbY0tGUw/exec";
  //"https://script.google.com/macros/s/AKfycbz32DBlM7OFn8aXbO1wwMv0vR3I90MEtCyAbP4OXgz93XSVna33N6N1zKhVbXWaAXDf/exec";

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
