'use strict';

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{

      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
