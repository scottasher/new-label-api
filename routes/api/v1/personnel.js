const router = require('express').Router();
const { personnel } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', personnel.create);
// router.get('/', personnel.all);
// router.get('/:id', personnel.getById);
// router.put('/:id', auth, personnel.updateById);
// router.delete('/:id', auth, personnel.deleteById);
// router.post('/image', auth, personnel.uploadImage);

module.exports = router;
