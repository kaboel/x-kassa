const router = require('express').Router();
const {
  tokenVerify,
  roleCheck,
  statusCheck,
} = require('../../_middleware/Auth');
const {
  registerNewUser,
  loginUser,
  getAllUser,
  setUserRole,
  setUserStatus,
} = require('../../_controller/UserController');

router.post('/register', registerNewUser);
router.post('/login', statusCheck, loginUser);
router.put('/set/status', roleCheck, setUserStatus);
router.put('/set/role', roleCheck, setUserRole);
router.get('/all', roleCheck, getAllUser);

module.exports = router;