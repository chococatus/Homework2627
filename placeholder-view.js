/**
 * Homework View — Week word preview
 * ---------------------------------
 * Shows one word/sentence item at a time for the selected week.
 */

const PlaceholderView = (function () {
  const viewEl = document.getElementById("placeholder-view");
  const titleEl = document.querySelector("#placeholder-view .view-title");
  const messageEl = document.querySelector("#placeholder-view .placeholder-message");
  const backBtn = document.getElementById("placeholder-back-button");

  let onBackCallback = null;
  let items = [];
  let currentIndex = 0;
  let imageEl = null;
  let imageRowEl = null;
  let prevBtn = null;
  let nextBtn = null;

  function ensureControls() {
    titleEl.classList.add("study-week-label");
    messageEl.classList.add("study-text");
    backBtn.classList.add("study-nav-button");

    if (!imageRowEl) {
      imageRowEl = document.createElement("div");
      imageRowEl.className = "study-image-row";
      messageEl.insertAdjacentElement("beforebegin", imageRowEl);
    }

    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.className = "study-arrow";
      prevBtn.type = "button";
      prevBtn.textContent = "←";
      prevBtn.setAttribute("aria-label", "Previous item");
      imageRowEl.appendChild(prevBtn);

      prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
          currentIndex -= 1;
          renderCurrentItem();
        }
      });
    }

    if (!imageEl) {
      imageEl = document.createElement("img");
      imageEl.className = "study-image";
      imageEl.alt = "";
      imageRowEl.appendChild(imageEl);
    }

    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.className = "study-arrow";
      nextBtn.type = "button";
      nextBtn.textContent = "→";
      nextBtn.setAttribute("aria-label", "Next item");
      imageRowEl.appendChild(nextBtn);

      nextBtn.addEventListener("click", function () {
        if (currentIndex < items.length - 1) {
          currentIndex += 1;
          renderCurrentItem();
        }
      });
    }
  }

  function renderCurrentItem() {
    ensureControls();

    if (items.length === 0) {
      messageEl.textContent = "No study items for this week yet.";
      imageEl.hidden = true;
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }

    const item = items[currentIndex];

    messageEl.textContent = item.text;

    if (item.image) {
      imageEl.src = "assets/images/" + item.image;
      imageEl.alt = item.text;
      imageEl.hidden = false;
    } else {
      imageEl.hidden = true;
    }

    prevBtn.hidden = currentIndex === 0;
    nextBtn.hidden = currentIndex === items.length - 1;
  }

  function show(homework, weekItems) {
    items = Array.isArray(weekItems) ? weekItems : [];
    currentIndex = 0;
    titleEl.textContent = "Week " + homework.week + " — " + homework.title;
    renderCurrentItem();
    viewEl.hidden = false;
  }

  function hide() {
    viewEl.hidden = true;
  }

  function init(onBack) {
    onBackCallback = onBack;

    backBtn.addEventListener("click", function () {
      if (onBackCallback) {
        onBackCallback();
      }
    });
  }

  return { show, hide, init };
})();
