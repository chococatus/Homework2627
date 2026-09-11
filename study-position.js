/**
 * Study position indicator
 * ------------------------
 * Shows the current card position and practice status for each item.
 */

const StudyPosition = (function () {
  let rowEl = null;
  let trackEl = null;
  let countEl = null;
  let current = 0;
  let total = 0;
  let statuses = [];

  function getNextButton() {
    return document.querySelector('.study-arrow[aria-label="Next item"]');
  }

  function ensureElements() {
    if (rowEl) {
      return;
    }

    const backBtn = document.getElementById("placeholder-back-button");

    rowEl = document.createElement("div");
    rowEl.className = "study-position";

    trackEl = document.createElement("div");
    trackEl.className = "study-position__track study-position__track--segmented";

    countEl = document.createElement("span");
    countEl.className = "study-position__count";

    rowEl.appendChild(trackEl);
    rowEl.appendChild(countEl);
    backBtn.insertAdjacentElement("beforebegin", rowEl);

    document.addEventListener("click", function (event) {
      const arrow = event.target.closest(".study-arrow");
      if (!arrow || total === 0) {
        return;
      }

      const action = arrow.getAttribute("aria-label");

      if (action === "Previous item") {
        current = Math.max(1, current - 1);
      } else if (action === "Next item") {
        current = Math.min(total, current + 1);
      } else {
        return;
      }

      render();
    });
  }

  function renderSegments() {
    trackEl.innerHTML = "";

    statuses.forEach(function (status) {
      const segment = document.createElement("span");
      segment.className = "study-position__segment study-position__segment--" + status;
      trackEl.appendChild(segment);
    });
  }

  function renderPositionOnly() {
    ensureElements();

    if (total === 0) {
      rowEl.hidden = true;
      return;
    }

    rowEl.hidden = false;
    renderSegments();
    countEl.textContent = current + " / " + total;
  }

  function render() {
    renderPositionOnly();

    const nextBtn = getNextButton();
    if (!nextBtn) {
      return;
    }

    nextBtn.textContent = ">";
    nextBtn.setAttribute("aria-label", "Next item");
    nextBtn.hidden = current === total;
  }

  function markAttempt(index, isCorrect) {
    if (index < 0 || index >= statuses.length) {
      return;
    }

    if (isCorrect) {
      statuses[index] = "correct";
    } else if (statuses[index] !== "correct") {
      statuses[index] = "attempted";
    }

    renderPositionOnly();
  }

  function show(itemCount) {
    total = Number(itemCount) || 0;
    current = total > 0 ? 1 : 0;
    statuses = Array(total).fill("unattempted");
    render();
  }

  function hide() {
    if (rowEl) {
      rowEl.hidden = true;
    }
  }

  return { show, hide, markAttempt };
})();
