const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const Users = require('../models/user.model');

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ email: email.toLowerCase().trim() });
        if (!user) return done(null, false, { message: 'Credenciales inválidas' });

        const ok = bcrypt.compareSync(password, user.password);
        if (!ok) return done(null, false, { message: 'Credenciales inválidas' });

        // Todo OK
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const cookieExtractor = (req) => {
  if (req && req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

passport.use(
  'current',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
      try {
        const user = await Users.findById(jwtPayload.uid).populate('cart');
        if (!user) return done(null, false, { message: 'Token válido, usuario inexistente' });
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;
