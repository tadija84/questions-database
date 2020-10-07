const express = require("express");
const app = express();

const Datastore = require("nedb");

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Starting server at ${port}`);
// });
app.use(express.static("public"));
app.use(express.json());
app.listen(8080, () => {});

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api", (request, response) => {
  database.find({}, (err, data) => response.json(data));
});

app.post("/like", (req, res) => {
  const data = req.body;
  database.find({ _id: data.questionId }, (err, result) => {
    let newNumberOfLikes = result[0].numberoflikes + 1;
    database.update(
      { _id: data.questionId },
      { $set: { numberoflikes: newNumberOfLikes } },
      { multi: true },
      function (err, numReplaced) {}
    );
  });
  res.json({ status: "back", data });
});

app.post("/dislike", (req, res) => {
  const data = req.body;
  database.find({ _id: data.questionId }, (err, result) => {
    let newNumberOfDislikes = result[0].numberofdislikes + 1;
    database.update(
      { _id: data.questionId },
      { $set: { numberofdislikes: newNumberOfDislikes } },
      { multi: true },
      function (err, numReplaced) {}
    );
  });
  res.json({ status: "back", data });
});

app.post("/answer", (req, res) => {
  const data = req.body;
  database.find({ _id: data.questId }, (err, result) => {
    let newAnswer = data.newContent;
    let allAnswers = result[0].answers;
    allAnswers.push(newAnswer);
    database.update(
      { _id: data.questId },
      { $set: { answers: allAnswers } },
      { multi: true },
      function (err, numReplaced) {}
    );
  });
  res.json({ status: "back", data });
});

app.post("/api", (req, res) => {
  const data = req.body;
  database.insert(data);
  res.json({ status: "clicked", data });
});
