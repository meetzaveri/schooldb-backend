const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const utils = require("../utils/utils");
const config = require("../config/index");
const async = require("async");

// Mongoose config
let dev_db_url = "mongodb://mz7:mlab7771@ds137812.mlab.com:37812/schooldb_m";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

function getAllStudents(req, res) {
  console.log("Req headers", req.headers);
  const { authorization } = req.headers;
  console.log("authorization", authorization);
  const authData = authorization.split(" ");
  const token = authData[1];
  utils.decodeToken(token, config.secret, function(err, userObj) {
    if (err) {
      res.send("Error occured while extracting token. User not authenticated");
    } else {
      console.log("userObj", userObj);

      db.collection("students")
        .find()
        .toArray((err, list) => {
          if (err) {
            console.log(err);
          } else {
            // console.log('Doc', doc);
            res.send(list);
          }
        });
    }
  });
}

function getStudent(req, res) {
  console.log("Req headers", req.headers);
  const { authorization } = req.headers;
  console.log("authorization", authorization);
  if (authorization === undefined) {
    res.send({ error: "Request Unauthorized" });
  }
  const authData = authorization.split(" ");
  const token = authData[1];
  utils.decodeToken(token, config.secret, function(err, userObj) {
    if (err) {
      res.send("Error occured while extracting token. User not authenticated");
    } else {
      console.log("userObj", userObj);
      const profile_id = userObj.profile_id;
      const details = {
        profile_id
      };

      db.collection("students").findOne(details, (err, item) => {
        if (err) {
          res.send({ error: "An error occured after get request" });
        } else {
          res.send(item);
        }
      });
    }
  });
}

function uploadStudentMarksheet(req, res) {
  const { authorization } = req.headers;
  // console.log('authorization', authorization);
  const authData = authorization.split(" ");
  const token = authData[1];
  utils.decodeToken(token, config.secret, function(err, userObj) {
    if (err) {
      res.send("Error occured while extracting token. User not authenticated");
    } else {
      const id = req.params.id;
      const teacher_profile_id = userObj.profile_id;
      const details = {
        _id: new ObjectID(id),
        profile_id: req.body.profile_id
      };
      const content = req.body.content;

      const updatedData = {
        resources: content
      };

      // Using waterfall to perform dependent tasks and passing data on to next
      // functions
      async.waterfall(
        [
          function(callback) {
            console.log("INTO  ASYNC", details);
            db.collection("students").findOne(details, (err, item) => {
              if (err) {
                let error = {
                  error: "An error occured after request failed to fire query"
                };
                callback(error, null);
              } else {
                callback(null, item);
              }
            });
          },
          function(item, callback) {
            console.log("item", item);
            const content = Object.assign(item, updatedData);
            db.collection("students").update(
              details,
              content,
              (err, result) => {
                if (err) {
                  let error = {
                    error: "An error has occurred in PUT operation"
                  };
                  callback(error, null);
                } else {
                  console.log("RESULT", result);
                  callback(null, { message: "Successfully updated" });
                }
              }
            );
          }
        ],
        function(err, results) {
          if (err) {
            res.send("Error in updating data");
          } else {
            console.log("DONE");
            res.send(results);
          }
        }
      );
    }
  });
}

module.exports = {
  uploadStudentMarksheet,
  getAllStudents,
  getStudent
};
