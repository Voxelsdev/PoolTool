'use strict';

exports.seed = function(knex) {
  return knex('tools_users').del()
    .then(() => {
      return knex('tools_users').insert([{
        id: 1,
        tool_id: 1,
        user_id: 1,
        current_durability: 99999,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        tool_id: 1,
        user_id: 1,
        current_durability: 50000,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 3,
        tool_id: 3,
        user_id: 1,
        current_durability: 10,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('tools_users_id_seq', (SELECT MAX(id) FROM tools_users));"
      );
    });
};
