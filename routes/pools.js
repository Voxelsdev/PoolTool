'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
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
      console.error(err);
    });
});

module.exports = router;
