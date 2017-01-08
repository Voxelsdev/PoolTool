'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const moment = require('moment');

const { camelizeKeys, decamelizeKeys } = require('humps');

const authenticate = require('../utils/authentication.js');

router.get('/all', authenticate, (req, res, next) => {
  const { userId } = req.token;
  if (!userId) { return next('Not a valid user') }
  knex('users')
    .where('auth_id', userId)
    .first()
    .then((row) => {
      const balance = camelizeKeys(row).balance;

      knex('tools')
        .where('expiration', '>', moment().format())
        .then((rows) => {
          if (!rows) { throw boom.create('No tools found, please check connection')}

          const tools = camelizeKeys(rows).map((e, i) => {
            const newTool = e;

            delete newTool.createdAt;
            delete newTool.updatedAt;

            return newTool;
          });

          const toSend= {
            balance,
            tools,
          };

          res.send(toSend);
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      next(err);
    })
});

module.exports = router;

