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

async function navigateToHomework(homework) {
  await loadWordsData();

  const weekWords = getWordsByWeek(homework.week);

  console.log(
    "[Homework Words] week:",
    homework.week,
    "items:",
    weekWords.length,
    weekWords
  );

  hideAllViews();
  PlaceholderView.show(homework, weekWords);
  StudyPosition.show(weekWords.length);
}

// --- Wire up view callbacks ---

SelectionView.init(navigateToHome);

WelcomeView.init(navigateToHome, navigateToSelection);

HomeView.init(navigateToHomework, navigateToSelection);

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
