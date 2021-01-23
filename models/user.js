const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      trim: true,
      required: true,
    },
    chordGroups: [{type: Schema.Types.ObjectId, ref: 'ChordGroup'}]
  }
);

module.exports = mongoose.model('User', UserSchema)