const ChordGroup = require('../models/chordgroup')
const User = require('../models/user')

/*
exports.chordgroup_create_group = function(req, res, next) {
  User.findById(req.userData.userId)
}
*/

exports.chordgroup_get_curr = function(req, res, next) {
  User.findById(req.userData.userId, function(err, user) {
    if(err) {
      return next(err)
    } 
    
    ChordGroup.findById(user.currGroup, function(err, group) {
      if(err) {
        return next(err)
      }

      return res
        .status(200)
        .json({
          name: group.name,
          _id: group._id
        })
    })
  })
}