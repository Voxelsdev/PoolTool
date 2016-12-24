'use strict';

exports.seed = function(knex, Promise) {
  return knex('tools_users').del()
    .then(() => {
      return knex('tools_users').insert([{
        tool_name: 'pickaxe',
        tier: 42,
        expiration: '2020-12-23T15:41:22-08:00',
        durability: 100000,
        price: 100.00
      }, {
        tool_name: 'shovel',
        tier: 2,
        expiration: '2020-12-23T15:41:22-08:00',
        durability: 100000,
        price: 10.00
      }, {
        tool_name: 'hammer',
        tier: 20,
        expiration: '2020-12-23T15:41:22-08:00',
        durability: 100000,
        price: 15.00
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('tools_users_id_seq', (SELECT MAX(id) FROM tools_users));"
      );
    });
};
