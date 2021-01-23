const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FretboardSchema = new Schema(
  {
    selectedFrets: {
      type: [Number],
    },
    openStrings: {
      type: [Number],
    },
    topFret: {
      type: Number
    },
    currNotes: {
      type: [String]
    },
    chordName: {
      type: String
    }
  }, { timestamps: true }
);

module.exports = mongoose.model('Fretboard', FretboardSchema);