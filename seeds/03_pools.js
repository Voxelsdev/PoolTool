'use strict';

exports.seed = function(knex) {
  return knex('pools').del()
    .then(() => {
      return knex('pools').insert([{
        id: 1,
        type: 'normal',
        amount: 5,
        radius: 56,
        latitude: 47.592080892786704,
        longitude: -122.32332229614258,
        expiration: new Date('2017-12-31 04:00:00-08 UTC'),
        health: 100,
        created_at: new Date('2017-01-08 19:07:46.973136-08 UTC'),
        updated_at: new Date('2017-01-08 19:07:46.973136-08 UTC'),
        geog: '0101000020E610000000000050B1945EC07D8D834EC9CB4740',
      }, {
        id: 2,
        type: 'normal',
        amount: 200,
        radius: 50,
        latitude: 47.59899900158579,
        longitude: -122.33379364013672,
        expiration: new Date('2017-01-31 04:00:00-08 UTC'),
        health: 354,
        created_at: new Date('2017-01-10 11:25:32.765406-08 UTC'),
        updated_at: new Date('2017-01-10 11:25:32.765406-08 UTC'),
        geog: '0101000020E6100000000000E05C955EC0E512D1FFABCC4740',
      }, {
        id: 3,
        type: 'normal',
        amount: 50,
        radius: 177,
        latitude: 47.60035683136677,
        longitude: -122.32905149459839,
        expiration: new Date('2017-01-31 04:00:00-08 UTC'),
        health: 177,
        created_at: new Date('2017-01-10 11:29:01.126212-08 UTC'),
        updated_at: new Date('2017-01-10 11:29:01.126212-08 UTC'),
        geog: '0101000020E61000000000002E0F955EC042531E7ED8CC4740',
      }, {
        id: 4,
        type: 'fire',
        amount: 10,
        radius: 79,
        latitude: 47.60586420377842,
        longitude: -122.3358428478241,
        expiration: new Date('2017-01-31 04:00:00-08 UTC'),
        health: 79,
        created_at: new Date('2017-01-10 11:29:48.887056-08 UTC'),
        updated_at: new Date('2017-01-10 11:29:48.887056-08 UTC'),
        geog: '0101000020E6100000000000737E955EC0CF854EF58CCD4740',
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('pools_id_seq', (SELECT MAX(id) FROM pools));"
      );
    });
};
