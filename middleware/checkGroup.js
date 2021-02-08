const User = require('../models/user')

module.exports = (req, res, next) => {
  User.findById(req.userData.userId, 'chordGroups', function(err, user) {
    if(err) {
      return next(err)
    }

    const groupId = req.query.groupId || req.body.groupId

    if(!user.chordGroups.includes(groupId)) {
      return res.status(404).json({
        message: 'Invalid Group'
      })
    }

    req.groupId = groupId
    next()
  })
}