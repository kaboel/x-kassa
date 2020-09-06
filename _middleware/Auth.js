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

const tokenGenerate = (userId) => {
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: "1d" }
  );
}

const tokenVerify = (req, res, next) => {
  let token = req.headers['kassa_token'];
  if (!token) {
    return res.status(403).send({
      auth: false,
      message: "No access token provided."
    });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        auth: false,
        message: "Expired access token provided."
      });
    }
    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(500).send({
          auth: false,
          message: "Token Error! User not found."
        });
      }
      req.userId = user._id;
      next();
    }).catch(err => {
      return res.status(500).send({
        auth: false,
        message: "Token Error! Error fetching user data."
      });
    });
  });
}

const roleCheck = (req, res, next) => {
  let token = req.headers['kassa_token'];
  if (!token) return res.status(403).send({
    message: "No access token provided"
  });
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        auth: false,
        message: "Expired access token provided."
      });
    }
    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(500).send({
          auth: false,
          message: "Token Error! User not found."
        });
      }
      if (user.role !== 'user') {
        req.userId = user._id;
        req.roleAuth = true;
        next();
      } else {
        return res.status(401).send({
          auth: false,
          message: "Role unauthorized!"
        });
      }
    }).catch(err => {
      return res.status(500).send({
        auth: false,
        message: "Token Error! Error fetching user data."
      });
    });
  });
}

const statusCheck = (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return res.status(500).send({
      message: 'Error on status check'
    });
    if (!user) return res.status(403).send({
      message: 'Username not found on status check'
    });
    if (user && user.active) {
      req.userId = user._id
      next();
    } else {
      return res.status(401).send({
        auth: false,
        message: "Account hasn't been activated! Please wait for an Administrator to authorize your login."
      });
    }
  });
};

module.exports = {
  passwordHash,
  passwordValidity,
  tokenVerify,
  tokenGenerate,
  roleCheck,
  statusCheck,
}