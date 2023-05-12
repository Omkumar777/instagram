/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("likes",table => {
        table.increments("id").primary();
        table.integer("post_id").unsigned().references("posts.id");
        table.integer("user_id").unsigned().references("users.id");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("likes")
};
