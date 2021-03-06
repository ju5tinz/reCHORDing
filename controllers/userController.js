const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('../models/user');
const ChordGroup = require('../models/chordgroup')

exports.user_register_post = function(req, res, next) {
  //check if anyone with same username
  User.findOne({ 
    username: req.body.username
  }).then((user) => {
    //if no one has same username
    if(!user) {
      const saltRounds = parseInt(process.env.SALTROUNDS)
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
          return next(err)
        } else {
          const chordGroup = new ChordGroup({
            name: "Scratchpad",
            fretboards: []
          })

          const user = new User({
            username: req.body.username,
            hashedPassword: hash,
            currGroup: mongoose.Types.ObjectId(chordGroup._id)
          })

          user.chordGroups.push(mongoose.Types.ObjectId(chordGroup._id))

          user.save(function(err) {
            if(err) {
              return next(err)
            } else {
              chordGroup.save(function(err) {
                if(err) {
                  return next(err)
                } else {
                  token = createToken(user)

                  const userCookieOptions = {
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 *1000),
                    httpOnly: true,
                  }
          
                  return res
                    .status(200)
                    .cookie('user', token, userCookieOptions)
                    .json({
                      message: "Account Created",
                      currGroup: {
                        name: chordGroup.name,
                        _id: chordGroup._id,
                      }
                    })
                }
              })
            }
          })
        }
      })
    } else {
      return res.status(409).json({
        message: "Username exists"
      })
    }
  })
}

exports.user_login_post = function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, 
  '_id username hashedPassword currGroup'
  ).then(async (user) => {
    if(!user) {
      return res.status(401).json({
        message: "Incorrect password or username"
      })
    } else {
      const match = await bcrypt.compare(req.body.password, user.hashedPassword)

      if(match) {
        token = createToken(user)

        const userCookieOptions = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 *1000),
          httpOnly: true,
        }

        ChordGroup.findById(user.currGroup, 'name _id', function(err, currGroup) {
          return res
            .status(200)
            .cookie('user', token, userCookieOptions)
            .json({
              message: "Logged In",
              currGroup
            })
        })

        /*
        return res.status(200).json({
          user: {
            _id: user._id,
            token: "Bearer " + token
          }
        })
        */
      } else {
        return res.status(401).json({
          message: "Incorrect password or username"
        })
      }
    }
  })
}

exports.user_logout_post = function(req, res, next) {
  return res
    .status(200)
    .cookie('user', '', {expires: new Date(0)})
    .json({
      message: "Logged Out"
    })
}

function createToken(user) {
  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1d",
    }
  )

  return token
}