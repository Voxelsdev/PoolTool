'use strict';

exports.seed = function(knex, Promise) {
  return knex('tools').del()
    .then(() => {
      return knex('tools').insert([{
        id: 1,
        tool_name: 'pickaxe',
        tier: 30,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 75,
        price: 100.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        type: 'normal',
      }, {
        id: 2,
        tool_name: 'shovel',
        tier: 1,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 10,
        price: 10.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        type: 'normal',
      }, {
        id: 3,
        tool_name: 'hammer',
        tier: 40,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 5,
        price: 15.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        type: 'fire',
      }, {
        id: 4,
        tool_name: 'jack hammer',
        tier: 100,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 20,
        price: 150.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        type: 'normal',
      }, {
        id: 5,
        tool_name: 'pickaxe',
        tier: 30,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 10,
        price: 25.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        type: 'fire',
      }, {
        id: 6,
        tool_name: 'shovel',
        tier: 5,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        durability: 10,
        price: 5.00,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        type: 'fire',
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('tools_id_seq', (SELECT MAX(id) FROM tools));"
      );
    });
};
