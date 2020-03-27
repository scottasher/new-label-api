const router = require('express').Router();
const { utils } = require('../../../controllers');

router.post('/sign-up', utils.addToMailingList);

module.exports = router;
