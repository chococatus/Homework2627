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
  let nextBtn = null;
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
    titleEl.className = "view-title";

    promptRowEl = document.createElement("div");
    promptRowEl.style.display = "flex";
    promptRowEl.style.alignItems = "center";
    promptRowEl.style.justifyContent = "center";
    promptRowEl.style.gap = "0.75rem";
    promptRowEl.style.flexWrap = "wrap";
    promptRowEl.style.marginBottom = "1rem";

    messageEl = document.createElement("p");
    messageEl.className = "placeholder-message";
    messageEl.style.fontSize = "1.25rem";
    messageEl.style.margin = "0";

    listenBtn = document.createElement("button");
    listenBtn.type = "button";
    listenBtn.className = "btn btn--primary";
    listenBtn.textContent = "🔊 Listen";
    listenBtn.hidden = true;
    listenBtn.style.padding = "0.55rem 0.9rem";

    promptRowEl.appendChild(messageEl);
    promptRowEl.appendChild(listenBtn);

    choicesWrapEl = document.createElement("div");
    choicesWrapEl.style.position = "relative";
    choicesWrapEl.style.margin = "1rem 0 2rem";

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

    nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn btn--primary";
    nextBtn.textContent = "Next";
    nextBtn.hidden = true;

    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn--secondary";
    backBtn.textContent = "Back";

    viewEl.appendChild(titleEl);
    viewEl.appendChild(promptRowEl);
    viewEl.appendChild(choicesWrapEl);
    viewEl.appendChild(nextBtn);
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

    nextBtn.addEventListener("click", function () {
      if (currentIndex >= quizQuestions.length - 1) {
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

  function renderListeningQuestion(question) {
    messageEl.textContent =
      (currentIndex + 1) + " / " + quizQuestions.length +
      " · Listen and choose the matching picture.";
    resultEl.hidden = true;
    resultEl.textContent = "";
    listenBtn.hidden = false;
    nextBtn.hidden = true;
    choicesEl.innerHTML = "";

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
      label.style.fontSize = item.type === "sentence" ? "0.9rem" : "1rem";
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

          nextBtn.hidden = currentIndex === quizQuestions.length - 1;
        } else {
          button.style.border = "3px solid #c62828";
          showResult("Try again.", "#c62828");
        }
      });
    });

    console.log("[Quiz] listening choices:", choices);
  }

  function renderSpeakingPlaceholder(question) {
    listenBtn.hidden = true;
    nextBtn.hidden = true;
    resultEl.hidden = true;
    resultEl.textContent = "";
    choicesEl.innerHTML = "";
    messageEl.textContent =
      (currentIndex + 1) + " / " + quizQuestions.length +
      " · speaking · " + question.item.text;
  }

  function renderCurrentQuestion() {
    currentQuestion = quizQuestions[currentIndex] || null;

    if (!currentQuestion) {
      listenBtn.hidden = true;
      nextBtn.hidden = true;
      resultEl.hidden = true;
      resultEl.textContent = "";
      choicesEl.innerHTML = "";
      messageEl.textContent = "No quiz items.";
      return;
    }

    if (currentQuestion.questionType === "listening") {
      renderListeningQuestion(currentQuestion);
    } else {
      renderSpeakingPlaceholder(currentQuestion);
    }
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
