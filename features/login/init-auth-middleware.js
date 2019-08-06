require('../../env-files');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { getUserForLoginData, getUserById, authByGoogle } = require('./repository');
const logger = require('../../logger');

module.exports = function initAuthMiddleware(app) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await getUserForLoginData(username, password);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
  );

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_CALLBACK } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CLIENT_CALLBACK) {
    logger.warn(
      'Enviroment variables GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_CALLBACK should be set.'
    );
    logger.warn('Google OAuth is disabled.');
  } else {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: '',
          passReqToCallback: true,
        },
        async function(request, accessToken, refreshToken, profile, done) {
          let err = null;
          let user = null;
          try {
            user = await authByGoogle(profile);
          } catch (e) {
            err = e;
          }
          return done(err, user);
        }
      )
    );

    app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

    app.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure',
      })
    );
  }

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
    if (!user) {
      return done(`Could not deserialize user with id ${id}`);
    }
    return done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
};
