'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

const authenticate = require('../utils/authentication.js');

router.get('/inventory', authenticate, (req, res, next) => {
  const { userId } = req.token;

  knex('tools_users')
    .select('tools.id', 'tools.tool_name', 'tools.tier', 'tools.expiration', 'tools.durability')
    .innerJoin('users', 'users.auth_id', 'tools_users.user_id')
    .innerJoin('tools', 'tools.id', 'tools_users.tool_id')
    .where('users.auth_id', userId)
    .orderBy('tools.id', 'DESC')
    .then((rows) => {
      const tools = camelizeKeys(rows);

      res.send(tools);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/inventory', authenticate, (req, res, next) => {
  const { userId } = req.token;
  const { balance, toolType } = req.body;
  
});

module.exports = router;
