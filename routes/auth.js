'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const jwt = require('jsonwebtoken');

const authenticate = require('../utils/authentication.js');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.HOST + '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken, refreshToken });
}));

router.get('/user', authenticate, (req, res, next) => {
  const { userId } = req.token;

  knex('users')
    .where('auth_id', userId)
    .then((userRow) => {
      if (userRow) {
        return res.send(true);
      }
      return res.send(false);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get('/google',
  passport.authenticate('google', {
    scope: ['email', 'profile', 'https://www.googleapis.com/auth/plus.login']
  }), (req, res, next) => {
    console.log(json.stringify(req));
  });

router.get('/google/callback',
  passport.authenticate('google',
  { failureRedirect: '/' }), (req, res, next) => {
  const user = req.user.profile;
  const email = user.emails[0].value;
  const avatarUrl = user.photos[0].value;
  const authId = user.id;
  const { min, max } = user._json.ageRange;

  knex('users')
      .select(knex.raw('1=1'))
      .where('auth_id', authId)
      .then((result) => {
        if (!result.length) {
          const newUser = {
            email,
            avatarUrl,
            authId,
            min,
            max,
          }

          knex('users').insert(decamelizeKeys(newUser), '*')
          .then(users => {
            return users;
          }).catch((err) => {
            next(err);
          });
        }

        const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3);
        const token = jwt.sign({ userId: authId }, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.cookie('token', token, {
          httpOnly: true,
          expires: expiry,
          secure: router.get('env') === 'production',
        });
        res.cookie('loggedIn', 'true');
        res.redirect('/game');
    })
    .catch(err => {
      next(err);
    });
});

router.get('/logout', (req, res) => {
  const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3);
  res.cookie('loggedIn', 'false', { expires: expiry});
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
