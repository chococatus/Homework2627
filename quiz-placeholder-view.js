/**
 * Quiz Placeholder View
 * ---------------------
 * Temporary screen while v0.7 quiz gameplay is built step by step.
 */

const QuizPlaceholderView = (function () {
  const mainEl = document.querySelector(".page");

  let viewEl = null;
  let titleEl = null;
  let messageEl = null;
  let backBtn = null;
  let currentHomework = null;
  let onBackCallback = null;

  function createView() {
    if (viewEl) {
      return;
    }

    viewEl = document.createElement("section");
    viewEl.id = "quiz-placeholder-view";
    viewEl.className = "view";
    viewEl.hidden = true;

    titleEl = document.createElement("h1");
    titleEl.className = "view-title";

    const icon = document.createElement("div");
    icon.textContent = "🎯";
    icon.style.fontSize = "4rem";
    icon.style.marginBottom = "1rem";

    messageEl = document.createElement("p");
    messageEl.className = "placeholder-message";
    messageEl.style.fontSize = "1.25rem";
    messageEl.style.marginBottom = "2rem";

    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn--secondary";
    backBtn.textContent = "Back";

    viewEl.appendChild(titleEl);
    viewEl.appendChild(icon);
    viewEl.appendChild(messageEl);
    viewEl.appendChild(backBtn);
    mainEl.appendChild(viewEl);

    backBtn.addEventListener("click", function () {
      if (onBackCallback && currentHomework) {
        onBackCallback(currentHomework);
      }
    });
  }

  function show(homework, quizItems) {
    createView();
    currentHomework = homework;
    titleEl.textContent = "Week " + homework.week + " · Quiz";
    messageEl.textContent = "Quiz items loaded: " + quizItems.length;
    viewEl.hidden = false;
  }

  function hide() {
    if (viewEl) {
      viewEl.hidden = true;
    }
  }

  function init(onBack) {
    createView();
    onBackCallback = onBack;
  }

  return { show, hide, init };
})();
