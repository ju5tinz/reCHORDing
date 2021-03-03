const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth')
const checkGroup = require('../middleware/checkGroup')

const fretboard_controller = require('../controllers/fretboardController');

router.post('/add', checkAuth, checkGroup, fretboard_controller.fretboard_add_chord);

router.get('/remove', checkAuth, fretboard_controller.fretboard_remove_chord);

router.get('/chords', checkAuth, checkGroup, fretboard_controller.fretboard_user_chords);

router.get('/recent', fretboard_controller.fretboard_recent);

module.exports = router;