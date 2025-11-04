const passport = require('passport');

const requireAuth = passport.authenticate('current', { session: false });

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ status: 'error', message: 'No autenticado' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ status: 'error', message: 'No autorizado' });
  }
  next();
};

module.exports = { requireAuth, requireRole };
