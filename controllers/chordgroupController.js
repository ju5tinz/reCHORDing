const ChordGroup = require('../models/chordgroup')
const User = require('../models/user')

exports.chordgroup_create_group = function(req, res, next) {
  User.findOne({
    username: req.userData.username
  })
}