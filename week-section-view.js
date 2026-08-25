/**
 * Week Section View
 * -----------------
 * Menu shown after a student selects a homework week.
 */

const WeekSectionView = (function () {
  const mainEl = document.querySelector(".page");

  let viewEl = null;
  let titleEl = null;
  let storyButton = null;
  let speakingButton = null;
  let quizButton = null;
  let backButton = null;
  let currentHomework = null;

  let onStoryCallback = null;
  let onSpeakingCallback = null;
  let onBackCallback = null;

  function createView() {
    if (viewEl) {
      return;
    }

    viewEl = document.createElement("section");
    viewEl.id = "week-section-view";
    viewEl.className = "view";
    viewEl.hidden = true;

    titleEl = document.createElement("h1");
    titleEl.className = "view-title";

    storyButton = document.createElement("button");
    storyButton.type = "button";
    storyButton.className = "btn btn--primary";
    storyButton.textContent = "📖 이번 주 이야기 듣기";

    speakingButton = document.createElement("button");
    speakingButton.type = "button";
    speakingButton.className = "btn btn--primary";
    speakingButton.textContent = "🎤 말하기 연습";

    quizButton = document.createElement("button");
    quizButton.type = "button";
    quizButton.className = "btn btn--secondary";
    quizButton.textContent = "🎯 퀴즈";
    quizButton.disabled = true;
    quizButton.title = "Coming soon";

    backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "btn btn--secondary";
    backButton.textContent = "Back to Home";

    viewEl.appendChild(titleEl);
    viewEl.appendChild(storyButton);
    viewEl.appendChild(speakingButton);
    viewEl.appendChild(quizButton);
    viewEl.appendChild(backButton);
    mainEl.appendChild(viewEl);

    storyButton.addEventListener("click", function () {
      if (onStoryCallback && currentHomework) {
        onStoryCallback(currentHomework);
      }
    });

    speakingButton.addEventListener("click", function () {
      if (onSpeakingCallback && currentHomework) {
        onSpeakingCallback(currentHomework);
      }
    });

    backButton.addEventListener("click", function () {
      if (onBackCallback) {
        onBackCallback();
      }
    });
  }

  function show(homework, hasStory) {
    createView();
    currentHomework = homework;
    titleEl.textContent = "Week " + homework.week;
    storyButton.hidden = !hasStory;
    viewEl.hidden = false;
  }

  function hide() {
    if (viewEl) {
      viewEl.hidden = true;
    }
  }

  function init(onStory, onSpeaking, onBack) {
    createView();
    onStoryCallback = onStory;
    onSpeakingCallback = onSpeaking;
    onBackCallback = onBack;
  }

  return { show, hide, init };
})();
