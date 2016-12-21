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
  const { requestedTool } = req.body;

  knex('users')
    .where('auth_id', userId)
    .then((row) => {
      if (!row) {
        return next('No user found!');
      }
      const user = camelizeKeys(row);

      return user;
    })
    .then((user) => {
      knex('tools')
        .where('tool_name', requestedTool)
        .then((row) => {
          if (!row) {
            return next('No tool found!')
          }
          const tool = camelizeKeys(row);

          return tool;
        })
        .then((tool) => {
          if (user.balance >= tool.price) {
            const newBalance = user.balance - tool.price;

            knex('users')
              .where('auth_id', userId)
              .update({
                balance: newBalance
              })
              .then((user) => {
                const newTool = decamelizeKeys({
                  toolId: tool.id,
                  userId: userId
                });

                const toSend = {
                  balance: newBalance,
                  tool: tool
                };

                knex('tools_users')
                  .insert(newTool, '*')
                  .then((row) => {
                    res.send(toSend);
                  })
                  .catch((err) => {
                    console.error('Insert failed: rolling back.');
                    console.error(err);

                    knex('users')
                      .where('auth_id', userId)
                      .update({
                        balance: user.balance
                      })
                      .then((user) => {
                        res.send('Rollback success, ')
                      })
                      .catch((err) => {
                        console.error('Rollback Failed');
                        console.error(err);
                      });
                  });
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            res.send('You cannot afford this tool!');
          }
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
