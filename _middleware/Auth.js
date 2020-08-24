const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret } = require('../config');
const User = require('../_model/User');

const passwordHash = async (password) => {
  return await bcrypt.hash(password, 8);
}

const passwordValidity = (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
}

const tokenVerify = (uid) => {
  return jwt.sign(
    { id: uid },
    secret,
    { expiresIn: "1d" })
}

const tokenGenerate = (req, res, next) => {
  let token = req.headers['access_token'];
  if (!token) {
    return res.status(403).send({
      auth: false,
      message: "No access_token provided."
    });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        auth: false,
        message: "Expired access_token provided."
      });
    }
    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(500).send({
          auth: false,
          message: "Token Error. User not found."
        });
      }
      req.userId = decoded.id;
      next();
    }).catch(err => {
      return res.status(500).send({
        auth: false,
        message: "Token Error. Error fetching user data."
      });
    });
  });
}

module.exports = {
  passwordHash,
  passwordValidity,
  tokenVerify,
  tokenGenerate
}