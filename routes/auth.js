'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.HOST + '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken, refreshToken });
}));

router.get('/google',
  passport.authenticate('google', {
    scope: ['email', 'profile', 'https://www.googleapis.com/auth/plus.login']
  }), (req, res, next) => {
    console.log(json.stringify(req));
  });

router.get('/google/callback',
  passport.authenticate('google',
  { failureRedirect: '/'}), (req, res, next) => {
  const user = req.user.profile;
  const email = user.emails[0].value;
  const avatarUrl = user.photos[0].value;
  const authId = req.user.accessToken;
  const { min, max } = user._json.ageRange;

  knex('users')
      .select(knex.raw('1=1'))
      .where('email', email)
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
        res.redirect('/');
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


// {
//    "profile":{
//       "id":"107675765010794042565",
//       "displayName":"Tyler Miller",
//       "name":{
//          "familyName":"Miller",
//          "givenName":"Tyler"
//       },
//       "emails":[
//          {
//             "value":"tylermillerhome@gmail.com",
//             "type":"account"
//          }
//       ],
//       "photos":[
//          {
//             "value":"https://lh4.googleusercontent.com/-RdCORnObcHg/AAAAAAAAAAI/AAAAAAAAAHY/cA9W-oYsIik/photo.jpg?sz=50"
//          }
//       ],
//       "gender":"male",
//       "provider":"google",
//       "_json":{
//          "kind":"plus#person",
//          "etag":"\"FT7X6cYw9BSnPtIywEFNNGVVdio/SI3ViHW0hTSXMb_0R8veHv4BvW0\"",
//          "gender":"male",
//          "emails":[
//             {
//                "value":"tylermillerhome@gmail.com",
//                "type":"account"
//             }
//          ],
//          "objectType":"person",
//          "id":"107675765010794042565",
//          "displayName":"Tyler Miller",
//          "name":{
//             "familyName":"Miller",
//             "givenName":"Tyler"
//          },
//          "url":"https://plus.google.com/107675765010794042565",
//          "image":{
//             "url":"https://lh4.googleusercontent.com/-RdCORnObcHg/AAAAAAAAAAI/AAAAAAAAAHY/cA9W-oYsIik/photo.jpg?sz=50",
//             "isDefault":false
//          },
//          "isPlusUser":true,
//          "language":"en",
//          "ageRange":{
//             "min":18,
//             "max":20
//          },
//          "circledByCount":2,
//          "verified":false,
//          "cover":{
//             "layout":"banner",
//             "coverPhoto":{
//                "url":"https://lh3.googleusercontent.com/wMg6gRKV9N19SbSXo5fV4PU-kAtamvzn6h9tTZZMDoPkryZZi8MogF51z-GjT_lqm3E1JY0=s630-fcrop64=1,00310000ffffffa6",
//                "height":528,
//                "width":940
//             },
//             "coverInfo":{
//                "topImageOffset":0,
//                "leftImageOffset":0
//             }
//          }
//       }
//    },
//    "accessToken":"ya29.CjS6A8MGauabFraDCmuv8f6XJbZirfKq-1gXDAFDvYESp2Mh0aoMRuglvtcoy9iWNtY3iGf9"
// }
