/**
 * Korean Homework App — Navigation
 * --------------------------------
 * Connects the views together. Data lives in separate files
 * (students.js, homework.js, progress.js) so Google Sheets
 * can replace them later without touching this file.
 */

// --- View management ---

const ALL_VIEWS = [
  SelectionView,
  WelcomeView,
  HomeView,
  WeekSectionView,
  StoryView,
  PlaceholderView,
];

function hideAllViews() {
  ALL_VIEWS.forEach(function (view) {
    view.hide();
  });
  StudyPosition.hide();
}

function navigateToHome(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    return;
  }

  hideAllViews();
  HomeView.show(student);
}

function navigateToSelection() {
  clearSelectedStudent();
  hideAllViews();
  SelectionView.show();
}

function navigateToWelcome(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    SelectionView.show();
    return;
  }

  hideAllViews();
  WelcomeView.show(student);
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

  console.log(
    "[Story] week:",
    homework.week,
    "items:",
    storyItems.length,
    storyItems
  );

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

// --- Wire up view callbacks ---

SelectionView.init(navigateToHome);

WelcomeView.init(navigateToHome, navigateToSelection);

HomeView.init(navigateToWeekSection, navigateToSelection);

WeekSectionView.init(
  navigateToStory,
  navigateToSpeaking,
  function () {
    const savedId = getSavedStudentId();
    if (savedId) {
      navigateToHome(savedId);
    } else {
      navigateToSelection();
    }
  }
);

StoryView.init(function (homework) {
  navigateToWeekSection(homework);
});

PlaceholderView.init(function () {
  const savedId = getSavedStudentId();
  if (savedId) {
    navigateToHome(savedId);
  } else {
    navigateToSelection();
  }
});

// --- App startup ---

async function init() {
  await loadStudentsData();

  const savedId = getSavedStudentId();
  const savedStudent = savedId ? getStudentById(savedId) : null;

  hideAllViews();

  if (savedStudent) {
    WelcomeView.show(savedStudent);
  } else {
    SelectionView.show();
  }
}

init();
