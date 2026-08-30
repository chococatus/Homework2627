/**
 * Selection View — Name Entry
 * ---------------------------
 * First visit asks for a name and stores it only on this device.
 */

const SelectionView = (function () {
  const viewEl = document.getElementById("selection-view");
  const formEl = document.getElementById("name-form");
  const inputEl = document.getElementById("student-name-input");
  const listenBtn = document.getElementById("name-prompt-listen-button");

  let onStartCallback = null;

  function speakNamePrompt() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance("이름이 뭐예요?");
    utterance.lang = "ko-KR";

    const koreanVoice = window.speechSynthesis.getVoices().find(function (voice) {
      return voice.lang && voice.lang.toLowerCase().startsWith("ko");
    });

    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    window.speechSynthesis.cancel();
    setTimeout(function () {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }

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

    listenBtn.addEventListener("click", speakNamePrompt);

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
