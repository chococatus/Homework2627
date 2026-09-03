(function () {
  const placeholderView = document.getElementById("placeholder-view");

  function updateSpeakingCompletionTitle() {
    if (!placeholderView) {
      return;
    }

    const englishEl = document.getElementById("study-completion-english");
    if (!englishEl || englishEl.hidden) {
      return;
    }

    const titleEl = placeholderView.querySelector(".view-title");
    if (!titleEl) {
      return;
    }

    const match = titleEl.textContent.match(/Week\s+(\d+)/i);
    if (match) {
      titleEl.textContent = "Week " + match[1] + " · Speaking";
    }
  }

  if (placeholderView) {
    const observer = new MutationObserver(updateSpeakingCompletionTitle);
    observer.observe(placeholderView, {
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden"],
      childList: true,
    });
  }
})();
