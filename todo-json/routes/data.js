var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const data = require("../data/item.json");

router.get("/", function(req, res) {
  res.send(data);
});

router.post("/edit", function(req, res) {
  for (let item of data.data) {
    if (item.id === req.body[0]) {
      item[req.body[1]] = req.body[2];
      break;
    }
  }
  fs.writeFile(
    path.join(__dirname, "../data/item.json"),
    JSON.stringify(data),
    function(err) {
      if (err) throw err;
      res.status(200).send("Success");
    }
  );
});

router.post("/add", function(req, res) {
  data.data.push(req.body);
  fs.writeFile(
    path.join(__dirname, "../data/item.json"),
    JSON.stringify(data),
    function(err) {
      if (err) throw err;
      res.status(200).send("Success");
    }
  );
});

router.delete("/delete", function(req, res) {
  let fileAfterDelete = data.data.filter(item => item.id !== req.body.id);
  data.data = fileAfterDelete;
  fs.writeFile(
    path.join(__dirname, "../data/item.json"),
    JSON.stringify(data),
    function(err) {
      if (err) throw err;
      res.status(200).send("Success");
    }
  );
});

module.exports = router;
