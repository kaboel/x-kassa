const router = require('express').Router();
const {
  tokenVerify
} = require('../../_middleware/Auth');
const { omitTransaction } = require('../../_controller/TransactionController');

router.post('/make', tokenVerify, omitTransaction)

module.exports = router;