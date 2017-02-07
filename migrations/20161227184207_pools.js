'use strict'

exports.up = (knex) => {
  return knex.schema.raw('CREATE EXTENSION postgis;\nALTER TABLE pools ADD COLUMN geog geography(point, 4326)');
};

exports.down = (knex) => {
  return knex.scheme.raw('ALTER TABLE pools DROP COLUMN geog');
};
