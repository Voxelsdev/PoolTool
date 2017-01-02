'use strict';

exports.seed = function(knex) {
  return knex('pools').del()
    .then(() => {
      return knex('pools').insert([{
        id: 1,
        type: 'normal',
        amount: 500,
        radius: 432,
        latitude: 47.60608166549589,
        longitude: -122.329158782959,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        health: 1000,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        geog: '0101000020E6100000010000F010955EC04A01821594CD4740',
      }, {
        id: 2,
        type: 'normal',
        amount: 500,
        radius: 432,
        latitude: 47.60046478252194,
        longitude: -122.33302116394043,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        health: 1000,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        geog: '0101000020E61000000000003850955EC06EAAAD07DCCC4740',
      }, {
        id: 3,
        type: 'normal',
        amount: 500,
        radius: 432,
        latitude: 47.60971011368495,
        longitude: -122.341947555542,
        expiration: new Date('2020-12-23 15:41:22 UTC'),
        health: 1000,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC'),
        geog: '0101000020E610000001000078E2955EC09D2823FB0ACE4740',
      }, {
        id: 4,
        type: 'normal',
        amount: 1000,
        radius: 791,
        latitude: 47.59894084200572,
        longitude: -122.33383655548096,
        expiration: new Date ('2017-01-31 04:00:00-08 UTC'),
        health: 100,
        created_at: new Date ('2017-01-01 21:39:37.866888-08 UTC'),
        updated_at: new Date ('2017-01-01 21:39:37.866888-08 UTC'),
        geog: '0101000020E6100000000000945D955EC09E53F017AACC4740',
      }, {
        id: 5,
        type: 'normal',
        amount: 500,
        radius: 559,
        latitude: 47.60364997609338,
        longitude: -122.31703519821167,
        expiration: new Date ('2017-01-31 04:00:00-08 UTC'),
        health: 100,
        created_at: new Date ('2017-01-01 21:40:27.129384-08 UTC'),
        updated_at: new Date ('2017-01-01 21:40:27.129384-08 UTC'),
        geog: '0101000020E61000000000004E4A945EC0B0C6046744CD4740',
      }, {
        id: 6,
        type: 'normal',
        amount: 500,
        radius: 559,
        latitude: 47.60336061629135,
        longitude: -122.31707811355591,
        expiration: new Date ('2017-01-31 04:00:00-08 UTC'),
        health: 100,
        created_at: new Date ('2017-01-01 21:40:47.114768-08 UTC'),
        updated_at: new Date ('2017-01-01 21:40:47.114768-08 UTC'),
        geog: '0101000020E6100000000000024B945EC03755B1EB3ACD4740',
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('pools_id_seq', (SELECT MAX(id) FROM pools));"
      );
    });
};
