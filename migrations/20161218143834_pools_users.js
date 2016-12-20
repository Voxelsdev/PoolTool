'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('pools_users', (table) => {
    table.increments();
    table.integer('pool_id')
      .notNullable()
      .references('id')
      .inTable('pools')
      .onDelete('CASCADE');
    table.string('user_id')
      .notNullable()
      .references('auth_id')
      .inTable('users')
      .onDelete('CASCADE');
    table.float('percent').notNullable().defaultTo(0.0);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('pools_users');
};
