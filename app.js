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
}

function navigateToHome(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    return;
  }

  hideAllViews();
  HomeView.show(student);
  HomeView.init(function () {
    navigateToHomework({ week: 1, title: "Homework" });
  }, navigateToSelection);

  if (typeof loadHomeworkData === "function") {
    loadHomeworkData();
  }
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

function navigateToHomework(homework) {
  hideAllViews();
  PlaceholderView.show();
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
