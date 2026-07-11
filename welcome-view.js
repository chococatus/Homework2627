/**
 * Welcome View — "Welcome back!"
 * ------------------------------
 * Shown on return visits before the student enters the Home screen.
 */

const WelcomeView = (function () {
  const viewEl = document.getElementById("welcome-view");
  const studentEl = document.getElementById("welcome-student");
  const startBtn = document.getElementById("welcome-start-button");
  const changeBtn = document.getElementById("change-student-button");

  let onStartCallback = null;
  let onChangeStudentCallback = null;

  function renderStudent(student) {
    studentEl.innerHTML = "";

    const icon = createShapeIcon(student);
    const name = document.createElement("span");
    name.className = "student-name";
    name.textContent = student.name;

    studentEl.appendChild(icon);
    studentEl.appendChild(name);
  }

  function show(student) {
    renderStudent(student);
    viewEl.hidden = false;
  }

  function hide() {
    viewEl.hidden = true;
  }

  function init(onStart, onChangeStudent) {
    onStartCallback = onStart;
    onChangeStudentCallback = onChangeStudent;

    startBtn.addEventListener("click", function () {
      const savedId = getSavedStudentId();
      if (savedId && onStartCallback) {
        onStartCallback(savedId);
      }
    });

    changeBtn.addEventListener("click", function () {
      if (onChangeStudentCallback) {
        onChangeStudentCallback();
      }
    });
  }

  return { show, hide, init };
})();
