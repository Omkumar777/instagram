const { Model } = require('objection');
const knex = require('../../config/Config');
Model.knex(knex);


class Follows extends Model {
    static get tableName() {
        return 'follows';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                user_id:{type : 'integer'},
                follower_id:{type : 'integer'}
                

            }
        }
    }
}
module.exports = Follows;