var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const Task = require("../mongoose");

router.get("/", function(req, res) {
  Task.find({}, (err, tasks) => {
    console.log(tasks);
    res.status(200).send(tasks);
  });
});

router.post("/edit", function(req, res) {
  let property = req.body[1];
  Task.findOneAndUpdate(
    { taskid: req.body[0] },
    {
      [property]: req.body[2]
    },
    {new: true},
    (err, data) => {
      if (err) return console.error(err);
      console.log(data);
      res.status(200).send("Success");
    }
  );
});

router.post("/add", function(req, res) {
  let taskItem = new Task(req.body);
  taskItem.save(function(err) {
    if (err) return console.error(err);
    res.status(200).send("Success");
  });
});

router.delete("/delete", function(req, res) {
  Task.findOneAndRemove(req.body, () => {
    res.status(200).send("Success");
  });
});

module.exports = router;
