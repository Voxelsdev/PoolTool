'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

const moment = require('moment');

const authenticate = require('../utils/authentication.js');

router.get('/inventory', authenticate, (req, res, next) => {
  const { userId } = req.token;

  knex('tools_users')
    .select('tools.id', 'tools.tool_name', 'tools.tier', 'tools.expiration', 'tools.durability', 'tools.type')
    .innerJoin('users', 'users.id', 'tools_users.user_id')
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

router.get('/type', authenticate, (req, res, next) => {
  const { userId } = req.token;

  knex('users')
    .where('auth_id', userId)
    .first()
    .then((row) => {
      if (!row) {
        res.redirect('/');
        return res.send();
      }

      const user = camelizeKeys(row);

      res.send(user.isAdmin ? 'admin' : 'joe shmoe');
    })
    .catch((err) => {
      console.error(err);
    });
})

router.post('/inventory', authenticate, (req, res, next) => {
  const { userId } = req.token;
  const { requestedTool } = req.body;

  if (!userId || typeof userId !== 'string') {
    return next('User ID is not valid');
  }

  if (!requestedTool || typeof requestedTool !== 'number') {
    return next('The requested tool is not valid');
  }

  knex('users')
    .where('auth_id', userId)
    .then((row) => {
      if (!row) {
        return next('No user found!');
      }
      const user = camelizeKeys(row[0]);
      return user;
    })
    .then((user) => {
      knex('tools')
        .where('id', requestedTool)
        .andWhere('expiration', '>', moment().format())
        .then((row) => {
          if (!row) {
            return next('No tool found!')
          }
          const tool = camelizeKeys(row[0]);

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
                  userId: user,
                  currentDurability: tool.durability
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
                        res.send('Rollback success');
                      })
                      .catch((err) => {
                        console.error('Rollback Failed.');
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

router.post('/inventory/useable', authenticate, (req, res, next) => {
  const { userId } = req.token;
  const { type } = req.body;

  if (!userId || typeof userId !== 'string') { throw boom.create('Not a valid user') }

  if (!type || typeof type !== 'string') { throw boom.create('Not a valid tool') }

  knex('tools_users')
    .select('tools.id', 'tools.tool_name', 'tools.tier', 'tools.expiration', 'tools.durability', 'tools.type')
    .innerJoin('users', 'users.id', 'tools_users.user_id')
    .innerJoin('tools', 'tools.id', 'tools_users.tool_id')
    .where('users.auth_id', userId)
    .andWhere('tools.type', type)
    .orderBy('tools.id', userId)
    .then((rows) => {
      res.send(camelizeKeys(rows));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
