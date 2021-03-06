const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


function signup(req, res) {
  const hashedPWD = bcrypt.hashSync(req.body.userPassword, 10);
  UserModel.create({
    name: req.body.userName,
    email: req.body.userEmail,
    password: hashedPWD
  })
  .then(user => {
    const userData = { userName: user.name, email: user.email};

    const token = jwt.sign(
      userData,
      "secret", // TODO SECRET MORE SECRET PLEASE
      { expiresIn: "1h" }
    );

    return res.json({ token: token, ...userData })
  })
  .catch((err) => res.status(403).json({error: err.errmsg}))
}

function login (req, res) {
  UserModel
    .findOne({ email: req.body.userEmail })
    .then(user => {
      if (!user) {
        return res.status(403).json({ error: 'wrong email' })
      }

      bcrypt.compare(req.body.userPassword, user.password, (err, result) => {
        if (!result) {
          return res.status(403).json({
            error: `wrong password for ${req.body.userEmail}`
          })
        }

        const userData = { 
          username: user.name,
          email: user.email,
          id: user._id
        }

        const token = jwt.sign(
          userData,
          'secret', // TODO SECRET MORE SECRET PLEASE
          { expiresIn: '48h' }
        )

        return res.json({ token: token, ...userData })
      })
    })
    .catch(err => handdleError(err, res))
}

function handdleError(err, res) {
  return res.status(400).json(err);
}

module.exports = {
  signup,
  login
}
