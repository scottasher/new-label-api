const router = require('express').Router();
const { articles } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', auth, articles.create);
router.get('/', articles.all);
router.get('/:id', articles.getById);
router.put('/:id', auth, articles.updateById);
router.delete('/:id', auth, articles.deleteById);
router.post('/image', auth, articles.uploadImage);

module.exports = router;
