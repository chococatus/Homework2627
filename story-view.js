/**
 * Story View
 * ----------
 * Listening-only screen for items with type = "story".
 */

const StoryView = (function () {
  const mainEl = document.querySelector(".page");

  let viewEl = null;
  let titleEl = null;
  let imageEl = null;
  let textEl = null;
  let prevBtn = null;
  let nextBtn = null;
  let listenBtn = null;
  let backBtn = null;

  let items = [];
  let currentIndex = 0;
  let currentHomework = null;
  let onBackCallback = null;

  function getKoreanVoice() {
    if (!("speechSynthesis" in window)) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    return voices.find(function (voice) {
      return voice.lang && voice.lang.toLowerCase().startsWith("ko");
    }) || null;
  }

  function speakCurrentItem() {
    if (items.length === 0 || !("speechSynthesis" in window)) {
      return;
    }

    const item = items[currentIndex];
    const utterance = new SpeechSynthesisUtterance(item.text);
    const koreanVoice = getKoreanVoice();

    utterance.lang = "ko-KR";
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    window.speechSynthesis.cancel();
    setTimeout(function () {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }

  function createView() {
    if (viewEl) {
      return;
    }

    viewEl = document.createElement("section");
    viewEl.id = "story-view";
    viewEl.className = "view";
    viewEl.hidden = true;

    titleEl = document.createElement("h1");
    titleEl.className = "study-week-label";

    const imageRowEl = document.createElement("div");
    imageRowEl.className = "study-image-row";

    prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "study-arrow";
    prevBtn.textContent = "<";
    prevBtn.setAttribute("aria-label", "Previous story item");

    imageEl = document.createElement("img");
    imageEl.className = "study-image";
    imageEl.alt = "";

    nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "study-arrow";
    nextBtn.textContent = ">";
    nextBtn.setAttribute("aria-label", "Next story item");

    imageRowEl.appendChild(prevBtn);
    imageRowEl.appendChild(imageEl);
    imageRowEl.appendChild(nextBtn);

    textEl = document.createElement("p");
    textEl.className = "study-text story-text";

    listenBtn = document.createElement("button");
    listenBtn.type = "button";
    listenBtn.className = "study-speak-button";
    listenBtn.textContent = "🔊 Listen";

    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn--secondary";
    backBtn.textContent = "Back to Week Menu";
    backBtn.style.marginTop = "1rem";

    viewEl.appendChild(titleEl);
    viewEl.appendChild(imageRowEl);
    viewEl.appendChild(textEl);
    viewEl.appendChild(listenBtn);
    viewEl.appendChild(backBtn);
    mainEl.appendChild(viewEl);

    prevBtn.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex -= 1;
        renderCurrentItem();
      }
    });

    nextBtn.addEventListener("click", function () {
      if (currentIndex < items.length - 1) {
        currentIndex += 1;
        renderCurrentItem();
      }
    });

    listenBtn.addEventListener("click", speakCurrentItem);

    backBtn.addEventListener("click", function () {
      window.speechSynthesis && window.speechSynthesis.cancel();
      if (onBackCallback && currentHomework) {
        onBackCallback(currentHomework);
      }
    });
  }

  function renderCurrentItem() {
    if (items.length === 0) {
      textEl.textContent = "No story for this week yet.";
      imageEl.hidden = true;
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      listenBtn.hidden = true;
      return;
    }

    const item = items[currentIndex];

    textEl.textContent = item.text;

    if (item.image) {
      imageEl.src = "assets/images/" + item.image;
      imageEl.alt = item.text;
      imageEl.hidden = false;
    } else {
      imageEl.hidden = true;
    }

    prevBtn.hidden = currentIndex === 0;
    nextBtn.hidden = currentIndex === items.length - 1;
    listenBtn.hidden = false;
    listenBtn.disabled = !("speechSynthesis" in window);
  }

  function show(homework, storyItems) {
    createView();
    currentHomework = homework;
    items = Array.isArray(storyItems) ? storyItems : [];
    currentIndex = 0;
    titleEl.textContent = "Week " + homework.week + " · Story";
    renderCurrentItem();
    viewEl.hidden = false;
  }

  function hide() {
    if (viewEl) {
      viewEl.hidden = true;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function init(onBack) {
    createView();
    onBackCallback = onBack;
  }

  return { show, hide, init };
})();
