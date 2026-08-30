/**
 * Home View
 * ---------
 * Shows the saved local name and the published homework list.
 */

const HomeView = (function () {
  const viewEl = document.getElementById("home-view");
  const studentEl = document.getElementById("home-student");
  const homeworkListEl = document.getElementById("homework-list");
  const changeBtn = document.getElementById("home-change-student-button");

  let onStartWeekCallback = null;
  let onChangeStudentCallback = null;

  function createHomeworkItem(homework, onClick) {
    const item = document.createElement("li");
    item.className = "homework-item";

    const week = document.createElement("span");
    week.className = "homework-item__week";
    week.textContent = "Week " + homework.week;

    const title = document.createElement("span");
    title.className = "homework-item__title";
    title.textContent = homework.title;

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

  function renderHomeworkList() {
    homeworkListEl.innerHTML = "";

    getPublishedHomework()
      .slice()
      .reverse()
      .forEach(function (homework) {
        homeworkListEl.appendChild(createHomeworkItem(homework, function () {
          if (onStartWeekCallback) {
            onStartWeekCallback(homework);
          }
        }));
      });
  }

  function render(name) {
    studentEl.textContent = name;
    renderHomeworkList();
  }

  function show(name) {
    render(name);
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
      if (viewEl.hidden === false) {
        const savedName = getSavedStudentName();
        if (savedName) {
          render(savedName);
        }
      }
    });
  }

  return { show, hide, init };
})();
