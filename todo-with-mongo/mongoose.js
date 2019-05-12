const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/mydb", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we are connected");
});
// had to do it for findOneanddelete method
mongoose.set("useFindAndModify", false);

const taskSchema = new mongoose.Schema({
  text: String,
  checked: String,
  note: String,
  taskid: String
});

// this is a constructor
const Task = mongoose.model("task", taskSchema);

module.exports = Task
