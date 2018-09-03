const userAPIfunctions = require("../controllers/usercontroller");

module.exports = function(app, db) {
  // Getting codes
  app.get("/codes", userAPIfunctions.getAllCodeSnippets);

  app.get("/studentslist", userAPIfunctions.getAllStudents);
  // Creating the codesnippet
  app.post("/codes", userAPIfunctions.postCodeSnippet);

  // Fetching individual student data
  app.get("/student", userAPIfunctions.getStudent);

  // Updating the student data
  app.put("/student/:id", userAPIfunctions.uploadStudentMarksheet);

  // Deleting the codes
  app.delete("/codes/:id", userAPIfunctions.deleteCodeSnippet);
};
