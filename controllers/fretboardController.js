const mongoose = require('mongoose')

const Fretboard = require('../models/fretboard');
const ChordGroup = require('../models/chordgroup')

exports.fretboard_add_chord = function(req, res, next) {
  const fretboardData = req.body.chord
  
  const fretboard = new Fretboard(
    {
      selectedFrets: fretboardData.selectedFrets.flat(),
      openStrings: fretboardData.openStrings,
      topFret: fretboardData.topFret,
      currNotes: fretboardData.currNotes,
      chordName: fretboardData.chordName
    }
  );
  
  
  fretboard.save(async function(err) {
    if (err) return next(err);

    const groupId = req.groupId
    const group = await ChordGroup.findById(groupId)
    group.fretboards.push(mongoose.Types.ObjectId(fretboard._id))
    await group.save()

    const toSend = unflattenChord(fretboard)
    res.send(JSON.stringify(toSend));
  });
  
}

exports.fretboard_user_chords = function(req, res, next) {
  const groupId = req.groupId

  ChordGroup.findById(groupId, function(err, group) {
    if(err) {
      return next(err)
    }

    const fretboardIds = group.fretboards

    Fretboard.find({
      '_id': { $in: fretboardIds }
    }, {}, { 
      sort: {'createdAt': 1}
    }, function(err, list_fretboard) {
      if(err) {
        return next(err)
      }

      const new_list_fretboard = list_fretboard.map(chord => unflattenChord(chord))

      res.send(JSON.stringify(new_list_fretboard));
    }
    )
  })
  /*
  Fretboard.find()
    .exec(function(err, list_fretboard) {
      if(err) {
        return next(err)
      }

      const new_list_fretboard = list_fretboard.map(chord => unflattenChord(chord))

      res.send(JSON.stringify(new_list_fretboard))
    });
    */
}

exports.fretboard_recent = function(req, res, next) {
  Fretboard.find({}, {}, { sort: {'createdAt': -1}, limit: 8 },
    function(err, list_fretboard) {
      if(err) {
        return next(err)
      }

      const new_list_fretboard = list_fretboard.map(chord => unflattenChord(chord))

      res.send(JSON.stringify(new_list_fretboard))
    }
  )
}

function unflattenChord(chord) {
  let selectedFrets = chord.selectedFrets
  let newSelectedFrets = [], size = 2
  while(selectedFrets.length > 0) newSelectedFrets.push(selectedFrets.splice(0, size))
  chord.selectedFrets = newSelectedFrets.slice()
  return {...chord.toJSON(), selectedFrets:newSelectedFrets}
}