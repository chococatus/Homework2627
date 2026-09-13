/**
 * Study position indicator
 * ------------------------
 * Shows the current card position and practice status for each item.
 */

const StudyPosition = (function () {
  let rowEl = null;
  let trackEl = null;
  let countEl = null;
  let completionEl = null;
  let current = 0;
  let total = 0;
  let statuses = [];
  let currentHomework = null;
  let currentItems = [];

  function getNextButton() {
    return document.querySelector('.study-arrow[aria-label="Next item"]');
  }

  function ensureElements() {
    if (rowEl) {
      return;
    }

    const viewEl = document.getElementById("placeholder-view");
    const titleEl = viewEl.querySelector(".view-title");
    const backBtn = document.getElementById("placeholder-back-button");

    completionEl = document.createElement("div");
    completionEl.className = "study-completion-banner";
    completionEl.hidden = true;
    titleEl.insertAdjacentElement("beforebegin", completionEl);

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

  function getCompletionStatus() {
    if (statuses.length === 0) {
      return "";
    }

    const allCorrect = statuses.every(function (status) {
      return status === "correct";
    });
    if (allCorrect) {
      return "correct";
    }

    const allAttempted = statuses.every(function (status) {
      return status !== "unattempted";
    });
    return allAttempted ? "attempted" : "";
  }

  function renderCompletion() {
    ensureElements();
    const status = getCompletionStatus();

    completionEl.hidden = !status;
    if (status) {
      completionEl.textContent = "Good job! " + getProgressStar(status);
    }
  }

  function renderPositionOnly() {
    ensureElements();

    if (total === 0) {
      rowEl.hidden = true;
      completionEl.hidden = true;
      return;
    }

    rowEl.hidden = false;
    renderSegments();
    countEl.textContent = current + " / " + total;
    renderCompletion();
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

  function saveSpeakingProgress() {
    if (!currentHomework || statuses.length === 0) {
      return;
    }

    const status = getCompletionStatus();

    if (status === "correct") {
      saveActivityProgress(currentHomework.week, "speaking", "correct");
    } else if (status === "attempted") {
      saveActivityProgress(currentHomework.week, "speaking", "attempted");
    }
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

    if (currentHomework && currentItems[index]) {
      savePracticeItemStatus(
        currentHomework.week,
        "speaking",
        currentItems[index],
        statuses[index]
      );
    }

    saveSpeakingProgress();
    renderPositionOnly();
  }

  function show(itemCount, homework, items) {
    total = Number(itemCount) || 0;
    current = total > 0 ? 1 : 0;
    currentHomework = homework || null;
    currentItems = Array.isArray(items) ? items.slice() : [];

    if (currentHomework && currentItems.length === total) {
      statuses = getPracticeStatuses(
        currentHomework.week,
        "speaking",
        currentItems
      );
    } else {
      statuses = Array(total).fill("unattempted");
    }

    ensureElements();
    completionEl.hidden = true;
    saveSpeakingProgress();
    render();
  }

  function hide() {
    if (rowEl) {
      rowEl.hidden = true;
    }
    if (completionEl) {
      completionEl.hidden = true;
    }
  }

  return { show, hide, markAttempt };
})();
