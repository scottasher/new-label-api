const router = require('express').Router();
const { utils } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', utils.contact);

module.exports = router;
