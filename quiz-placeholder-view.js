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
  let resultEl = null;
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

    messageEl = document.createElement("p");
    messageEl.className = "placeholder-message";
    messageEl.style.fontSize = "1.25rem";
    messageEl.style.marginBottom = "1rem";

    resultEl = document.createElement("p");
    resultEl.style.fontSize = "1.25rem";
    resultEl.style.fontWeight = "600";
    resultEl.style.minHeight = "1.5em";
    resultEl.style.margin = "0.75rem 0";

    listenBtn = document.createElement("button");
    listenBtn.type = "button";
    listenBtn.className = "btn btn--primary";
    listenBtn.textContent = "🔊 Listen";
    listenBtn.hidden = true;

    choicesEl = document.createElement("div");
    choicesEl.style.display = "flex";
    choicesEl.style.gap = "1rem";
    choicesEl.style.justifyContent = "center";
    choicesEl.style.flexWrap = "wrap";
    choicesEl.style.margin = "1.5rem 0 2rem";

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
    viewEl.appendChild(messageEl);
    viewEl.appendChild(listenBtn);
    viewEl.appendChild(resultEl);
    viewEl.appendChild(choicesEl);
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

  function renderListeningQuestion(question) {
    messageEl.textContent =
      (currentIndex + 1) + " / " + quizQuestions.length +
      " · Listen and choose the picture.";
    resultEl.textContent = "";
    listenBtn.hidden = false;
    nextBtn.hidden = true;
    choicesEl.innerHTML = "";

    const choices = getListeningChoices(question.item, quizItems);

    choices.forEach(function (item) {
      const button = document.createElement("button");
      button.type = "button";
      button.style.border = "1px solid #ddd";
      button.style.borderRadius = "12px";
      button.style.background = "white";
      button.style.padding = "0.5rem";
      button.style.cursor = "pointer";

      const image = document.createElement("img");
      image.src = "assets/images/" + item.image;
      image.alt = "Quiz choice";
      image.style.width = "150px";
      image.style.height = "150px";
      image.style.objectFit = "contain";
      image.style.display = "block";

      button.appendChild(image);
      choicesEl.appendChild(button);

      button.addEventListener("click", function () {
        const isCorrect = item === question.item;

        if (isCorrect) {
          button.style.border = "3px solid #2e7d32";
          resultEl.textContent = "✓ Correct!";
          resultEl.style.color = "#2e7d32";

          Array.from(choicesEl.querySelectorAll("button")).forEach(function (choiceButton) {
            choiceButton.disabled = true;
            choiceButton.style.cursor = "default";
          });

          nextBtn.hidden = currentIndex === quizQuestions.length - 1;
        } else {
          button.style.border = "3px solid #c62828";
          resultEl.textContent = "Try again.";
          resultEl.style.color = "#c62828";
        }
      });
    });

    console.log("[Quiz] listening choices:", choices);
  }

  function renderSpeakingPlaceholder(question) {
    listenBtn.hidden = true;
    nextBtn.hidden = true;
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
