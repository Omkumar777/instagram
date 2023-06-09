const fs = require("fs");
const path = require('path');
const multer = require('multer');

const Posts = require("../model/posts")
const Users = require("../model/user")
const Comments = require('../model/comments');
const Likes = require('../model/likes');
const Follows = require('../model/follow');
const UserService = require("../services/user_services");
const FollowService = require("../services/follow_services");
const PostService = require("../services/post_services");
const format = require("../helper/helper");
const CommentsService = require("../services/comment_services");



let name;
let imageName;
const storage = multer.diskStorage({
    destination: 'uploads',

    filename:
        function (req, file, cb) {
            imageName = name + new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname)
            cb(null, name + new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname))
        }
})


let maxSize = 20 * 1000 * 1000

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },

    fileFilter: function (req, file, cb) {

        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase())

        if (mimetype && extname) {

            return cb(null, true);
        }

        cb(format.format(null, 400, "Error: File upload only supports the following filetypes: " + filetypes))

    }
}).single("image")

const imageUpload = async (req, res) => {
    try {
        name = req.user.username;
        let id = req.user.id;
        const totalposts = await PostService.getPostByUserCheck(id);
        if (totalposts.length >= 10) return res.status(400).json(format.format(null, 400, "User can upload maximum of 10 images"))

        uploads(req, res, async function (err) {
            if (err) return res.send(err);
            let data = {

                name: imageName,
                
                photo: fs.readFileSync(path.dirname(path.dirname(__dirname)) + "\\uploads\\" + imageName).byteLength,
                user_id: id
            }
            const image = await Posts.query().insert(data)

            res.status(200).json(format.format("Success. Image Uploaded!"))
        })
    }
    catch (err) {
        res.status(400).json(format.format(null, 400, "" + err))
    }
}

const getUserPosts = async (req, res) => {
    try {

        const user = await UserService.findUserById(Number(req.params.id));

        const follow = await FollowService.findfollow({ 'user_id': Number(req.params.id), 'follower_id': req.user.id });

        if (!follow && user.type == false) return res.status(403).json(format.format(null, 403, "This user is a private user .You can't see his/her posts"))
        const posts = await PostService.getPostByUser(Number(req.params.id));
        res.status(200).json(format.format(posts));
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error));
    }
}
const yourPosts = async (req, res) => {
    try {

        const posts = await PostService.getYourPost(req.user.id);
        res.status(200).json(format.format(posts));
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error));
    }
}
const addLike = async (req, res) => {
    try {
        const post = await PostService.findById(Number(req.params.id));

        if (!post) return res.status(404).json(format.format(null, 404, 'Post not found'));

        const likes = await PostService.getLikes(Number(req.params.id), req.user.id);

        if (likes.length == 0) {
            let liked = {
                post_id: Number(req.params.id),
                user_id: req.user.id,
            }
            const addlike = await PostService.addLike(liked);
            post.likes += 1;
            const like = await PostService.updatePostById(Number(req.params.id), post);
            res.status(200).json(format.format('total likes ' + post.likes));
        }
        else {
            post.likes -= 1;
            const likes = await PostService.deleteLike(Number(req.params.id), req.user.id);
            const like = await PostService.updatePostById(Number(req.params.id), post);
            res.status(200).json(format.format('total likes ' + post.likes))
        }
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error))
    }
}


const deletePost = async (req, res) => {
    try {

        const post = await PostService.findById(Number(req.params.id));
        if(!post){return res.status(404).json(format.format(null,404,'Post Not Found'))}
        if (req.user.id != post.user_id) return res.status(403).json(format.format(null, 403, "You can't able to delete other's post"))
        const comId = await CommentsService.getComments({ post_id: req.params.id });
       let array = [];
        for (let index = 0; index < comId.length; index++) {
     
        array.push(comId[index].id)
       }
      
        if (comId) {
            
            const deltcomments = await CommentsService.deleteCommentsByCommentsId(array)
            
        };
        const deltcomments1 = await CommentsService.deleteCommentsByPostId(Number(req.params.id));
        const deltlikes = await PostService.deleteLikeByPostId(Number(req.params.id));
        const deltpost = await PostService.deletePost(Number(req.params.id));
        fs.unlinkSync(path.dirname(path.dirname(__dirname)) + "\\uploads\\" + post.name);
        res.status(200).json(format.format(null, 200, "Successfully Deleted"))
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error))
    }
}

const postLikes = async (req, res) => {
    try {
        const likes = await PostService.getPostLikes(Number(req.params.id));
        res.status(200).json(format.format(likes))
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error));
    }
}

module.exports = {

    imageUpload, getUserPosts, addLike, deletePost, postLikes, yourPosts

};
