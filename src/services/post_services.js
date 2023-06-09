const Post = require("../model/posts");
const Users = require("../model/user");
const Like = require("../model/likes");


const getPostByUser=async(id)=>{
    return await Post.query().select('posts.name','posts.photo','posts.likes', 'users.username', 'users.email').joinRelated(Users).innerJoin('users', 'posts.user_id', 'users.id').where('user_id',Number(id))
}
const getPostByUserCheck = async (id)=>{
    return await Post.query().where('user_id', id);
}

const getYourPost = async(id)=>{
    return Post.query().select('posts.name','posts.likes').joinRelated(Users).innerJoin('users', 'posts.user_id', 'users.id').where('user_id', id)
}
const findById = async(id)=>{
    return await Post.query().findById(id);
}
const updatePostById = async(id,data)=>{
    return await Post.query().findById(id).update(data);
}
const deletePost = async(id)=>{
    return await Post.query().deleteById(id);
}

const getLikes =async (postId,userId)=>{
    return await Like.query().where('post_id', Number(postId)).where('user_id', userId);
}
const getPostLikes = async(id)=>{
    return await Like.query().select('users.username').joinRelated(Users).innerJoin('users', 'likes.user_id', 'users.id').where('likes.post_id', id)
}
const addLike =async (data)=>{
    return await Like.query().insert(data);
}
const deleteLike = async(postId,userId)=>{
    return await Like.query().where('post_id', postId).where('user_id', userId).delete();
}
const deleteLikeByPostId = async(id)=>{
    return await Like.query().delete().where('post_id', id);
}

module.exports ={
    getPostByUser,getYourPost,findById,updatePostById,getLikes,addLike,deleteLike,deleteLikeByPostId,deletePost,getPostLikes,
    getPostByUserCheck
}