'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('email').notNullable().unique();
    table.string('auth_id').notNullable().unique();
    table.string('avatar_url').notNullable().defaultTo('http://i.imgur.com/4z8QtKs.png');
    table.integer('min').notNullable().defaultTo(0);
    table.integer('max').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
