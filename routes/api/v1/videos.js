const router = require('express').Router();
const { videos } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', auth, videos.create);
router.get('/', videos.all);
router.get('/:id', videos.getById);
router.put('/:id', auth, videos.updateById);
router.post('/video', auth, videos.upload);

module.exports = router;
