'use strict'

exports.up = (knex) => {
  return knex.schema.raw('ALTER TABLE pools ADD COLUMN geog geography(point, 4326)');
};

exports.down = (knex) => {
  return knex.scheme.raw('ALTER TABLE pools DROP COLUMN geog');
};
