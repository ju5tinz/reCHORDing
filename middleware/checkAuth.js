const { response } = require('express');
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  //const token = req.get("Authorization").split(" ")[1]

  const token = req.cookies.user

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if(err) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.userData = decoded
    next()
  })
}