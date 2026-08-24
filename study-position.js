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
  let current = 0;
  let total = 0;

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

      if (arrow.getAttribute("aria-label") === "Previous item") {
        current = Math.max(1, current - 1);
      } else if (arrow.getAttribute("aria-label") === "Next item") {
        current = Math.min(total, current + 1);
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
  }

  function show(itemCount) {
    total = Number(itemCount) || 0;
    current = total > 0 ? 1 : 0;
    render();
  }

  function hide() {
    if (rowEl) {
      rowEl.hidden = true;
    }
  }

  return { show, hide };
})();