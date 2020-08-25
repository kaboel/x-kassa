const router = require('express').Router();
const {
  tokenVerify,
} = require('../../_middleware/Auth');
const {
  makeTransaction,
  getTransactionDetail,
} = require('../../_controller/TransactionController');

router.post('/make', tokenVerify, makeTransaction);
router.get('/preview/:id', tokenVerify, getTransactionDetail);

module.exports = router;