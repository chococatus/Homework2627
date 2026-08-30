/**
 * Korean Homework App — Navigation
 * --------------------------------
 * Connects the views together.
 */

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
  StudyPosition.show(speakingItems.length);
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
