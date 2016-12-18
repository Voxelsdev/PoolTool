'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('pools', (table) => {
    table.increments();
    table.string('type').notNullable().defaultTo('generic');
    table.integer('amount').notNullable().defaultTo(0);
    table.string('latitude').notNullable();
    table.string('longitude').notNullable();
    table.time('expiration');
    table.integer('health').notNullable().defaultTo(100);
    table.integer('max_health').notNullable().defaultTo(100);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('pools');
};
