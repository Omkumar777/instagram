const Comment = require("../model/comments");
const Users = require("../model/user");

const createComment = async(data)=>{
    return await Comment.query().insert(data);
}

const findCommentById = async(id)=>{
    return await Comment.query().findById(id);
}
const getComments = async(payloads)=>{
    return await Comment.query().where(payloads);
}

const getCommentsByPosts = async(id)=>{
    return await Comment.query().select('users.username', 'comments.comments', 'comments.created_at').joinRelated(Users).leftJoin('users','comments.user_id', 'users.id').where({ 'post_id': id });
}
const deleteCommentsByCommentsId = async(id)=>{
  for (let index = 0; index < id.length; index++) {
    await Comment.query().delete().where('comment_id',id[index] );
    
  }
    return  true;
}
const deleteCommentsByPostId = async(id)=>{
    return await Comment.query().delete().where('post_id', id);
}

module.exports = {
    createComment,findCommentById,getCommentsByPosts,getComments,deleteCommentsByCommentsId,deleteCommentsByPostId
}