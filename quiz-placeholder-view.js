/**
 * Quiz Placeholder View
 * ---------------------
 * Temporary screen while v0.7 quiz gameplay is built step by step.
 */

const QuizPlaceholderView = (function () {
  const mainEl = document.querySelector(".page");

  let viewEl = null;
  let titleEl = null;
  let promptRowEl = null;
  let messageEl = null;
  let resultEl = null;
  let choicesWrapEl = null;
  let choicesEl = null;
  let listenBtn = null;
  let prevBtn = null;
  let nextBtn = null;
  let navRowEl = null;
  let progressRowEl = null;
  let progressFillEl = null;
  let progressCountEl = null;
  let backBtn = null;
  let currentHomework = null;
  let onBackCallback = null;
  let currentQuestion = null;
  let currentIndex = 0;
  let quizQuestions = [];
  let quizItems = [];

  function createView() {
    if (viewEl) {
      return;
    }

    viewEl = document.createElement("section");
    viewEl.id = "quiz-placeholder-view";
    viewEl.className = "view";
    viewEl.hidden = true;

    titleEl = document.createElement("h1");
    titleEl.className = "study-week-label";

    promptRowEl = document.createElement("div");
    promptRowEl.style.display = "flex";
    promptRowEl.style.alignItems = "center";
    promptRowEl.style.justifyContent = "center";
    promptRowEl.style.width = "100%";
    promptRowEl.style.marginBottom = "1rem";

    messageEl = document.createElement("p");
    messageEl.className = "placeholder-message";
    messageEl.style.fontSize = "1.25rem";
    messageEl.style.margin = "0";

    promptRowEl.appendChild(messageEl);

    choicesWrapEl = document.createElement("div");
    choicesWrapEl.style.position = "relative";
    choicesWrapEl.style.margin = "1rem 0 1.5rem";

    resultEl = document.createElement("p");
    resultEl.style.position = "absolute";
    resultEl.style.top = "0.5rem";
    resultEl.style.left = "50%";
    resultEl.style.transform = "translateX(-50%)";
    resultEl.style.zIndex = "2";
    resultEl.style.fontSize = "1.1rem";
    resultEl.style.fontWeight = "600";
    resultEl.style.margin = "0";
    resultEl.style.padding = "0.35rem 0.75rem";
    resultEl.style.borderRadius = "999px";
    resultEl.style.background = "rgba(255, 255, 255, 0.94)";
    resultEl.style.boxShadow = "0 1px 4px rgba(0, 0, 0, 0.12)";
    resultEl.hidden = true;

    choicesEl = document.createElement("div");
    choicesEl.style.display = "flex";
    choicesEl.style.gap = "1rem";
    choicesEl.style.justifyContent = "center";
    choicesEl.style.alignItems = "stretch";
    choicesEl.style.flexWrap = "wrap";

    choicesWrapEl.appendChild(resultEl);
    choicesWrapEl.appendChild(choicesEl);

    navRowEl = document.createElement("div");
    navRowEl.style.display = "grid";
    navRowEl.style.gridTemplateColumns = "56px minmax(0, auto) 56px";
    navRowEl.style.alignItems = "center";
    navRowEl.style.justifyContent = "center";
    navRowEl.style.gap = "0.75rem";
    navRowEl.style.width = "100%";
    navRowEl.style.maxWidth = "360px";
    navRowEl.style.marginBottom = "1rem";

    prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "study-arrow";
    prevBtn.textContent = "<";
    prevBtn.setAttribute("aria-label", "Previous quiz question");

    listenBtn = document.createElement("button");
    listenBtn.type = "button";
    listenBtn.className = "study-speak-button";
    listenBtn.textContent = "🔊 Listen";

    nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "study-arrow";
    nextBtn.textContent = ">";
    nextBtn.setAttribute("aria-label", "Next quiz question");

    navRowEl.appendChild(prevBtn);
    navRowEl.appendChild(listenBtn);
    navRowEl.appendChild(nextBtn);

    progressRowEl = document.createElement("div");
    progressRowEl.className = "study-position";

    const progressTrackEl = document.createElement("div");
    progressTrackEl.className = "study-position__track";

    progressFillEl = document.createElement("div");
    progressFillEl.className = "study-position__fill";
    progressTrackEl.appendChild(progressFillEl);

    progressCountEl = document.createElement("span");
    progressCountEl.className = "study-position__count";

    progressRowEl.appendChild(progressTrackEl);
    progressRowEl.appendChild(progressCountEl);

    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn--secondary study-nav-button";
    backBtn.textContent = "Back";

    viewEl.appendChild(titleEl);
    viewEl.appendChild(promptRowEl);
    viewEl.appendChild(choicesWrapEl);
    viewEl.appendChild(navRowEl);
    viewEl.appendChild(progressRowEl);
    viewEl.appendChild(backBtn);
    mainEl.appendChild(viewEl);

    listenBtn.addEventListener("click", function () {
      if (!currentQuestion || currentQuestion.questionType !== "listening") {
        return;
      }

      if (!("speechSynthesis" in window)) {
        console.error("[Quiz TTS] speechSynthesis is not supported in this browser.");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(currentQuestion.item.text);
      const koreanVoice = window.speechSynthesis.getVoices().find(function (voice) {
        return voice.lang && voice.lang.toLowerCase().startsWith("ko");
      }) || null;

      utterance.lang = "ko-KR";
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }

      window.speechSynthesis.cancel();
      setTimeout(function () {
        window.speechSynthesis.speak(utterance);
      }, 50);
    });

    prevBtn.addEventListener("click", function () {
      if (currentIndex <= 0) {
        return;
      }

      currentIndex -= 1;
      renderCurrentQuestion();
    });

    nextBtn.addEventListener("click", function () {
      if (nextBtn.disabled || currentIndex >= quizQuestions.length - 1) {
        return;
      }

      currentIndex += 1;
      renderCurrentQuestion();
    });

    backBtn.addEventListener("click", function () {
      if (onBackCallback && currentHomework) {
        onBackCallback(currentHomework);
      }
    });
  }

  function shuffleItems(items) {
    const shuffled = items.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    return shuffled;
  }

  function assignQuestionTypes(items) {
    const listeningCount = Math.round(items.length * 2 / 3);

    return items.map(function (item, index) {
      return {
        item: item,
        questionType: index < listeningCount ? "listening" : "speaking",
      };
    });
  }

  function getListeningChoices(correctItem, allItems) {
    const otherItems = shuffleItems(allItems.filter(function (item) {
      return item !== correctItem && item.image;
    })).slice(0, 2);

    return shuffleItems([correctItem].concat(otherItems));
  }

  function showResult(text, color) {
    resultEl.textContent = text;
    resultEl.style.color = color;
    resultEl.hidden = false;
  }

  function renderProgress() {
    if (quizQuestions.length === 0) {
      progressRowEl.hidden = true;
      return;
    }

    progressRowEl.hidden = false;
    progressFillEl.style.width = (((currentIndex + 1) / quizQuestions.length) * 100) + "%";
    progressCountEl.textContent = (currentIndex + 1) + " / " + quizQuestions.length;
  }

  function renderListeningQuestion(question) {
    messageEl.textContent = "Listen and choose the matching picture.";
    resultEl.hidden = true;
    resultEl.textContent = "";
    choicesEl.innerHTML = "";
    listenBtn.hidden = false;
    listenBtn.disabled = false;
    nextBtn.disabled = true;

    const choices = getListeningChoices(question.item, quizItems);

    choices.forEach(function (item) {
      const button = document.createElement("button");
      button.type = "button";
      button.style.width = "168px";
      button.style.minHeight = "205px";
      button.style.border = "1px solid #ddd";
      button.style.borderRadius = "12px";
      button.style.background = "white";
      button.style.padding = "0.5rem";
      button.style.cursor = "pointer";
      button.style.display = "flex";
      button.style.flexDirection = "column";
      button.style.alignItems = "center";
      button.style.justifyContent = "flex-start";

      const image = document.createElement("img");
      image.src = "assets/images/" + item.image;
      image.alt = "Quiz choice";
      image.style.width = "150px";
      image.style.height = "150px";
      image.style.objectFit = "contain";
      image.style.display = "block";

      const label = document.createElement("span");
      label.textContent = item.text;
      label.style.display = "block";
      label.style.width = "150px";
      label.style.marginTop = "0.45rem";
      label.style.lineHeight = "1.25";
      label.style.textAlign = "center";
      label.style.whiteSpace = "normal";
      label.style.overflowWrap = "break-word";
      label.style.fontSize = item.type === "sentence" ? "1.025rem" : "1.125rem";
      label.style.fontWeight = "600";

      button.appendChild(image);
      button.appendChild(label);
      choicesEl.appendChild(button);

      button.addEventListener("click", function () {
        const isCorrect = item === question.item;

        if (isCorrect) {
          button.style.border = "3px solid #2e7d32";
          showResult("✓ Correct!", "#2e7d32");

          Array.from(choicesEl.querySelectorAll("button")).forEach(function (choiceButton) {
            choiceButton.disabled = true;
            choiceButton.style.cursor = "default";
          });

          nextBtn.disabled = false;
        } else {
          button.style.border = "3px solid #c62828";
          showResult("Try again.", "#c62828");
        }
      });
    });

    console.log("[Quiz] listening choices:", choices);
  }

  function renderSpeakingPlaceholder(question) {
    resultEl.hidden = true;
    resultEl.textContent = "";
    choicesEl.innerHTML = "";
    listenBtn.hidden = true;
    listenBtn.disabled = true;
    nextBtn.disabled = false;
    messageEl.textContent = "speaking · " + question.item.text;
  }

  function updateNavigationButtons() {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === quizQuestions.length - 1;

    prevBtn.hidden = isFirst;
    prevBtn.disabled = isFirst;

    nextBtn.hidden = isLast;
    if (isLast) {
      nextBtn.disabled = true;
    }
  }

  function renderCurrentQuestion() {
    currentQuestion = quizQuestions[currentIndex] || null;

    if (!currentQuestion) {
      resultEl.hidden = true;
      resultEl.textContent = "";
      choicesEl.innerHTML = "";
      messageEl.textContent = "No quiz items.";
      prevBtn.hidden = true;
      listenBtn.hidden = true;
      nextBtn.hidden = true;
      progressRowEl.hidden = true;
      return;
    }

    if (currentQuestion.questionType === "listening") {
      renderListeningQuestion(currentQuestion);
    } else {
      renderSpeakingPlaceholder(currentQuestion);
    }

    updateNavigationButtons();
    renderProgress();
  }

  function show(homework, items) {
    createView();
    currentHomework = homework;
    titleEl.textContent = "Week " + homework.week + " · Quiz 🎯";

    quizItems = items.slice();
    const shuffledItems = shuffleItems(quizItems);
    quizQuestions = assignQuestionTypes(shuffledItems);
    currentIndex = 0;

    renderCurrentQuestion();
    console.log("[Quiz] questions:", quizQuestions);

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
