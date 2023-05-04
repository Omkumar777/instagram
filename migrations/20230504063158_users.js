/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users",table => {
    table.increments("id").primary();
    table.string("name", 45).notNullable();
    table.string("username",50).notNullable().unique();
    table.string("password",100).notNullable();
    table.string("email",50).notNullable();
    table.bigInteger("phoneNumber",10);
    table.boolean('type').defaultTo(true);
    table.string("role").defaultTo("user");
    table.timestamp("created at").defaultTo(knex.fn.now());
    table.timestamp("updated at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users")
  
};
