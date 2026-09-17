/**
 * Words Data (static JSON generated from Google Sheets)
 * ----------------------------------------------------
 * Loads data/words.json and provides week-based lookup.
 */

let WORDS = [];
let wordsLoadPromise = null;

async function loadWordsData() {
  if (wordsLoadPromise) {
    return wordsLoadPromise;
  }

  const startTime = performance.now();
  console.log("[Words Load] started");

  wordsLoadPromise = fetch("data/words.json?ts=" + Date.now(), { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load words data.");
      }

      return response.json();
    })
    .then(function (data) {
      if (Array.isArray(data)) {
        WORDS = data;
      }

      const completeTime = performance.now();
      console.log(
        "[Words Load] complete:",
        (completeTime - startTime).toFixed(0) + " ms",
        "items:",
        WORDS.length
      );
    })
    .catch(function (error) {
      console.error("Failed to load words data:", error);
      throw error;
    });

  return wordsLoadPromise;
}

function personalizeWordItem(item) {
  if (!item) {
    return item;
  }

  const personalized = Object.assign({}, item);
  personalized.templateText = item.text || "";
  personalized.text = resolveStudentTemplate(item.text || "");
  return personalized;
}

function getWordsByWeek(week) {
  const weekId = String(week == null ? "" : week).trim();

  return WORDS.filter(function (item) {
    return item && String(item.week == null ? "" : item.week).trim() === weekId;
  }).map(personalizeWordItem);
}
