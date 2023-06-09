const { Model } = require('objection');
const knex = require('../../config/Config');
Model.knex(knex);


class Likes extends Model {
    static get tableName() {
        return 'likes';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                user_id:{type : 'integer'},
                post_id:{type : 'integer'}
                

            }
        }
    }
}
module.exports = Likes;