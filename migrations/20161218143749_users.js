'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('email').notNullable().unique();
    table.string('auth_id').notNullable().unique();
    table.string('avatar_url').notNullable().defaultTo('http://i.imgur.com/4z8QtKs.png');
    table.decimal('balance').notNullable().defaultTo(100.00);
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
