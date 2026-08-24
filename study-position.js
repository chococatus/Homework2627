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
  let completionActive = false;
  let lastItemSnapshot = null;

  function getNextButton() {
    return document.querySelector(
      '.study-arrow[aria-label="Next item"], .study-arrow[aria-label="Finish study"]'
    );
  }

  function getPreviousButton() {
    return document.querySelector(
      '.study-arrow[aria-label="Previous item"], .study-arrow[aria-label="Return to last item"]'
    );
  }

  function saveLastItemSnapshot() {
    const messageEl = document.querySelector("#placeholder-view .study-text");
    const imageEl = document.querySelector("#placeholder-view .study-image");

    lastItemSnapshot = {
      text: messageEl ? messageEl.textContent : "",
      imageSrc: imageEl ? imageEl.getAttribute("src") : "",
      imageAlt: imageEl ? imageEl.alt : "",
      imageHidden: imageEl ? imageEl.hidden : true,
    };
  }

  function showCompletion() {
    const messageEl = document.querySelector("#placeholder-view .study-text");
    const imageEl = document.querySelector("#placeholder-view .study-image");
    const prevBtn = getPreviousButton();
    const nextBtn = getNextButton();
    const voiceRow = document.querySelector("#placeholder-view .study-voice-row");
    const listenBtn = document.querySelector("#placeholder-view .study-speak-button");
    const speakBtn = document.querySelector("#placeholder-view .study-recognition-button");
    const resultEl = document.querySelector("#placeholder-view .study-recognition-result");

    saveLastItemSnapshot();
    completionActive = true;

    if (messageEl) {
      messageEl.textContent = "잘했어!";
    }

    if (imageEl) {
      imageEl.src = "assets/images/good job.png";
      imageEl.alt = "Celebration fireworks";
      imageEl.hidden = false;
    }

    if (prevBtn) {
      prevBtn.hidden = false;
      prevBtn.setAttribute("aria-label", "Return to last item");
    }

    if (nextBtn) {
      nextBtn.hidden = true;
    }

    if (voiceRow) {
      voiceRow.hidden = false;
    }

    if (listenBtn) {
      listenBtn.hidden = true;
    }

    if (speakBtn) {
      speakBtn.hidden = true;
    }

    if (resultEl) {
      resultEl.hidden = true;
    }

    // Keep the completed 10 / 10 position indicator and the existing Back to Home button.
    renderPositionOnly();
  }

  function restoreLastItem() {
    if (!completionActive || !lastItemSnapshot) {
      return;
    }

    const messageEl = document.querySelector("#placeholder-view .study-text");
    const imageEl = document.querySelector("#placeholder-view .study-image");
    const prevBtn = getPreviousButton();
    const nextBtn = getNextButton();
    const voiceRow = document.querySelector("#placeholder-view .study-voice-row");
    const listenBtn = document.querySelector("#placeholder-view .study-speak-button");
    const speakBtn = document.querySelector("#placeholder-view .study-recognition-button");

    completionActive = false;

    if (messageEl) {
      messageEl.textContent = lastItemSnapshot.text;
    }

    if (imageEl) {
      imageEl.src = lastItemSnapshot.imageSrc;
      imageEl.alt = lastItemSnapshot.imageAlt;
      imageEl.hidden = lastItemSnapshot.imageHidden;
    }

    if (prevBtn) {
      prevBtn.setAttribute("aria-label", "Previous item");
      prevBtn.hidden = total <= 1;
    }

    if (nextBtn) {
      nextBtn.textContent = ">";
      nextBtn.setAttribute("aria-label", "Finish study");
      nextBtn.hidden = false;
    }

    if (voiceRow) {
      voiceRow.hidden = false;
    }

    if (listenBtn) {
      listenBtn.hidden = false;
    }

    if (speakBtn) {
      speakBtn.hidden = false;
    }

    renderPositionOnly();
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

    // Capture this special click before PlaceholderView handles the normal previous arrow.
    document.addEventListener(
      "click",
      function (event) {
        const arrow = event.target.closest('.study-arrow[aria-label="Return to last item"]');
        if (!arrow) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        restoreLastItem();
      },
      true
    );

    document.addEventListener("click", function (event) {
      const arrow = event.target.closest(".study-arrow");
      if (!arrow || total === 0 || completionActive) {
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

  function renderPositionOnly() {
    ensureElements();

    if (total === 0) {
      rowEl.hidden = true;
      return;
    }

    rowEl.hidden = false;
    fillEl.style.width = ((current / total) * 100) + "%";
    countEl.textContent = current + " / " + total;
  }

  function render() {
    renderPositionOnly();

    const nextBtn = getNextButton();
    if (!nextBtn) {
      return;
    }

    nextBtn.textContent = ">";

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
    completionActive = false;
    lastItemSnapshot = null;
    render();
  }

  function hide() {
    completionActive = false;
    lastItemSnapshot = null;

    if (rowEl) {
      rowEl.hidden = true;
    }
  }

  return { show, hide };
})();