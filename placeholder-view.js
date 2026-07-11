/**
 * Placeholder View — Temporary homework screen
 * --------------------------------------------
 * Shown when "Start This Week's Homework" is pressed.
 * Will be replaced with real homework content in a future version.
 */

const PlaceholderView = (function () {
  const viewEl = document.getElementById("placeholder-view");
  const backBtn = document.getElementById("placeholder-back-button");

  let onBackCallback = null;

  function show() {
    viewEl.hidden = false;
  }

  function hide() {
    viewEl.hidden = true;
  }

  function init(onBack) {
    onBackCallback = onBack;

    backBtn.addEventListener("click", function () {
      if (onBackCallback) {
        onBackCallback();
      }
    });
  }

  return { show, hide, init };
})();
