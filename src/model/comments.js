const { Model } = require('objection');
const knex = require('../../config/Config');
Model.knex(knex);


class Comments extends Model {
    static get tableName() {
        return 'comments';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                comments: { type: 'string' },
                user_id:{type : 'integer'},
                post_id:{type : 'integer'},
                comment_id:{type : 'integer'},
                

            }
        }
    }
}
module.exports = Comments;