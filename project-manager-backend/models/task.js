const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  name: String,
  completed: Boolean,
  project: {type: mongoose.Schema.Types.ObjectId, ref: "Project"}
})

module.exports = mongoose.model("Task", TaskSchema)