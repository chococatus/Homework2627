/**
 * Student Data
 * ------------
 * Student information is loaded from the generated static JSON file.
 */

let STUDENTS = [];
let studentLoadPromise = null;

async function loadStudentsData() {
  if (studentLoadPromise) {
    return studentLoadPromise;
  }

  const startTime = performance.now();
  console.log("[Student Load] started");

  studentLoadPromise = fetch("data/students.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load student data.");
      }

      return response.json();
    })
    .then(function (data) {
      const fetchTime = performance.now();

      console.log(
        "[Student Load] JSON response:",
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
