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
  let completionEl = null;
  let current = 0;
  let total = 0;

  function getNextButton() {
    return document.querySelector('.study-arrow[aria-label="Next item"], .study-arrow[aria-label="Finish study"]');
  }

  function ensureCompletionScreen() {
    if (completionEl) {
      return;
    }

    const viewEl = document.getElementById("placeholder-view");
    const backBtn = document.getElementById("placeholder-back-button");

    completionEl = document.createElement("div");
    completionEl.className = "study-completion";
    completionEl.hidden = true;
    completionEl.innerHTML = [
      '<div class="study-completion__icon" aria-hidden="true">🎉</div>',
      '<h2 class="study-completion__title">잘했어!</h2>',
      '<p class="study-completion__message">이번 주 말하기 연습 끝!</p>',
      '<button class="btn btn--primary study-completion__home" type="button">Home으로</button>'
    ].join("");

    completionEl.querySelector(".study-completion__home").addEventListener("click", function () {
      backBtn.click();
    });

    viewEl.appendChild(completionEl);
  }

  function setStudyContentHidden(hidden) {
    const viewEl = document.getElementById("placeholder-view");

    Array.from(viewEl.children).forEach(function (child) {
      if (child === completionEl) {
        return;
      }
      child.hidden = hidden;
    });
  }

  function showCompletion() {
    ensureCompletionScreen();
    setStudyContentHidden(true);
    completionEl.hidden = false;
  }

  function restoreStudyScreen() {
    if (!completionEl) {
      return;
    }

    completionEl.hidden = true;
    setStudyContentHidden(false);
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

    if (current === total) {
      nextBtn.hidden = false;
      nextBtn.textContent = "끝! 🎉";
      nextBtn.setAttribute("aria-label", "Finish study");
      nextBtn.classList.add("study-finish-button");
    } else {
      nextBtn.textContent = ">";
      nextBtn.setAttribute("aria-label", "Next item");
      nextBtn.classList.remove("study-finish-button");
    }
  }

  function show(itemCount) {
    total = Number(itemCount) || 0;
    current = total > 0 ? 1 : 0;
    ensureCompletionScreen();
    restoreStudyScreen();
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

  return { show, hide };
})();