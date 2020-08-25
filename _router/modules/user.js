const router = require('express').Router();
const {
  statusCheck,  // Check for account activation status before continue    || Level: 1
  tokenVerify,  // Check for token validity before continue               || Level: 2
  roleCheck,    // Check for token validity and user role before continue || Level: 3
} = require('../../_middleware/Auth');
const {
  registerNewUser,
  removeUser,
  loginUser,
  getAllUser,
  setUserRole,
  setUserStatus,
} = require('../../_controller/UserController');

router.post('/register', registerNewUser);
router.delete('/remove', roleCheck, removeUser);
router.post('/login', statusCheck, loginUser);
router.put('/set/status', roleCheck, setUserStatus);
router.put('/set/role', roleCheck, setUserRole);
router.get('/all', roleCheck, getAllUser);

module.exports = router;