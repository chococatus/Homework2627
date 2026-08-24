/**
 * Study position indicator
 * ------------------------
 * Shows the current card position within the selected week's study items.
 * This is navigation only; it does not represent saved completion progress.
 */

const StudyPosition = (function () {
  let rowEl = null;
  let fillEl = null;
  let countEl = null;
  let fireworksEl = null;
  let homeBtn = null;
  let current = 0;
  let total = 0;

  function getNextButton() {
    return document.querySelector('.study-arrow[aria-label="Next item"], .study-arrow[aria-label="Finish study"]');
  }

  function ensureCompletionElements() {
    if (fireworksEl && homeBtn) {
      return;
    }

    const imageEl = document.querySelector("#placeholder-view .study-image");
    const backBtn = document.getElementById("placeholder-back-button");

    if (!fireworksEl && imageEl) {
      fireworksEl = document.createElement("div");
      fireworksEl.className = "study-completion-fireworks";
      fireworksEl.textContent = "🎆🎉🎆";
      fireworksEl.setAttribute("aria-label", "Celebration");
      fireworksEl.hidden = true;
      imageEl.insertAdjacentElement("afterend", fireworksEl);
    }

    if (!homeBtn) {
      homeBtn = document.createElement("button");
      homeBtn.className = "btn btn--primary study-completion-home";
      homeBtn.type = "button";
      homeBtn.textContent = "Home으로";
      homeBtn.hidden = true;
      backBtn.insertAdjacentElement("beforebegin", homeBtn);

      homeBtn.addEventListener("click", function () {
        backBtn.click();
      });
    }
  }

  function showCompletion() {
    ensureCompletionElements();

    const messageEl = document.querySelector("#placeholder-view .study-text");
    const imageEl = document.querySelector("#placeholder-view .study-image");
    const prevBtn = document.querySelector('.study-arrow[aria-label="Previous item"]');
    const nextBtn = getNextButton();
    const voiceRow = document.querySelector("#placeholder-view .study-voice-row");
    const resultEl = document.querySelector("#placeholder-view .study-recognition-result");
    const backBtn = document.getElementById("placeholder-back-button");

    messageEl.textContent = "잘했어!";

    if (imageEl) {
      imageEl.hidden = true;
    }
    if (fireworksEl) {
      fireworksEl.hidden = false;
    }
    if (prevBtn) {
      prevBtn.hidden = true;
    }
    if (nextBtn) {
      nextBtn.hidden = true;
    }
    if (voiceRow) {
      voiceRow.hidden = true;
    }
    if (resultEl) {
      resultEl.hidden = true;
    }
    if (rowEl) {
      rowEl.hidden = true;
    }

    backBtn.hidden = true;
    homeBtn.hidden = false;
  }

  function restoreStudyScreen() {
    ensureCompletionElements();

    const imageEl = document.querySelector("#placeholder-view .study-image");
    const voiceRow = document.querySelector("#placeholder-view .study-voice-row");
    const backBtn = document.getElementById("placeholder-back-button");

    if (fireworksEl) {
      fireworksEl.hidden = true;
    }
    if (homeBtn) {
      homeBtn.hidden = true;
    }
    if (imageEl) {
      imageEl.hidden = false;
    }
    if (voiceRow) {
      voiceRow.hidden = false;
    }

    backBtn.hidden = false;
  }

  function ensureElements() {
    if (rowEl) {
      return;
    }

    const backBtn = document.getElementById("placeholder-back-button");

    rowEl = document.createElement("div");
    rowEl.className = "study-position";

    const trackEl = document.createElement("div");
    trackEl.className = "study-position__track";

    fillEl = document.createElement("div");
    fillEl.className = "study-position__fill";
    trackEl.appendChild(fillEl);

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
      } else if (action === "Finish study") {
        showCompletion();
        return;
      } else {
        return;
      }

      render();
    });
  }

  function render() {
    ensureElements();

    if (total === 0) {
      rowEl.hidden = true;
      return;
    }

    rowEl.hidden = false;
    fillEl.style.width = ((current / total) * 100) + "%";
    countEl.textContent = current + " / " + total;

    const nextBtn = getNextButton();
    if (!nextBtn) {
      return;
    }

    nextBtn.textContent = ">";
    nextBtn.classList.remove("study-finish-button");

    if (current === total) {
      nextBtn.hidden = false;
      nextBtn.setAttribute("aria-label", "Finish study");
    } else {
      nextBtn.setAttribute("aria-label", "Next item");
    }
  }

  function show(itemCount) {
    total = Number(itemCount) || 0;
    current = total > 0 ? 1 : 0;
    ensureCompletionElements();
    restoreStudyScreen();
    render();
  }

  function hide() {
    if (rowEl) {
      rowEl.hidden = true;
    }
    if (fireworksEl) {
      fireworksEl.hidden = true;
    }
    if (homeBtn) {
      homeBtn.hidden = true;
    }
  }

  return { show, hide };
})();