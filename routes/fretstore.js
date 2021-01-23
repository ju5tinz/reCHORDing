const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth')

const fretboard_controller = require('../controllers/fretboardController');

router.post('/create', fretboard_controller.fretboard_create_post);

router.get('/list', checkAuth, fretboard_controller.fretboard_list);

module.exports = router;