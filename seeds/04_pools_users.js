'use strict';

exports.seed = function(knex) {
  return knex('pools_users').del()
    .then(() => {
      return knex('pools_users').insert([{
        id: 1,
        pool_id: 1,
        user_id: 1,
        percent: 90.0,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        pool_id: 1,
        user_id: 1,
        percent: 50.0,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 3,
        pool_id: 3,
        user_id: 1,
        percent: 10.0,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('pools_users_id_seq', (SELECT MAX(id) FROM pools_users));"
      );
    });
};
