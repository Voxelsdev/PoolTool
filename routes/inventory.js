'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

const moment = require('moment');

const authenticate = require('../utils/authentication.js');

router.get('/inventory', authenticate, (req, res, next) => {
  const { userId } = req.token;

  if (!userId || typeof userId !== 'string') { throw boom.create(400, 'Bad Request') }

  knex('tools_users')
    .select('tools.id', 'tools.tool_name', 'tools.tier', 'tools.expiration', 'tools.durability', 'tools.type')
    .innerJoin('users', 'users.id', 'tools_users.user_id')
    .innerJoin('tools', 'tools.id', 'tools_users.tool_id')
    .where('users.auth_id', userId)
    .andWhere('tools_users.current_durability', '>', 0)
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

  if (!userId || typeof userId !== 'string') { throw boom.create(400, 'Bad Request') }

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
  const toSend = {};

  if (!userId || typeof userId !== 'string') { throw boom.create(400, 'Bad Request') }

  if (!requestedTool || typeof requestedTool !== 'number') {
    return next('The requested tool is not valid');
  }

  knex('users')
    .where('auth_id', userId)
    .first()
    .then((row) => {
      if (!row) { return next() }

      const user = camelizeKeys(row);

      knex('tools')
        .where('id', requestedTool)
        .andWhere('expiration', '>', moment().format())
        .first()
        .then((row2) => {
          if (!row2) { return next() }

          const tool = camelizeKeys(row2);

          if (user.balance >= tool.price) {
            const newBalance = user.balance - tool.price;

            return knex.transaction((trx) => {
              return knex('users')
                .where('is_admin', true)
                .first()
                .increment('balance', tool.price).transacting(trx)
                .then(() => {
                  return knex('users')
                    .where('auth_id', userId)
                    .update({
                      balance: newBalance,
                    }).transacting(trx)
                    .then(() => {
                      const newTool = decamelizeKeys({
                        toolId: tool.id,
                        userId: user.id,
                        currentDurability: tool.durability
                      });

                      toSend.balance = newBalance;
                      toSend.tool = tool;

                     return knex('tools_users')
                        .insert(newTool, '*').transacting(trx)
                        .then(() => {
                          res.send(toSend);
                        });
                    });
                })
                .then(trx.commit)
                .catch(trx.rollback);
            });
          } else {
            res.send(false);
          }
        });
      })
      .catch((err) => {
        next(err);
      });
});

router.post('/inventory/useable', authenticate, (req, res, next) => {
  const { userId } = req.token;
  const { type } = req.body;

  if (!userId || typeof userId !== 'string') { throw boom.create(400, 'Bad Request') }

  if (!type || typeof type !== 'string') { throw boom.create(400, 'Bad Request') }

  knex('tools_users')
    .select('tools.id', 'tools.tool_name', 'tools.tier', 'tools.expiration', 'tools.durability', 'tools.type')
    .innerJoin('users', 'users.id', 'tools_users.user_id')
    .innerJoin('tools', 'tools.id', 'tools_users.tool_id')
    .where('users.auth_id', userId)
    .andWhere('tools.type', type)
    .andWhere('tools_users.current_durability', '>', 0)
    .orderBy('tools.id', userId)
    .then((rows) => {
      res.send(camelizeKeys(rows));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
