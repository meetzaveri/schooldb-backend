const authAPIfunctions = require("../controllers/authcontroller");

module.exports = function(app, db) {
  // Creating users for code-snippet-manager
  app.post("/register", authAPIfunctions.signup);

  // For user to login
  app.post("/login", authAPIfunctions.login);
};
