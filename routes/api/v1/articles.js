const router = require('express').Router();
const { articles } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', auth, articles.create);
router.get('/', articles.all);
router.get('/:id', auth, articles.getById);
router.put('/:id', auth, articles.updateById);
router.post('/image', auth, articles.uploadImage);

module.exports = router;
