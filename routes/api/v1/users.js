const router = require('express').Router();
const { users } = require('../../../controllers');
const auth = require('../../auth');

router.post('/', users.register);
router.get('/', auth, users.all);
router.get('/verification/:id/:token', users.verifyToken);
router.post('/login', users.login);
router.get('/current', auth, users.current);
router.post('/password/reset/request', users.updatePassReq);
router.put('/password/reset', auth, users.updatePass);

module.exports = router;
