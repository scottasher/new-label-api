const router = require('express').Router();
const { media } = require('../../../controllers');
const auth = require('../../auth');

router.post('/upload', media.upload);

module.exports = router;
