var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../data/item.json"));
});


router.post("/edit",function(req,res){
    fs.readFile(path.join(__dirname, "../data/item.json"), function(
      err,
      data
    ) {
      let obj = data.toString("utf-8");
      let jsObj = JSON.parse(obj);
      jsObj.data.(req.body);
      fs.writeFile(
        path.join(__dirname, "../data/item.json"),
        JSON.stringify(jsObj),
        function(err) {
          if (err) throw err;
          res.status(200).send("Success");
        }
      );
    });
    
})

router.post("/add", function(req, res) {
  fs.readFile(path.join(__dirname, "../data/item.json"), function(err, data) {
    let obj = data.toString('utf-8');
    let jsObj = JSON.parse(obj)
    jsObj.data.push(req.body);
    fs.writeFile(path.join(__dirname, "../data/item.json"), JSON.stringify(jsObj), function(
      err
    ) {
      if (err) throw err;
      res.status(200).send("Success");
    });
  });
});


router.post("/delete", function(req, res) {
  console.log(req.body);
    fs.readFile(path.join(__dirname, "../data/item.json"), function(
      err,
      data
    ) {
      let obj = data.toString("utf-8");
      let jsObj = JSON.parse(obj);
      let fileAfterDelete= jsObj.data.filter(item=> item.id !== req.body.id)
      fs.writeFile(
        path.join(__dirname, "../data/item.json"),
        JSON.stringify({data:fileAfterDelete}),
        function(err) {
          if (err) throw err;
          res.status(200).send("Success")
        }
      );
    });
});

module.exports = router;
