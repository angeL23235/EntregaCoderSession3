const { signToken } = require('../utils/jwt');
const login = async (req, res) => {
  const user = req.user;

  const payload = {
    uid: user._id,
    email: user.email,
    role: user.role,
    name: `${user.first_name} ${user.last_name}`
  };

  const token = signToken(payload, '1d');
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    })
    .json({ status: 'success', token, payload });
};

const logout = async (_req, res) => {
  res.clearCookie('token');
  res.json({ status: 'success', message: 'Sesión cerrada' });
};

const current = async (req, res) => {
  const { password, ...safeUser } = req.user.toObject ? req.user.toObject() : req.user;
  res.json({ status: 'success', payload: safeUser });
};

module.exports = { login, logout, current };
