const { Router } = require('express');
const passport = require('passport');
const { login, logout, current } = require('../controllers/sessions.controller');
const { requireAuth } = require('../middleware/auth');

const router = Router();
router.post(
  '/login',
  passport.authenticate('login', { session: false, failWithError: true }),
  login
);
router.get('/current',
  passport.authenticate('current', { session: false }),
  current
);
router.post('/logout', logout);

module.exports = router;
