const router = require('express').Router();
const { categories } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', auth, categories.create);
router.get('/', categories.all);

module.exports = router;
