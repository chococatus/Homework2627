const API_URL =
  "https://script.google.com/macros/s/AKfycbz32DBlM7OFn8aXbO1wwMv0vR3I90MEtCyAbP4OXgz93XSVna33N6N1zKhVbXWaAXDf/exec";

async function fetchJson() {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load data.");
  }

  return await response.json();
}