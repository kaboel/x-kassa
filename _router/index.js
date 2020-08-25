const router = require('express').Router();

router.use('/user', require('./modules/user'));
router.use('/menu', require('./modules/menu'));
router.use('/transaction', require('./modules/transaction'));

module.exports = router;