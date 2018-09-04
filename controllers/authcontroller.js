const uuidv4 = require("uuid/v4");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/index");
const async = require("async");
const Joi = require("joi");
const schema = require("../models/models");
// Mongoose config
const mongoose = require("mongoose");
let dev_db_url = "mongodb://mz7:mlab7771@ds137812.mlab.com:37812/schooldb_m";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

function signup(req, res) {
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  let profile_id = uuidv4();
  const user = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    profile_id: profile_id,
    password: hashedPassword
  };
  const userschemaValidate = Joi.validate(user, schema.userschema);
  if (!userschemaValidate.error) {
    async.series(
      [
        function(callback) {
          // do some stuff ...
          db.collection("users").insertOne(user, (err, result) => {
            if (err) {
              console.log("Error in inserting user data ");
              //   res.send({ error: "An error has occured" });
              callback(err, null);
            } else {
              //   res.send(result.ops[0]);
              callback(null, result.ops[0]);
            }
          });
        },
        function(callback) {
          // do some more stuff ...
          let teacherSchema = {
            name: user.name,
            email: user.email,
            role: user.role,
            profile_id: user.profile_id
          };
          let studentSchema = {
            name: user.name,
            email: user.email,
            role: user.role,
            profile_id: user.profile_id,
            roll_no: req.body.roll_no,
            resources: [],
            grade: ""
          };
          if (user.role === "student") {
            db.collection("students").insertOne(
              studentSchema,
              (err, result) => {
                if (err) {
                  console.log("Error in inserting teacher data");
                  callback(err, null);
                } else {
                  callback(null, result.ops[0]);
                }
              }
            );
          } else if (user.role === "teacher") {
            db.collection("teachers").insertOne(
              teacherSchema,
              (err, result) => {
                if (err) {
                  console.log("Error in inserting teacher data");
                  callback(err, null);
                } else {
                  callback(null, result.ops[0]);
                }
              }
            );
          } else {
            let err = "User role not available";
            callback(err, null);
          }
        }
      ],
      // optional callback
      function(err, results) {
        // results is now equal to ['one', 'two']
        if (err) {
          res.send({ error: err });
        } else {
          res.send(results);
        }
      }
    );
  } else {
    res.send({ error: "Schema Validation Error. Constraints do not apply" });
  }
}

function login(req, res) {
  db.collection("users").findOne(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) return res.status(500).send("Error on the server.");
      if (!user) return res.status(404).send("No user found.");
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid)
        return res.status(401).send({ auth: false, token: null });
      let token = jwt.sign(
        {
          id: user._id,
          profile_id: user.profile_id
        },
        config.secret,
        {
          expiresIn: 86400 // expires in 24 hours
        }
      );
      res
        .status(200)
        .send({ auth: true, token: token, role: user.role, id: user._id });
    }
  );
}

module.exports = {
  signup,
  login
};
