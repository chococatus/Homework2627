/**
 * Story View
 * ----------
 * Listening-only screen for items with type = "story".
 */

const StoryView = (function () {
  const mainEl = document.querySelector(".page");

  let viewEl = null;
  let completionEl = null;
  let titleEl = null;
  let imageEl = null;
  let textEl = null;
  let prevBtn = null;
  let nextBtn = null;
  let listenBtn = null;
  let progressRowEl = null;
  let progressTrackEl = null;
  let progressCountEl = null;
  let backBtn = null;

  let items = [];
  let listenedStatuses = [];
  let currentIndex = 0;
  let currentHomework = null;
  let onBackCallback = null;
  let currentAudio = null;

  function getKoreanVoice() {
    if (!("speechSynthesis" in window)) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    return voices.find(function (voice) {
      return voice.lang && voice.lang.toLowerCase().startsWith("ko");
    }) || null;
  }

  function renderProgress() {
    if (!progressRowEl) {
      return;
    }

    if (items.length === 0) {
      progressRowEl.hidden = true;
      completionEl.hidden = true;
      return;
    }

    progressRowEl.hidden = false;
    progressTrackEl.innerHTML = "";

    listenedStatuses.forEach(function (status) {
      const segment = document.createElement("span");
      segment.className = "study-position__segment study-position__segment--" + status;
      progressTrackEl.appendChild(segment);
    });

    progressCountEl.textContent = (currentIndex + 1) + " / " + items.length;

    const allListened = listenedStatuses.every(function (status) {
      return status === "correct";
    });

    completionEl.hidden = !allListened;
    if (allListened) {
      completionEl.textContent = "Good job! 🌟";
    }
  }

  function markCurrentListened() {
    if (!currentHomework || currentIndex < 0 || currentIndex >= listenedStatuses.length) {
      return;
    }

    listenedStatuses[currentIndex] = "correct";
    saveStoryListenedIndex(currentHomework.week, currentIndex);

    const allListened = listenedStatuses.every(function (status) {
      return status === "correct";
    });

    if (allListened) {
      saveActivityProgress(currentHomework.week, "story", "correct");
    }

    renderProgress();
  }

  function stopCurrentAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  function speakCurrentItem() {
    if (items.length === 0) {
      return;
    }

    const item = items[currentIndex];
    stopCurrentAudio();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (item.audio) {
      currentAudio = new Audio("assets/audio/" + item.audio);
      currentAudio.addEventListener("ended", function () {
        markCurrentListened();
        currentAudio = null;
      }, { once: true });
      currentAudio.play().catch(function (error) {
        console.error("[Story Audio] playback failed:", error);
      });
      return;
    }

    if (!("speechSynthesis" in window)) {
      return;
    }

    markCurrentListened();

    const utterance = new SpeechSynthesisUtterance(item.text);
    const koreanVoice = getKoreanVoice();

    utterance.lang = "ko-KR";
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

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
    viewEl.className = "view study-view";
    viewEl.hidden = true;

    completionEl = document.createElement("div");
    completionEl.className = "study-completion-banner";
    completionEl.hidden = true;

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

    progressRowEl = document.createElement("div");
    progressRowEl.className = "study-position story-position";

    progressTrackEl = document.createElement("div");
    progressTrackEl.className = "study-position__track study-position__track--segmented";

    progressCountEl = document.createElement("span");
    progressCountEl.className = "study-position__count";

    progressRowEl.appendChild(progressTrackEl);
    progressRowEl.appendChild(progressCountEl);

    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn--secondary study-nav-button";
    backBtn.textContent = "Back";

    viewEl.appendChild(completionEl);
    viewEl.appendChild(titleEl);
    viewEl.appendChild(imageRowEl);
    viewEl.appendChild(textEl);
    viewEl.appendChild(listenBtn);
    viewEl.appendChild(progressRowEl);
    viewEl.appendChild(backBtn);
    mainEl.appendChild(viewEl);

    prevBtn.addEventListener("click", function () {
      if (currentIndex > 0) {
        stopCurrentAudio();
        window.speechSynthesis && window.speechSynthesis.cancel();
        currentIndex -= 1;
        renderCurrentItem();
      }
    });

    nextBtn.addEventListener("click", function () {
      if (currentIndex < items.length - 1) {
        stopCurrentAudio();
        window.speechSynthesis && window.speechSynthesis.cancel();
        currentIndex += 1;
        renderCurrentItem();
      }
    });

    listenBtn.addEventListener("click", speakCurrentItem);

    backBtn.addEventListener("click", function () {
      stopCurrentAudio();
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
      renderProgress();
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
    listenBtn.disabled = !item.audio && !("speechSynthesis" in window);
    renderProgress();
  }

  function show(homework, storyItems) {
    createView();
    currentHomework = homework;
    items = Array.isArray(storyItems) ? storyItems : [];
    currentIndex = 0;

    const listened = getStoryListenedIndices(homework.week);
    listenedStatuses = items.map(function (_, index) {
      return listened.includes(index) ? "correct" : "unattempted";
    });

    syncStoryCompletion(homework.week, items.length);

    titleEl.textContent = "꾀꼬리반 숙제 · Week " + homework.week + " · Story";
    renderCurrentItem();
    viewEl.hidden = false;
  }

  function hide() {
    if (viewEl) {
      viewEl.hidden = true;
    }
    stopCurrentAudio();
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
