const { Model } = require('objection');
const knex = require('../../config/Config');
Model.knex(knex);
const Posts = require("./posts");

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
                username: { type: 'string'},
                password:{type:'string' },
                phoneNumber:{type: 'number'},
                type: {type : 'boolean'},
                verification : {type : 'string'}
            }
        }
    }
    static relationMappings = {
        Posts: {
          relation: Model.HasOneRelation,
          modelClass: Posts,
          join: {
            from: 'users.id',
            to: 'posts.user_id'
          }
        }
      };


}
module.exports = Users;