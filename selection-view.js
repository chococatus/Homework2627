/**
 * Selection View — Name Entry
 * ---------------------------
 * First visit asks for a name and stores it only on this device.
 */

const SelectionView = (function () {
  const viewEl = document.getElementById("selection-view");
  const formEl = document.getElementById("name-form");
  const inputEl = document.getElementById("student-name-input");

  let onStartCallback = null;

  function show() {
    inputEl.value = "";
    viewEl.hidden = false;
    setTimeout(function () {
      inputEl.focus();
    }, 0);
  }

  function hide() {
    viewEl.hidden = true;
  }

  function init(onStart) {
    onStartCallback = onStart;

    formEl.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = inputEl.value.trim();
      if (!name) {
        inputEl.focus();
        return;
      }

      saveStudentName(name);

      if (onStartCallback) {
        onStartCallback(name);
      }
    });
  }

  return { show, hide, init };
})();
