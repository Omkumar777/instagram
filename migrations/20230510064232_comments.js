/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("comments",table => {
        table.increments("id").primary();
        table.string("comments").notNullable();
        table.integer("post_id").unsigned().references("posts.id");
        table.integer("user_id").unsigned().references("users.id");
        table.integer("comment_id").unsigned().nullable().references("comments.id");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("posts")
};
