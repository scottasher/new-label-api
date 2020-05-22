const router = require('express').Router();
const { users } = require('../../../controllers');
const auth = require('../../auth');
const authority = require('../../../middleware/authority');

// ROUTES   
router.post('/', users.register);
router.get('/', auth, authority.admin, users.all);
router.get('/verification/:id/:token', users.verifyToken);
router.post('/login', users.login);
router.get('/current', auth, users.current);
router.get('/:id', auth, authority.admin, users.findById)
router.post('/password/reset/request', users.updatePassReq);
router.put('/password/reset', auth, users.updatePass);
router.delete('/:id', auth, authority.admin, users.deleteUser);
router.put('/:id', users.update);
router.get('/resend/verify/:id', users.resendVerifyEmail);

module.exports = router;
