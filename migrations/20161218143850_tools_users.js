'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('tools_users', (table) => {
    table.increments();
    table.integer('tool_id')
      .notNullable()
      .references('id')
      .inTable('tools')
      .onDelete('CASCADE');
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.integer('current_durability').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('tools_users');
};
