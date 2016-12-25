'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('tools', (table) => {
    table.increments();
    table.string('tool_name').notNullable().unique();
    table.integer('tier').notNullable().defaultTo(0);
    table.timestamp('expiration').defaultTo(knex.fn.now());
    table.integer('durability').notNullable().defaultTo(0);
    table.decimal('price').notNullable().defaultTo(0);
    table.string('icon_url').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('tools');
};
