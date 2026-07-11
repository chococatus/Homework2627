/**
 * Shared UI — Shape Icons
 * -----------------------
 * Builds the colored shape icons used across multiple screens.
 */

/**
 * Create a colored shape element for a student.
 * @param {object} student — { color, shape }
 * @param {string} [sizeClass] — optional extra class, e.g. "shape-icon--large"
 * @returns {HTMLElement}
 */
function createShapeIcon(student, sizeClass) {
  const icon = document.createElement("div");
  icon.className =
    "shape-icon shape-icon--" + student.shape + " shape-icon--" + student.color;

  if (sizeClass) {
    icon.classList.add(sizeClass);
  }

  icon.setAttribute("aria-hidden", "true");
  return icon;
}
