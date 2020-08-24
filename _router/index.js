const router = require('express').Router();

router.use('/user', require('./modules/user'));
router.use('/menu', require('./modules/menu'));

module.exports = router;