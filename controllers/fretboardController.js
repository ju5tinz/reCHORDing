const Fretboard = require('../models/fretboard');

exports.fretboard_create_post = function(req, res, next) {
  const orig_selectedFrets = req.body.selectedFrets;

  const fretboard = new Fretboard(
    {
      selectedFrets: req.body.selectedFrets.flat(),
      openStrings: req.body.openStrings,
      topFret: req.body.topFret,
      currNotes: req.body.currNotes,
      chordName: req.body.chordName
    }
  );

  fretboard.save(function(err) {
    if (err) return next(err);
    else {
      toSend = fretboard.toJSON();
      toSend.selectedFrets = orig_selectedFrets
    
      res.send(JSON.stringify(toSend));
    }
  });
}

exports.fretboard_list = function(req, res, next) {
  Fretboard.find()
    .exec(function(err, list_fretboard) {
      if(err) {
        return next(err)
      }

      const new_list_fretboard = list_fretboard.map(chord => {
        let selectedFrets = chord.selectedFrets
        let newSelectedFrets = [], size = 2
        while(selectedFrets.length > 0) newSelectedFrets.push(selectedFrets.splice(0, size))
        chord.selectedFrets = newSelectedFrets.slice()
        return {...chord.toJSON(), selectedFrets:newSelectedFrets}
      })

      res.send(JSON.stringify(new_list_fretboard))
    });
}