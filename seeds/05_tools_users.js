'use strict';

exports.seed = function(knex) {
  return knex('tools_users').del()
    .then(() => {
      return knex('tools_users').insert([{
        tool_id: 1,
        user_id: 107675765010794042565,
        current_durability: 99999,
      }, {
        tool_id: 1,
        user_id: 107675765010794042565,
        current_durability: 50000,
      }, {
        tool_id: 3,
        user_id: 107675765010794042565,
        current_durability: 10,
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('tools_users_id_seq', (SELECT MAX(id) FROM tools_users));"
      );
    });
};
