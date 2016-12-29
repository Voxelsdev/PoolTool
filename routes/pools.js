'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const st = require('knex-postgis')(knex);
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const moment = require('moment');

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

router.get('/near', authenticate, (req, res, next) => {
  const { userId } = req.token;

  if (!userId) { return next('Not a valid user') }

  const { lat, lng } = req.body;

  knex('pools')
    .where(st.dwithin('geog', st.makePoint(lng, lat), 'radius'))
    .then((rows) => {
      res.send(camelizeKeys(rows));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/new', authenticate, (req, res, next) => {
  const { userId } = req.token;

  if (!userId) { return next('Not a valid user') }

  const { type, amount. radius, expiration, health } = req.body;
  const pool = { type, amount, radius, expiration, health };
});

module.exports = router;
