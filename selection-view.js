/**
 * Selection View — "Who are you?"
 * --------------------------------
 * First-visit student picker. Logic unchanged from v0.2.
 */

const SelectionView = (function () {
  const viewEl = document.getElementById("selection-view");
  const gridEl = document.getElementById("student-grid");
  const startBtn = document.getElementById("start-button");

  let selectedStudentId = null;
  let onStartCallback = null;

  function createStudentCard(student) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "student-card";
    card.dataset.studentId = student.id;
    card.setAttribute("aria-label", student.name);

    const check = document.createElement("span");
    check.className = "student-card__check";
    check.textContent = "✓";
    check.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "student-name";
    name.textContent = student.name;

    card.appendChild(check);
    card.appendChild(createShapeIcon(student));
    card.appendChild(name);

    card.addEventListener("click", function () {
      selectStudentCard(student.id);
    });

    return card;
  }

  function selectStudentCard(studentId) {
    selectedStudentId = studentId;

    gridEl.querySelectorAll(".student-card").forEach(function (card) {
      card.classList.toggle("is-selected", card.dataset.studentId === studentId);
    });

    saveSelectedStudent(studentId);
    startBtn.disabled = false;
  }

  function renderGrid() {
    gridEl.innerHTML = "";
    STUDENTS.forEach(function (student) {
      gridEl.appendChild(createStudentCard(student));
    });
  }

  function show() {
    selectedStudentId = null;
    startBtn.disabled = true;
    renderGrid();
    viewEl.hidden = false;
  }

  function hide() {
    viewEl.hidden = true;
  }

  function init(onStart) {
    onStartCallback = onStart;

    startBtn.addEventListener("click", function () {
      const studentId = selectedStudentId || getSavedStudentId();
      if (studentId) {
        saveSelectedStudent(studentId);
        if (onStartCallback) {
          onStartCallback(studentId);
        }
      }
    });
  }

  return { show, hide, init };
})();
