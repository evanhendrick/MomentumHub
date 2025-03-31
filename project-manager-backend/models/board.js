const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  name: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  projects: [{type: mongoose.Schema.Types.ObjectId, ref: "Project"}]
})

module.exports = mongoose.model("Board", BoardSchema)