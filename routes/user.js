const userAPIfunctions = require("../controllers/usercontroller");

module.exports = function(app, db) {
  // Fetching all student lists
  app.get("/studentslist", userAPIfunctions.getAllStudents);

  // Fetching individual student data
  app.get("/student", userAPIfunctions.getStudent);

  // Updating the student data
  app.put("/student/:id", userAPIfunctions.uploadStudentMarksheet);
};
