/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("follows",table => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().references("users.id");
        table.integer("follower_id").unsigned().references("users.id");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("follows")
};