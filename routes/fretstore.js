const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth')

const fretboard_controller = require('../controllers/fretboardController');

router.post('/create', fretboard_controller.fretboard_create_post);

router.get('/recent', fretboard_controller.fretboard_recent);

router.get('/chords', fretboard_controller.fretboard_user_chords);

module.exports = router;