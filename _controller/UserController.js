const User = require('../_model/User');
const {
  passwordHash,
  passwordValidity,
  tokenGenerate,
} = require('../_middleware/Auth');

const registerNewUser = async (req, res) => {
  try {
    let user = User.find({ username: req.body.username });
    if (user.length >= 1) return res.status(409).send({
      auth: false,
      message: 'Username already in use.'
    });
    let hash = await passwordHash(req.body.password);
    user = new User({
      name: req.body.name,
      username: req.body.username,
      password: hash,
    });
    await user.save().then((user) => {
      res.status(200).send({
        auth: false,
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        active: user.active,
        message: "Registration successful! Please wait for an Administrator to authorize your login."
      });
    }).catch((err) => {
      return res.status(500).send({
        auth: false,
        message: "There was a problem registering the user."
      })
    })
  } catch (e) {
    return res.status(500).send({
      auth: false,
      message: "Request error."
    })
  }
}

const removeUser = (req, res) => {
  if (req.userId && req.roleAuth === 'super') {
    User.findOneAndDelete({_id: req.body._id}).then(() => {
      res.status(200).send({
        message: 'User deleted!'
      });
    }).catch(err => {
      return res.status(500).send({
        message: 'An error has occured while deleting the user.'
      });
    });
  } else {
    return res.status(401).send({
      message: 'Role unauthorized!'
    });
  }
}

const loginUser = (req, res) => {
  User.findOne({ username: req.body.username },
    (err, user) => {
      if (err) return res.status(500).send({
        auth: false,
        message: "Error while logging in."
      });
      if (!user) return res.status(403).send({
        auth: false,
        message: "Username not found."
      });
      if (!passwordValidity(req.body.password, user.password)) return res.status(401).send({
        auth: false,
        kassa_token: null,
        message: "Password incorrect."
      });
      res.status(200).send({
        auth: true,
        id: user._id,
        name: user.name,
        role: user.role,
        active: user.active,
        username: user.username,
        kassa_token: tokenGenerate(user._id),
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
        let message = "";
        if (response.active) message = `User ${response.username} activated!`
        else message = `User ${response.username} deactivated!`
        res.status(200).send({
          message: message
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
  if (req.userId && req.roleAuth === 'super') {
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
          message: `Role updated for user ${targetUser.username}!`
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

const getActiveUser = (req, res) => {
  if (req.userId) {
    User.findOne({_id: req.userId}).then((user) => {
      res.status(200).send({
        _id: user._id,
        name: user.name,
        username: user.username,
        active: user.active,
        role: user.role,
      });
    }).catch((err) => {
      return res.status(500).send({
        message: 'An error has occured while fectching user data.'
      });
    });
  } else {
    return res.status(401).send({
      message: 'Expired access token provided. Please re-login!'
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
  removeUser,
  registerNewUser
}
