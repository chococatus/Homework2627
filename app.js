/**
 * Korean Homework App — Navigation
 * --------------------------------
 * Connects the views together.
 */

// Set to true when browser console debug logs are needed.
const DEBUG = false;
if (!DEBUG) {
  console.log = function () {};
}

const ALL_VIEWS = [
  SelectionView,
  WelcomeView,
  HomeView,
  WeekSectionView,
  StoryView,
  QuizPlaceholderView,
  PlaceholderView,
];

function hideAllViews() {
  ALL_VIEWS.forEach(function (view) {
    view.hide();
  });
  StudyPosition.hide();
}

function navigateToHome(name) {
  if (!name) {
    return;
  }

  hideAllViews();
  HomeView.show(name);
}

function navigateToSelection() {
  clearStudentName();
  hideAllViews();
  SelectionView.show();
}

function navigateToWelcome(name) {
  if (!name) {
    SelectionView.show();
    return;
  }

  hideAllViews();
  WelcomeView.show(name);
}

async function navigateToWeekSection(homework) {
  await loadWordsData();

  const weekItems = getWordsByWeek(homework.week);
  const hasStory = weekItems.some(function (item) {
    return item.type === "story";
  });

  hideAllViews();
  WeekSectionView.show(homework, hasStory);
}

async function navigateToStory(homework) {
  await loadWordsData();

  const storyItems = getWordsByWeek(homework.week).filter(function (item) {
    return item.type === "story";
  });

  console.log("[Story] week:", homework.week, "items:", storyItems.length, storyItems);

  hideAllViews();
  StoryView.show(homework, storyItems);
}

async function navigateToSpeaking(homework) {
  await loadWordsData();

  const speakingItems = getWordsByWeek(homework.week).filter(function (item) {
    return item.type === "word" || item.type === "sentence";
  });

  console.log(
    "[Speaking Practice] week:",
    homework.week,
    "items:",
    speakingItems.length,
    speakingItems
  );

  hideAllViews();
  PlaceholderView.show(homework, speakingItems);
  document.querySelector("#placeholder-view .view-title").textContent =
    "Week " + homework.week + " · Speaking";
  StudyPosition.show(speakingItems.length, homework);
}

async function navigateToQuiz(homework) {
  await loadWordsData();

  const quizItems = getWordsByWeek(homework.week).filter(function (item) {
    return item.type === "word" || item.type === "sentence";
  });

  console.log("[Quiz] week:", homework.week, "items:", quizItems.length, quizItems);

  hideAllViews();
  QuizPlaceholderView.show(homework, quizItems);
}

function saveQuizProgressFromView(homework) {
  const segments = Array.from(
    document.querySelectorAll("#quiz-placeholder-view .study-position__segment")
  );

  if (!homework || segments.length === 0) {
    return;
  }

  const allCorrect = segments.every(function (segment) {
    return segment.classList.contains("study-position__segment--correct");
  });
  const allAttempted = segments.every(function (segment) {
    return !segment.classList.contains("study-position__segment--unattempted");
  });

  if (allCorrect) {
    saveActivityProgress(homework.week, "quiz", "correct");
  } else if (allAttempted) {
    saveActivityProgress(homework.week, "quiz", "attempted");
  }
}

function navigateToSavedHome() {
  const savedName = getSavedStudentName();

  if (savedName) {
    navigateToHome(savedName);
  } else {
    hideAllViews();
    SelectionView.show();
  }
}

SelectionView.init(navigateToHome);
WelcomeView.init(navigateToHome, navigateToSelection);
HomeView.init(navigateToWeekSection, navigateToSelection);

WeekSectionView.init(
  navigateToStory,
  navigateToSpeaking,
  navigateToQuiz,
  navigateToSavedHome
);

StoryView.init(function (homework) {
  navigateToWeekSection(homework);
});

QuizPlaceholderView.init(function (homework) {
  saveQuizProgressFromView(homework);
  navigateToWeekSection(homework);
});

PlaceholderView.init(function (homework) {
  navigateToWeekSection(homework);
});

const siteHomeButton = document.getElementById("site-home-button");
siteHomeButton.addEventListener("click", navigateToSavedHome);

function init() {
  const savedName = getSavedStudentName();

  hideAllViews();

  if (savedName) {
    navigateToWelcome(savedName);
  } else {
    SelectionView.show();
  }
}

init();
