'use strict';

exports.seed = function(knex) {
  return knex('pools').del()
    .then(() => {
      return knex('pools').insert([{
        id: 1,
        type: 'generic',
        amount: 500,
        latitude: 27.985610,
        longitude: 86.923828,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        health: 1000,
        max_health: 1000,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        type: 'generic',
        amount: 500,
        latitude: 47.599493,
        longitude: -122.333713,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        health: 1000,
        max_health: 1000,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 3,
        type: 'generic',
        amount: 500,
        latitude: 47.599103,
        longitude: -122.325211,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        health: 1000,
        max_health: 1000,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('pools_id_seq', (SELECT MAX(id) FROM pools));"
      );
    });
};
