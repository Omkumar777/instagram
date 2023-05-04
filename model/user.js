const { Model } = require('objection');
const knex = require('../config/Config');
Model.knex(knex);

// Users Class Service
class Users extends Model {
    static get tableName() {
        return 'users';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email:{type : 'string'},
                username: { type: 'string' },
                password:{type:'string' },
                phoneNumber:{type: 'number'},
                type: {type : 'boolean'},


            }
        }
    }
}
module.exports = Users;