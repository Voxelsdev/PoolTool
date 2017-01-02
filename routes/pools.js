'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const st = require('knex-postgis')(knex);
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const moment = require('moment');

const ev = require('express-validation');
const validations = require('../validations/pools.js');
const authenticate = require('../utils/authentication.js');

router.get('/all', authenticate, (req, res, next) => {
  const { userId } = req.token;

  if (!userId) { return next('Not a valid user'); }

  knex('pools')
    .where('expiration', '>', moment().format())
    .then((rows) => {
      if (!rows) { return res.send('No available pools, check connection') }

      const pools = camelizeKeys(rows);

      res.send(pools);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/near', authenticate, (req, res, next) => {
  const { userId } = req.token;

  if (!userId) { return next('Not a valid user') }

  const { lat, lng } = req.body;

  knex('pools')
    .where(st.dwithin('geog', st.makePoint(lng, lat), 'radius'))
    .andWhere('expiration', '>', moment().format())
    .then((rows) => {
      res.send(camelizeKeys(rows));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/new', authenticate, ev(validations.post), (req, res, next) => {
  const { userId } = req.token;

  if (!userId) { return next('Not a valid user') }

  knex('users')
    .where('auth_id', userId)
    .first()
    .then((row) => {
      const user = camelizeKeys(row);

      if (user.isAdmin) {
        const { type, amount, radius, expiration, health, latitude, longitude } = req.body;
        const pool = { type, amount, radius, expiration, health, latitude, longitude };

        knex('pools').insert(Object.assign(decamelizeKeys(pool), {
          geog: st.makePoint(pool.longitude, pool.latitude),
        }), '*')
          .then((pool) => {
            return pool;
          })
          .catch((err) => {
            next(err);
          });
      } else {
        res.send('Unauthorized');
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
