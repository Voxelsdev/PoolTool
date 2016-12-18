'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('tools', (table) => {
    table.increments();
    table.string('tool_name').notNullable().unique();
    table.integer('tier').notNullable().defaultTo(0);
    table.time('expiration');
    table.integer('durability').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('tools');
};
