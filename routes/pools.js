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

  if (!userId) { throw boom.create(400, 'Bad Request') }

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

router.post('/specific', authenticate, (req, res, next) => {
  const { userId } = req.token;
  const { poolId } = req.body;

  if (!userId || typeof userId !== 'string') { throw boom.create(400, 'Bad Request'); }

  if (poolId < 0 || !poolId || typeof poolId !== 'number') { throw boom.create(400, 'Bad Request') }

  knex('pools')
    .where('id', poolId)
    .andWhere('expiration', '>', moment().format())
    .then((row) => {
      if (!row) { return res.send('No pool found') }

      const pool = camelizeKeys(row[0]);

      delete pool.createdAt;
      delete pool.updatedAt;
      delete pool.geog;

      res.send(pool)
    })
});

router.post('/near', authenticate, (req, res, next) => {
  const { userId } = req.token;

  if (!userId) { return next('Not a valid user') }

  const { lat, lng } = req.body;

  knex('pools')
    .where(st.dwithin('geog', st.makePoint(lng, lat), 'radius'))
    .andWhere('expiration', '>', moment().format())
    .then((rows) => {
      const pools = camelizeKeys(rows);

      const toSend = pools.map((e, i) => {
        const newPool = e;

        delete newPool.createdAt;
        delete newPool.updatedAt;
        delete newPool.geog;

        return newPool;
      });

      res.send(toSend);
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
