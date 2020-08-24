const User = require('../_model/User');
const {
  passwordHash,
  passwordValidity,
  tokenGenerate,
} = require('../_middleware/Auth');

const registerNewUser = async (req, res) => {
  try {
    let user = User.find({ username: req.body.username });
    if (user.length >= 1) {
      return res.status(409).send({
        auth: false,
        message: 'Username already in use.'
      });
    }
    let hash = await passwordHash(req.body.password);
    user = new User({
      name: req.body.name,
      username: req.body.name,
      password: hash,
    });
    await user.save().then((user) => {
      res.status(200).send({
        auth: false,
        id: user._id,
        name: user.name,
        message: "Registration successful! Please wait for an Administrator to authorize your login."
      });
    }).catch((err) => {
      return res.status(500).send({
        auth: false,
        message: "There was a problem registering the user."
      })
    })
  } catch (e) {
    return res.status(400).send({
      auth: false,
      message: "Request error."
    })
  }
}

const loginUser = (req, res) => {
  User.findOne({ username: req.body.username },
    (err, user) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: "Error while logging in."
        });
      }
      if (!user) {
        return res.status(403).send({
          auth: false,
          message: "Username not found."
        });
      }
      if (!passwordValidity(req.body.password, user.password)) {
        return res.status(401).send({
          auth: false,
          kassa_token: null,
          message: "Password incorrect."
        });
      }
      res.status(200).send({
        auth: true,
        id: user._id,
        name: user.name,
        role: user.role,
        active: user.active,
        username: user.username,
        kassa_token: tokenGenerate(user._id)
      });
    });
};

const setUserStatus = (req, res) => {
  if (req.userId && req.roleAuth) {
    User.findOne({ _id: req.body.targetId }, async (err, targetUser) => {
      if (err) return res.status(500).send({
        message: 'An error has occured while authorizing user.'
      });
      if (!targetUser) return res.status(403).send({
        message: 'Error! Target user not found.'
      });
      targetUser.active = req.body.newStatus;
      await targetUser.save().then((response) => {
        res.status(200).send({
          message: `User ${targetUser.username} activated!`
        });
      }).catch((error) => {
        return res.status(500).send({
          message: 'An error has occured while authorizing user.'
        });
      });
    });
  } else {
    return res.status(401).send({
      message: 'Role unauthorized!'
    });
  }
}

const setUserRole = (req, res) => {
  if (req.userId && req.roleAuth) {
    User.findOne({ _id: req.userId }, (err, user) => {
      if (err) return res.status(500).send({
        message: 'An error has occured.'
      });
      if (!user) return res.status(403).send({
        message: 'Error! Administrator credential not found.'
      });
      if (user && user.role === 'super') {
        User.findOne({ _id: req.body.targetId }, async (err, targetUser) => {
          if (err) return res.status(500).send({
            message: 'An error has occured while authorizing user.'
          });
          if (!targetUser) return res.status(403).send({
            message: 'Error! Target user not found.'
          });
          targetUser.role = req.body.newRole;
          await targetUser.save().then((response) => {
            res.status(200).send({
              message: `User ${targetUser.username} activated!`
            });
          }).catch((error) => {
            return res.status(500).send({
              message: 'An error has occured while authorizing user.'
            });
          });
        });
      } else {
        return res.status(401).send({
          message: 'Role unauthorized!'
        });
      }
    })
  } else {
    return res.status(401).send({
      message: 'Role unauthorized!'
    });
  }
}

const getAllUser = (req, res) => {
  if (req.userId && req.roleAuth) {
    User.find({}, (err, users) => {
      if (err) return res.status(500).send({
        message: 'An error has occured while getting users data.'
      });
      res.status(200).send(users);
    })
  } else {
    return res.status(401).send({
      message: 'Role unauthorized!'
    });
  }
}

module.exports = {
  getAllUser,
  setUserRole,
  setUserStatus,
  loginUser,
  registerNewUser
}
