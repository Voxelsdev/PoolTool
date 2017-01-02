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

  knex('tools')
    .where('expiration', '>', moment().format())
    .then((rows) => {
      if (!rows) { throw boom.create('No tools found, please check connection')}

      const tools = camelizeKeys(rows);

      const toSend = tools.map((e, i) => {
        const newTool = e;

        delete newTool.createdAt;
        delete newTool.updatedAt;
        delete newTool.id;

        return newTool;
      });

      res.send(toSend);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;

