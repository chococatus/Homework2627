/**
 * Student Data (Google Sheets: "Students" worksheet)
 * --------------------------------------------------
 * Temporary placeholder list. Later this will be loaded from the
 * semester's Google Sheet without changing how the UI reads student information.
 *
 * Each semester uses a new spreadsheet (e.g. Homework_2026_Fall).
 * Only the data source changes — not the application logic.
 */

const STUDENTS = [
  { id: "minsoo",  name: "Minsoo",  color: "red",    shape: "circle"  },
  { id: "jiwoo",   name: "Jiwoo",   color: "yellow", shape: "circle"  },
  { id: "seojun",  name: "Seojun",  color: "green",  shape: "circle"  },
  { id: "hayoon",  name: "Hayoon",  color: "blue",   shape: "circle"  },
  { id: "yerin",   name: "Yerin",   color: "purple", shape: "circle"  },

  { id: "ethan",   name: "Ethan",   color: "red",    shape: "triangle" },
  { id: "sophia",  name: "Sophia",  color: "yellow", shape: "triangle" },
  { id: "noah",    name: "Noah",    color: "green",  shape: "triangle" },
  { id: "chloe",   name: "Chloe",   color: "blue",   shape: "triangle" },
  { id: "daniel",  name: "Daniel",  color: "purple", shape: "triangle" },

  { id: "emma",    name: "Emma",    color: "red",    shape: "square"  },
  { id: "lucas",   name: "Lucas",   color: "yellow", shape: "square"  },
  { id: "olivia",  name: "Olivia",  color: "green",  shape: "square"  },
  { id: "leo",     name: "Leo",     color: "blue",   shape: "square"  },
  { id: "grace",   name: "Grace",   color: "purple", shape: "square"  },
];

/**
 * Find a student by their unique id.
 * @param {string} id
 * @returns {object|undefined}
 */
function getStudentById(id) {
  return STUDENTS.find(function (student) {
    return student.id === id;
  });
}
