'use strict';

exports.seed = function(knex, Promise) {
  return knex('pools').del()
    .then(() => {
      return knex('pools').insert([{
        type: 'generic'
        amount: 500,
        latitude: 27.985610,
        longitude: 86.923828,
        expiration: '2020-12-23T15:41:22-08:00',
        health: 1000,
        max_health: 1000
      }, {
        type: 'generic'
        amount: 500,
        latitude: 47.599493,
        longitude: -122.333713,
        expiration: '2020-12-23T15:41:22-08:00',
        health: 1000,
        max_health: 1000
      }, {
        type: 'generic'
        amount: 500,
        latitude: 47.599103,
        longitude: -122.325211,
        expiration: '2020-12-23T15:41:22-08:00',
        health: 1000,
        max_health: 1000
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('pools_id_seq', (SELECT MAX(id) FROM pools));"
      );
    });
};
