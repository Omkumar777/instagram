const { Model } = require('objection');
const knex = require('../config/Config');
Model.knex(knex);


class Posts extends Model {
    static get tableName() {
        return 'posts';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                user_id:{type : 'integer'},
                likes: { type: 'integer' }


            }
        }
    }
}
module.exports = Users;