const mongoose = require('mongoose');
const Schema = mongoose.Schema
// use crypto here for hashing

const UserSchema = new Schema({
  username: String,
  password: String,
  boards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Board'}]
})

module.exports = mongoose.model("User", UserSchema)