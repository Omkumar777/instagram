const { Model } = require('objection');
const knex = require('../../config/Config');
Model.knex(knex);


class Requested extends Model {
    static get tableName() {
        return 'requested';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                user_id:{type : 'integer'},
                resquester_id:{type : 'integer'}
                

            }
        }
    }
}
module.exports = Requested;