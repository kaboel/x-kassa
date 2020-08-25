const router = require('express').Router();
const {
  roleCheck,
} = require('../../_middleware/Auth');
const {
  upsertMenu,
  deleteMenu,
  getAllMenu,
} = require('../../_controller/MenuController');

router.post('/upsert', roleCheck, upsertMenu);
router.post('/delete', roleCheck, deleteMenu);
router.get('/all', getAllMenu);

module.exports = router;