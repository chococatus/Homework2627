const SpeechMatch = (function () {
  function normalize(text) {
    return String(text || "")
      .normalize("NFC")
      .replace(/[\s.,!?;:'"“”‘’…·~\-_/\\()[\]{}]/g, "");
  }

  function editDistance(left, right) {
    const a = Array.from(left);
    const b = Array.from(right);
    const rows = a.length + 1;
    const cols = b.length + 1;
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
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + substitutionCost
        );
      }
    }

    return matrix[a.length][b.length];
  }

  function isMatch(targetText, heardText) {
    const target = normalize(targetText);
    const heard = normalize(heardText);
    const targetChars = Array.from(target);
    const heardChars = Array.from(heard);

    if (targetChars.length === 0 || heardChars.length === 0) {
      return false;
    }

    // Single-character practice stays forgiving because speech recognition
    // often adds filler around a short Korean sound.
    if (targetChars.length === 1) {
      return heardChars.includes(targetChars[0]);
    }

    // Exact target anywhere in the recognized phrase is always accepted.
    if (heard.includes(target)) {
      return true;
    }

    // Two-character words are too short for a one-syllable substitution rule:
    // e.g. 아이 vs 아야 would otherwise count as correct. Require an exact match.
    if (targetChars.length === 2) {
      return false;
    }

    // For 3+ characters, allow one insertion or substitution within a
    // target-sized fragment, while still rejecting shortened answers.
    const minLength = targetChars.length;
    const maxLength = targetChars.length + 1;

    for (let length = minLength; length <= maxLength; length += 1) {
      if (length > heardChars.length) {
        continue;
      }

      for (let start = 0; start <= heardChars.length - length; start += 1) {
        const fragment = heardChars.slice(start, start + length).join("");
        if (editDistance(target, fragment) <= 1) {
          return true;
        }
      }
    }

    return false;
  }

  return { normalize, editDistance, isMatch };
})();
