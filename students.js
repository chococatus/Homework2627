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

  const startTime = performance.now();
  console.log("[Student Load] started");

  studentLoadPromise = fetchJson("Students")
    .then(function (data) {
      const fetchTime = performance.now();

      console.log(
        "[Student Load] API response:",
        (fetchTime - startTime).toFixed(0) + " ms"
      );

      if (Array.isArray(data)) {
        STUDENTS = data;
      }

      const completeTime = performance.now();

      console.log(
        "[Student Load] complete:",
        (completeTime - startTime).toFixed(0) + " ms",
        "students:",
        STUDENTS.length
      );
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
