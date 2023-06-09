const Comments = require("../model/comments");
const Posts = require("../model/posts");
const Users = require("../model/user");
const format = require("../helper/helper");
const CommentsService = require("../services/comment_services");

const addComment = async (req, res) => {
    try {
        req.body.user_id = req.user.id;
        const comment = await CommentsService.createComment(req.body);
        res.status(200).json(format.format(comment))
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error))
    }
}
const replyComment = async (req, res) => {
    try {
        req.body.user_id = req.user.id;
        req.body.comment_id = Number(req.params.id);
        const post = await CommentsService.findCommentById(Number(req.params.id));
        req.body.post_id = post.post_id
        const comment = await CommentsService.createComment(req.body);
        res.status(200).json(format.format(comment))
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error))
    }
}

const postComments = async (req, res) => {
    try {
        const comments = await CommentsService.getCommentsByPosts(Number(req.params.id));
        res.status(200).json(format.format(comments))
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error))
    }
}

module.exports = {
    addComment, replyComment, postComments
}