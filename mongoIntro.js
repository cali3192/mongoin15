// db.js (for seeding)

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url)
  .then(client => {
    const db = client.db("zoo");
    db.collection("exhibit").insertOne({
      species: "Lion",
      name: "Fred",
      age: 12
    });
  })
  .catch(err =>
    console.error(err, "There was an error inserting into the database")
  );

// utils.js (db queries)

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
let db;

MongoClient.connect(url)
  .then(client => {
    db = client.db("zoo");
  })
  .catch(err =>
    console.error(err, "There was an error connecting to the database")
  );

const getAnimalFromDB = (name, callback) => {
  db.collection("exhibit")
    .find({ name: name })
    .toArray((err, results) => {
      if (err) {
        console.error(err, "There was an error querying the database");
      } else {
        callback(null, results);
      }
    });
};

module.exports.getAnimalFromDB = getAnimalFromDB;

// server.js

const express = require("express");
const path = require("path");
const app = express();
const { getAnimalFromDB } = require("./database/utils.js");
const port = 3000;

app.use(express.static(path.join(__dirname, "./client/dist")));

app.get("/zoo/:name", (req, res) => {
  getAnimalFromDB(req.params.name, (err, result) => {
    if (err) {
      console.error(
        err,
        "There was an error querying the database from the server"
      );
    } else {
      res.send(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}!`);
});
