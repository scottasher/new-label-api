const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/articles', require('./articles'));
router.use('/categories', require('./categories'));
router.use('/contact', require('./contact'));
router.use('/mail', require('./mail'));
router.use('/videos', require('./videos'));

module.exports = router;
    