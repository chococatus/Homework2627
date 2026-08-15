/**
 * Student Data (Google Sheets: "Students" worksheet)
 * --------------------------------------------------
 * Student information is loaded from the current semester's Google Sheet.
 */

let STUDENTS = [];
let studentLoadPromise = null;

async function loadStudentsData() {
  if (studentLoadPromise) {
    return studentLoadPromise;
  }

  studentLoadPromise = fetchJson("Students")
    .then(function (data) {
      if (Array.isArray(data)) {
        STUDENTS = data;
      }
    })
    .catch(function (error) {
      console.error("Failed to load student data:", error);
    });

  return studentLoadPromise;
}

/**
 * Find a student by their unique numeric id.
 * @param {number|string} id
 * @returns {object|undefined}
 */
function getStudentById(id) {
  const numericId = Number(id);

  return STUDENTS.find(function (student) {
    return student.id === numericId;
  });
}
