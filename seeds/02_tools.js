'use strict';

exports.seed = function(knex, Promise) {
  return knex('tools').del()
    .then(() => {
      return knex('tools').insert([{
        id: 1,
        tool_name: 'pickaxe',
        tier: 42,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 100000,
        price: 100.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        tool_name: 'shovel',
        tier: 2,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 100000,
        price: 10.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 3,
        tool_name: 'hammer',
        tier: 20,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 100000,
        price: 15.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('tools_id_seq', (SELECT MAX(id) FROM tools));"
      );
    });
};
