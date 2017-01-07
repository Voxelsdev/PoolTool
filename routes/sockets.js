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
          .select('*').from('tools_users')
          .innerJoin('users', 'users.id', 'tools_users.user_id')
          .innerJoin('tools', 'tools.id', 'tools_users.tool_id')
          .where('users.id', userId)
          .andWhere('tools.id', toolsUsed[i].toolId)
          .andWhere('tools_users.current_durability', '>', 0)
          .then((rows) => {
            const userTools = camelizeKeys(rows);
            const newDurability = userTools[0].currentDurability - toolsUsed[i].durabilityUsed;

            if (newDurability > -1) {
              knex('tools_users')
                .where('user_id', userId)
                .andWhere('tool_id', toolsUsed[i].toolId)
                .andWhere('current_durability', '>', 0)
                .first()
                .update({
                  current_durability: newDurability,
                })
                .catch((err) => {
                  console.log(`Setting user ${userId}'s tool ${toolsUsed[i].toolId} durability to ${newDurability} failed`);
                  console.error(err);
                });
            } else {
              const durabilitySum = userTools.reduce((inc, e, i, arr) => {
                return e.currentDurability;
              }, 0);

              if (toolsUsed[i].durabilityUsed > durabilitySum) {
                knex('users')
                  .where('id', userId)
                  .decrement('balance', reward.toFixed(2))
                  .then(() => {
                    knex('users')
                      .where('id', 1)
                      .increment('balance', reward.toFixed(2))
                      .catch((err) => {
                        console.log(`Incrementing admin balance by ${reward} failed`);
                        console.error(err);
                      });
                  })
                  .catch((err) => {
                    console.log(`Decrementing user ${userId}'s balance by ${reward} failed`);
                    console.error(err);
                  });
              } else {
                const numToolsUsed = Math.floor(toolsUsed[i].durabilityUsed / userTools[1].currentDurability);
                const remaining = durabilitySum - (numToolsUsed * userTools[1].currentDurability);

                for (let j = 0; j < numToolsUsed; j++) {
                  knex('tools_users')
                    .where('user_id', userId)
                    .andWhere('tool_id', toolsUsed[i].toolId)
                    .andWhere('current_durability', '>', 0)
                    .first()
                    .update({
                      current_durability: 0,
                    })
                    .catch((err) => {
                      console.log(`Setting user ${userId}'s tool ${toolsUsed[i].toolId} to 0 failed`);
                      console.error(err);
                    });
                }

                if (remaining > 0) {
                  knex('tools_users')
                    .where('user_id', userId)
                    .andWhere('tool_id', toolsUsed[i].toolId)
                    .andWhere('current_durability', '>', 0)
                    .first()
                    .update({
                      current_durability: usedTools[numToolsUsed].current_durability - remaining,
                    })
                    .catch((err) => {
                      console.log(`Setting user ${userId}'s tool ${toolsUsed[i].toolId} to ${remainder} failed`);
                      console.error(err);
                    });
                }
              }
            }
          })
          .catch((err) => {
            console.error(err);
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
                    console.log(`User ${userId} rolled back, user ${userId} recieved ${reward}`);
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
          });
      }

      res.send(true);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
