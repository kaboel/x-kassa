const router = require('express').Router();
const {
  tokenVerify,
} = require('../../_middleware/Auth');
const {
  omitTransaction,
  getTransactionDetail,
} = require('../../_controller/TransactionController');

router.post('/make', tokenVerify, omitTransaction)
router.get('/preview/:id', tokenVerify, getTransactionDetail)

module.exports = router;