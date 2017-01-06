'use strict';

const router = require('express').Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

const authenticate = require('../utils/authentication.js');

router.post('/end', (req, res, next) => {
  const { poolId, userId, reward, toolsUsed, auth } = req.body;

  if (auth !== process.env.AUTH) {
    res.sendStatus(401);
  }

  knex('pools')
    .where('id', poolId)
    .update({
      expiration: new Date(),
    })
    .catch((err) => {
      console.error(err);
      res.send(false);
    })

  knex('users')
    .where('id', userId)
    .increment('balance', reward.toFixed(2))
    .then(() => {
      let rollback = false;

      for (let i = 0; i < toolsUsed.length; i++) {
        knex('tools_users')
          .innerJoin('users', 'users.id', 'tools_users.user_id')
          .innerJoin('tools', 'tools.id', 'tools_users.tool.id')
          .where('users.id', userId)
          .andWhere('tools.id', toolsUsed[i].toolId)
          .andWhere('tools_users.current_durability', '>', 0)
          .first()
          .decrement('current_durability', toolsUsed[i].durabilityUsed)
          .from('tools_users')
          .then(() => {
            console.log('tool updated');
          })
          .catch((err) => {
            console.error(err);
            rollback = true;
          });
      }

      if (rollback) {
        for (let i = 0; i < toolsUsed; i++) {
          knex('tools_users')
            .innerJoin('users', 'users.id', 'tools_users.user_id')
            .innerJoin('tools', 'tools.id', 'tools_users.tool.id')
            .where('users.id', userId)
            .andWhere('tools.id', toolsUsed[i].toolId)
            .first()
            .increment('tools_users.current_durability', toolsUsed[i].durabilityUsed)
            .then(() => {

              console.log('tool rolled back');

              knex('users')
                .where('id', userId)
                .decrement('balance', reward.toFixed(2))
                .then(() => {
                  console.log(`User ${userId} rolled back, balanceRolledBack: ${reward}`);
                })
                .catch((err) => {
                  console.log(`User ${userId}'s balance needs to be rolled back by ${reward}`);
                });
            })
            .catch((err) => {
              console.log('------------------------')
              console.log('tool rollback failed at:');
              console.log(`User: ${userId} -- toolInfo: ${toolsUsed[i]} -- reward missed: ${reward}`)
              console.error(err);
            });
        }
      }

      res.send(true);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
