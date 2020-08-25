const router = require('express').Router();
const {
  tokenVerify,
} = require('../../_middleware/Auth');
const {
  omitTransaction,
  getTransactionDetail,
} = require('../../_controller/TransactionController');

router.post('/make', tokenVerify, omitTransaction)
router.get('/preview/', tokenVerify, getTransactionDetail)

module.exports = router;