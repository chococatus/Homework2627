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
  let onQuizCallback = null;
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

    speakingButton = document.createElement("button");
    speakingButton.type = "button";
    speakingButton.className = "btn btn--primary";

    quizButton = document.createElement("button");
    quizButton.type = "button";
    quizButton.className = "btn btn--primary";

    backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "btn btn--secondary";
    backButton.textContent = "Back";

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

    quizButton.addEventListener("click", function () {
      if (onQuizCallback && currentHomework) {
        onQuizCallback(currentHomework);
      }
    });

    backButton.addEventListener("click", function () {
      if (onBackCallback) {
        onBackCallback();
      }
    });
  }

  function withStar(label, status) {
    const star = getProgressStar(status);
    return star ? label + " " + star : label;
  }

  function syncCompletedWeek(week, weekStatus) {
    if (!weekStatus || typeof saveWeekProgress !== "function") {
      return;
    }

    const studentName = getSavedStudentName();
    if (!studentName) {
      return;
    }

    // Do not make the child wait for Google Sheets. Local progress remains the
    // source for the UI; the server write happens quietly in the background.
    saveWeekProgress(studentName, week, weekStatus).catch(function (error) {
      console.warn("[Progress Sync] Could not save week progress:", error);
    });
  }

  function show(homework, hasStory) {
    createView();
    currentHomework = homework;

    const storyStatus = getActivityProgress(homework.week, "story");
    const speakingStatus = getActivityProgress(homework.week, "speaking");
    const quizStatus = getActivityProgress(homework.week, "quiz");
    const weekStatus = getWeekProgressStatus(homework.week, hasStory);
    const weekStar = getProgressStar(weekStatus);

    titleEl.textContent = "Week " + homework.week + (weekStar ? " " + weekStar : "");
    storyButton.textContent = withStar("📖 이번 주 이야기 듣기", storyStatus);
    speakingButton.textContent = withStar("🎤 말하기 연습", speakingStatus);
    quizButton.textContent = withStar("🎯 퀴즈", quizStatus);
    storyButton.hidden = !hasStory;
    viewEl.hidden = false;

    syncCompletedWeek(homework.week, weekStatus);
  }

  function hide() {
    if (viewEl) {
      viewEl.hidden = true;
    }
  }

  function init(onStory, onSpeaking, onQuiz, onBack) {
    createView();
    onStoryCallback = onStory;
    onSpeakingCallback = onSpeaking;
    onQuizCallback = onQuiz;
    onBackCallback = onBack;
  }

  return { show, hide, init };
})();
