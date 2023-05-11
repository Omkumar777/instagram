const Comments = require("../model/comments");
const Posts = require("../model/posts");








function format(data, status = 200, message = 'ok') {
    return { status,  message, data }
}


const addcomment = async(req,res)=>{
    try {
        req.body.user_id= req.user.id;
        const comment =await Comments.query().insert(req.body);
        res.status(200).json(format(comment))
    } catch (error) {
        res.status(500).json(format(null,500,""+error))
    }
}
const replycomment = async(req,res)=>{
    try {
        req.body.user_id= req.user.id;
        req.body.comment_id =Number (req.params.id);
        const post = await Comments.query().findById(Number(req.params.id));
        req.body.post_id = post.post_id
        const comment =await Comments.query().insert(req.body);
        res.status(200).json(format(comment))
    } catch (error) {
        res.status(500).json(format(null,500,""+error))
    }
}


module.exports= {
    addcomment,replycomment
}