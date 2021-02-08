const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/checkAuth')

const chordgroup_controller = require('../controllers/chordgroupController')

//router.post('/create', checkAuth, chordgroup_controller.chordgroup_create_group)

router.get('/getCurr', checkAuth, chordgroup_controller.chordgroup_get_curr)

module.exports = router