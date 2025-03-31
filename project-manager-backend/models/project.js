const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
  name: String,
  complete: Boolean,
  dateCreated: Date,
  board: {type: mongoose.Schema.Types.ObjectId, ref: "Board"},
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: "Task"}]
})

module.exports = mongoose.model("Project", ProjectSchema)