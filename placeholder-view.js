/**
 * Homework View — Week word preview
 * ---------------------------------
 * Shows one word/sentence item at a time for the selected week.
 */

const PlaceholderView = (function () {
  const viewEl = document.getElementById("placeholder-view");
  const titleEl = document.querySelector("#placeholder-view .view-title");
  const messageEl = document.querySelector("#placeholder-view .placeholder-message");
  const backBtn = document.getElementById("placeholder-back-button");

  let onBackCallback = null;
  let items = [];
  let currentIndex = 0;
  let imageEl = null;
  let imageRowEl = null;
  let prevBtn = null;
  let nextBtn = null;
  let speakBtn = null;
  let voiceRowEl = null;
  let recognitionBtn = null;
  let replayBtn = null;
  let resultEl = null;
  let recognition = null;
  let mediaRecorder = null;
  let recordingStream = null;
  let recordingChunks = [];
  let recordingUrl = null;

  function getKoreanVoice() {
    if (!("speechSynthesis" in window)) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();

    return voices.find(function (voice) {
      return voice.lang && voice.lang.toLowerCase().startsWith("ko");
    }) || null;
  }

  function speakCurrentItem() {
    if (items.length === 0) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.error("[TTS] speechSynthesis is not supported in this browser.");
      return;
    }

    const item = items[currentIndex];
    const utterance = new SpeechSynthesisUtterance(item.text);
    const koreanVoice = getKoreanVoice();

    utterance.lang = "ko-KR";

    if (koreanVoice) {
      utterance.voice = koreanVoice;
      console.log("[TTS] voice:", koreanVoice.name, koreanVoice.lang);
    } else {
      console.warn("[TTS] No Korean voice found. Using the browser default voice with ko-KR.");
    }

    utterance.onstart = function () {
      console.log("[TTS] started:", item.text);
    };

    utterance.onerror = function (event) {
      console.error("[TTS] error:", event.error);
    };

    window.speechSynthesis.cancel();

    setTimeout(function () {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }

  function getSpeechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function normalizeComparisonText(text) {
    return String(text || "")
      .normalize("NFC")
      .replace(/[\s.,!?;:'"“”‘’…·~\-_/\\()[\]{}]/g, "");
  }

  function cleanDisplayTranscript(text) {
    return String(text || "")
      .normalize("NFC")
      .replace(/[.,!?;:'"“”‘’…·~\-_/\\()[\]{}]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function compareTargetToHeard(target, heard) {
    const targetChars = Array.from(target);
    const heardChars = Array.from(heard);
    const rows = targetChars.length + 1;
    const cols = heardChars.length + 1;
    const matrix = Array.from({ length: rows }, function () {
      return Array(cols).fill(0);
    });

    for (let i = 0; i < rows; i += 1) {
      matrix[i][0] = i;
    }

    for (let j = 0; j < cols; j += 1) {
      matrix[0][j] = j;
    }

    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        const substitutionCost = targetChars[i - 1] === heardChars[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + substitutionCost
        );
      }
    }

    const targetMatches = Array(targetChars.length).fill(true);
    const heardMatches = Array(heardChars.length).fill(true);
    let i = targetChars.length;
    let j = heardChars.length;

    while (i > 0 || j > 0) {
      if (
        i > 0 &&
        j > 0 &&
        targetChars[i - 1] === heardChars[j - 1] &&
        matrix[i][j] === matrix[i - 1][j - 1]
      ) {
        i -= 1;
        j -= 1;
        continue;
      }

      if (i > 0 && j > 0 && matrix[i][j] === matrix[i - 1][j - 1] + 1) {
        targetMatches[i - 1] = false;
        heardMatches[j - 1] = false;
        i -= 1;
        j -= 1;
        continue;
      }

      if (i > 0 && matrix[i][j] === matrix[i - 1][j] + 1) {
        targetMatches[i - 1] = false;
        i -= 1;
        continue;
      }

      if (j > 0) {
        heardMatches[j - 1] = false;
        j -= 1;
      }
    }

    return {
      distance: matrix[targetChars.length][heardChars.length],
      targetChars: targetChars,
      targetMatches: targetMatches,
      heardChars: heardChars,
      heardMatches: heardMatches,
    };
  }

  function clearRecognitionResult() {
    if (resultEl) {
      resultEl.innerHTML = "";
      resultEl.hidden = true;
      resultEl.classList.remove("is-match", "needs-practice");
    }
  }

  function renderRecognitionResult(transcript) {
    if (!resultEl || items.length === 0) {
      return;
    }

    const target = normalizeComparisonText(items[currentIndex].text);
    const heard = normalizeComparisonText(transcript);
    const displayHeard = cleanDisplayTranscript(transcript);
    const comparison = compareTargetToHeard(target, heard);
    const isMatch = comparison.distance === 0;

    resultEl.innerHTML = "";
    resultEl.hidden = false;
    resultEl.classList.toggle("is-match", isMatch);
    resultEl.classList.toggle("needs-practice", !isMatch);

    const resultLine = document.createElement("p");
    resultLine.className = "study-result-line";

    const label = document.createElement("span");
    label.className = "study-result-label";
    label.textContent = "I heard: ";
    resultLine.appendChild(label);

    let heardIndex = 0;
    Array.from(displayHeard).forEach(function (char) {
      if (/\s/.test(char)) {
        resultLine.appendChild(document.createTextNode(char));
        return;
      }

      const span = document.createElement("span");
      span.textContent = char;
      span.className = comparison.heardMatches[heardIndex]
        ? "study-result-match"
        : "study-result-mismatch";
      resultLine.appendChild(span);
      heardIndex += 1;
    });

    if (isMatch) {
      const icon = document.createElement("span");
      icon.className = "study-result-success-icon";
      icon.textContent = " ✓";
      icon.setAttribute("aria-label", "Correct");
      resultLine.appendChild(icon);
    }

    resultEl.appendChild(resultLine);
  }

  function clearTemporaryRecording() {
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
      recordingUrl = null;
    }

    recordingChunks = [];

    if (replayBtn) {
      replayBtn.hidden = true;
    }
  }

  function stopRecordingStream() {
    if (recordingStream) {
      recordingStream.getTracks().forEach(function (track) {
        track.stop();
      });
      recordingStream = null;
    }
  }

  function stopTemporaryRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
      stopRecordingStream();
    }
  }

  async function startTemporaryRecording() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || !("MediaRecorder" in window)) {
      console.warn("[Recording] Temporary recording is not supported in this browser.");
      return false;
    }

    clearTemporaryRecording();

    try {
      recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingChunks = [];
      mediaRecorder = new MediaRecorder(recordingStream);

      mediaRecorder.ondataavailable = function (event) {
        if (event.data && event.data.size > 0) {
          recordingChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = function () {
        if (recordingChunks.length > 0) {
          const blob = new Blob(recordingChunks, { type: mediaRecorder.mimeType || "audio/webm" });
          recordingUrl = URL.createObjectURL(blob);
          replayBtn.hidden = false;
          console.log("[Recording] ready for replay");
        }

        stopRecordingStream();
      };

      mediaRecorder.start();
      console.log("[Recording] started");
      return true;
    } catch (error) {
      console.error("[Recording] could not start:", error);
      stopRecordingStream();
      return false;
    }
  }

  function replayTemporaryRecording() {
    if (!recordingUrl) {
      return;
    }

    const audio = new Audio(recordingUrl);
    audio.play().catch(function (error) {
      console.error("[Recording] replay failed:", error);
    });
  }

  async function startSpeechRecognition() {
    if (items.length === 0) {
      return;
    }

    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();

    if (!SpeechRecognitionConstructor) {
      console.error("[Speech Recognition] Speech recognition is not supported in this browser.");
      return;
    }

    clearRecognitionResult();
    await startTemporaryRecording();

    if (!recognition) {
      recognition = new SpeechRecognitionConstructor();
      recognition.lang = "ko-KR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = function () {
        recognitionBtn.textContent = "🎤 Listening...";
        recognitionBtn.disabled = true;
        console.log("[Speech Recognition] started");
      };

      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        console.log("[Speech Recognition] result:", transcript);
        renderRecognitionResult(transcript);
      };

      recognition.onerror = function (event) {
        console.error("[Speech Recognition] error:", event.error);
      };

      recognition.onend = function () {
        stopTemporaryRecording();
        recognitionBtn.textContent = "🎤 Speak";
        recognitionBtn.disabled = false;
        console.log("[Speech Recognition] ended");
      };
    }

    try {
      recognition.start();
    } catch (error) {
      stopTemporaryRecording();
      console.error("[Speech Recognition] could not start:", error);
    }
  }

  function ensureControls() {
    titleEl.classList.add("study-week-label");
    messageEl.classList.add("study-text");
    backBtn.classList.add("study-nav-button");

    if (!imageRowEl) {
      imageRowEl = document.createElement("div");
      imageRowEl.className = "study-image-row";
      messageEl.insertAdjacentElement("beforebegin", imageRowEl);
    }

    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.className = "study-arrow";
      prevBtn.type = "button";
      prevBtn.textContent = "<";
      prevBtn.setAttribute("aria-label", "Previous item");
      imageRowEl.appendChild(prevBtn);

      prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
          currentIndex -= 1;
          clearTemporaryRecording();
          clearRecognitionResult();
          renderCurrentItem();
        }
      });
    }

    if (!imageEl) {
      imageEl = document.createElement("img");
      imageEl.className = "study-image";
      imageEl.alt = "";
      imageRowEl.appendChild(imageEl);
    }

    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.className = "study-arrow";
      nextBtn.type = "button";
      nextBtn.textContent = ">";
      nextBtn.setAttribute("aria-label", "Next item");
      imageRowEl.appendChild(nextBtn);

      nextBtn.addEventListener("click", function () {
        if (currentIndex < items.length - 1) {
          currentIndex += 1;
          clearTemporaryRecording();
          clearRecognitionResult();
          renderCurrentItem();
        }
      });
    }

    if (!speakBtn) {
      speakBtn = document.createElement("button");
      speakBtn.className = "study-speak-button";
      speakBtn.type = "button";
      speakBtn.textContent = "🔊 Listen";
      speakBtn.setAttribute("aria-label", "Listen to this Korean text");
      messageEl.insertAdjacentElement("afterend", speakBtn);

      speakBtn.addEventListener("click", speakCurrentItem);
    }

    if (!voiceRowEl) {
      voiceRowEl = document.createElement("div");
      voiceRowEl.className = "study-voice-row";
      speakBtn.insertAdjacentElement("afterend", voiceRowEl);
    }

    if (!recognitionBtn) {
      recognitionBtn = document.createElement("button");
      recognitionBtn.className = "study-recognition-button";
      recognitionBtn.type = "button";
      recognitionBtn.textContent = "🎤 Speak";
      recognitionBtn.setAttribute("aria-label", "Speak this Korean text");
      voiceRowEl.appendChild(recognitionBtn);

      recognitionBtn.addEventListener("click", startSpeechRecognition);
    }

    if (!replayBtn) {
      replayBtn = document.createElement("button");
      replayBtn.className = "study-replay-button";
      replayBtn.type = "button";
      replayBtn.textContent = "▶ My Voice";
      replayBtn.setAttribute("aria-label", "Replay my recorded voice");
      replayBtn.hidden = true;
      voiceRowEl.appendChild(replayBtn);

      replayBtn.addEventListener("click", replayTemporaryRecording);
    }

    if (!resultEl) {
      resultEl = document.createElement("div");
      resultEl.className = "study-recognition-result";
      resultEl.hidden = true;
      voiceRowEl.insertAdjacentElement("afterend", resultEl);
    }
  }

  function renderCurrentItem() {
    ensureControls();

    if (items.length === 0) {
      messageEl.textContent = "No study items for this week yet.";
      imageEl.hidden = true;
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      speakBtn.hidden = true;
      recognitionBtn.hidden = true;
      replayBtn.hidden = true;
      clearRecognitionResult();
      return;
    }

    const item = items[currentIndex];

    messageEl.textContent = item.text;

    if (item.image) {
      imageEl.src = "assets/images/" + item.image;
      imageEl.alt = item.text;
      imageEl.hidden = false;
    } else {
      imageEl.hidden = true;
    }

    prevBtn.hidden = currentIndex === 0;
    nextBtn.hidden = currentIndex === items.length - 1;
    speakBtn.hidden = false;
    speakBtn.disabled = !("speechSynthesis" in window);
    recognitionBtn.hidden = false;
    recognitionBtn.disabled = !getSpeechRecognitionConstructor();
  }

  function show(homework, weekItems) {
    items = Array.isArray(weekItems) ? weekItems : [];
    currentIndex = 0;
    clearTemporaryRecording();
    clearRecognitionResult();
    titleEl.textContent = "Week " + homework.week + " — " + homework.title;
    renderCurrentItem();
    viewEl.hidden = false;
  }

  function hide() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (recognition) {
      try {
        recognition.abort();
      } catch (error) {
        console.warn("[Speech Recognition] abort failed:", error);
      }
    }

    stopTemporaryRecording();
    clearTemporaryRecording();
    clearRecognitionResult();
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