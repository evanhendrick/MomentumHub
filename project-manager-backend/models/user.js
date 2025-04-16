const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  password: String,
  salt: String,
  hash: String,
  boards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Board'}]
})

module.exports = mongoose.model("User", UserSchema)