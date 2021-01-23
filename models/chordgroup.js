const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChordGroupSchema = new Schema(
  {
    name: {type: String, required: true},
    fretboards: [{type: Schema.Types.ObjectId, ref: 'Fretboard'}]
  }
)

module.exports = mongoose.model('ChordGroup', ChordGroupSchema)