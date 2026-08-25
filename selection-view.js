/**
 * Selection View — "Who are you?"
 * --------------------------------
 * First-visit student picker.
 */

const SelectionView = (function () {
  const viewEl = document.getElementById("selection-view");
  const gridEl = document.getElementById("student-grid");

  let onStartCallback = null;

  function createStudentCard(student) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "student-card";
    card.dataset.studentId = student.id;
    card.setAttribute("aria-label", student.name);

    const name = document.createElement("span");
    name.className = "student-name";
    name.textContent = student.name;

    card.appendChild(createShapeIcon(student));
    card.appendChild(name);

    card.addEventListener("click", function () {
      saveSelectedStudent(student.id);

      if (onStartCallback) {
        onStartCallback(student.id);
      }
    });

    return card;
  }

  function renderGrid() {
    gridEl.innerHTML = "";
    STUDENTS.forEach(function (student) {
      gridEl.appendChild(createStudentCard(student));
    });
  }

  function show() {
    renderGrid();
    viewEl.hidden = false;
  }

  function hide() {
    viewEl.hidden = true;
  }

  function init(onStart) {
    onStartCallback = onStart;
  }

  return { show, hide, init };
})();
