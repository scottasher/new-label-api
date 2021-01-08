const router = require('express').Router();
const { videos } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', auth, videos.create);
router.get('/', videos.all);
router.get('/:id', videos.getById);
router.put('/:id', auth, videos.updateById);
router.post('/file', auth, videos.upload);
router.post('/thumbnail', auth, videos.uploadThumbnail);

module.exports = router;
