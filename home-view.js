/**
 * Home View — Student Dashboard
 * -----------------------------
 * Main screen after "Start Homework". Shows progress, homework list,
 * and the primary action button.
 */

const HomeView = (function () {
  const viewEl = document.getElementById("home-view");
  const studentEl = document.getElementById("home-student");
  const starsRowEl = document.getElementById("stars-row");
  const starsCountEl = document.getElementById("stars-count");
  const homeworkListEl = document.getElementById("homework-list");
  const changeBtn = document.getElementById("home-change-student-button");

  let onStartWeekCallback = null;
  let onChangeStudentCallback = null;

  /** Map display status to the icon shown beside each homework row. */
  const STATUS_ICONS = {
    completed:   "★",
    started:     "☆",
    //current:     "▶",
    not_started: " ",
  };

  /**
   * Build the row of semester stars (filled ★ vs empty ☆).
   * @param {number} earned
   * @param {number} total
   */
  function renderStarsRow(earned, total) {
    starsRowEl.innerHTML = "";
    starsRowEl.setAttribute("aria-label", earned + " of " + total + " stars earned");

    for (let i = 1; i <= total; i++) {
      const star = document.createElement("span");
      star.className = "star " + (i <= earned ? "star--filled" : "star--empty");
      star.textContent = i <= earned ? "★" : "☆";
      star.setAttribute("aria-hidden", "true");
      starsRowEl.appendChild(star);
    }

    starsCountEl.textContent = earned + " / " + total + " Stars";
  }

  /**
   * Build one homework list row.
   * @param {object} homework — { week, title }
   * @param {string} displayStatus
   */
  function createHomeworkItem(homework, displayStatus, onClick) {
    const item = document.createElement("li");
    item.className = "homework-item homework-item--" + displayStatus;

    const icon = document.createElement("span");
    icon.className = "homework-item__icon";
    icon.textContent = STATUS_ICONS[displayStatus];
    icon.setAttribute("aria-hidden", "true");

    const week = document.createElement("span");
    week.className = "homework-item__week";
    week.textContent = "Week " + homework.week;

    const title = document.createElement("span");
    title.className = "homework-item__title";
    title.textContent = homework.title;

    item.appendChild(icon);
    item.appendChild(week);
    item.appendChild(title);

    item.style.cursor = "pointer";

    item.addEventListener("click", function () {
      if (onClick) {
        onClick(homework);
      }
    });

    return item;
  }

  /**
   * Render the list of published homework with per-student status icons.
   * @param {string} studentId
   */
  function renderHomeworkList(studentId) {
    homeworkListEl.innerHTML = "";

    const items = getPublishedHomework()
      .slice()
      .reverse();

    items.forEach(function (homework) {
      const status = getWeekProgress(studentId, homework.week);
      homeworkListEl.appendChild(createHomeworkItem(homework, status, function () {
        if (onStartWeekCallback) {
          onStartWeekCallback(homework);
        }
      }));
    });
  }

  function renderStudent(student) {
    studentEl.innerHTML = "";

    const icon = createShapeIcon(student, "shape-icon--large");
    const name = document.createElement("span");
    name.className = "student-name";
    name.textContent = student.name;

    studentEl.appendChild(icon);
    studentEl.appendChild(name);
  }

  /**
   * Populate the entire Home screen for a student.
   * @param {object} student
   */
  let currentStudent = null;

  function render(student) {
    currentStudent = student;
    renderStudent(student);

    const earned = getStarsEarnedWithFallback(student.id);
    renderStarsRow(earned, TOTAL_SEMESTER_STARS);
    renderHomeworkList(student.id);
  }

  function show(student) {
    currentStudent = student;
    render(student);
    viewEl.hidden = false;
  }

  function hide() {
    viewEl.hidden = true;
  }

  function init(onStartWeek, onChangeStudent) {
    onStartWeekCallback = onStartWeek;
    onChangeStudentCallback = onChangeStudent;

    changeBtn.addEventListener("click", function () {
      if (onChangeStudentCallback) {
        onChangeStudentCallback();
      }
    });

    loadHomeworkData().then(function () {
      if (viewEl.hidden === false && currentStudent) {
        render(currentStudent);
      }
    });
  }

  return { show, hide, init };
})();
