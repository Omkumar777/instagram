const fs = require("fs");
const path = require('path');
const multer = require('multer');

const Posts = require("../model/posts")
const Users = require("../model/user")
const Comments = require('../model/comments');
const Likes = require('../model/likes');
const Follows = require('../model/follow');




function format(data, status = 200, message = 'ok') {
    return { status, message, data }
}

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

        cb(format(null, 500, "Error: File upload only supports the following filetypes: " + filetypes))

    }
}).single("image")

const imageUpload = async (req, res) => {
    try{
    name = req.user.username;
    let id = req.user.id;
    const totalposts = await Posts.query().where('user_id', id);
    if (totalposts.length >= 10) return res.status(500).json(format(null, 500, "User can upload maximum of 10 images"))
    
    uploads(req, res,async function (err)  {
        if (err) return res.send(err);
        
        let data = {
            
            name: imageName,
            photo: fs.readFileSync(path.dirname(__dirname) + "\\uploads\\" + imageName).byteLength,
            user_id: id
        }
        const image = await Posts.query().insert(data)
        
        res.status(200).json(format("Success. Image Uploaded!"))
    })}
    catch(err){
        res.status(500).json(format(null,500,""+err))
    }
}

const getUserPosts = async (req, res) => {
    try {
        
        const user = await Users.query().findById(Number(req.params.id));

        const follow = await Follows.query().findOne({'user_id':Number(req.params.id),'follower_id':req.user.id})
    
        if (!follow && user.type == false  ) return res.status(403).json(format(null, 403, "This user is a private user .You can't see his/her posts"))
        const posts = await Posts.query().select('posts.name','posts.photo','posts.likes', 'users.username', 'users.email').joinRelated(Users).innerJoin('users', 'posts.user_id', 'users.id').where('user_id',Number(req.params.id))
        res.status(200).json(format(posts));
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error));
    }
}
const yourPosts = async (req, res) => {
    try {

        const posts = await Posts.query().select('posts.name','posts.likes').joinRelated(Users).innerJoin('users', 'posts.user_id', 'users.id').where('user_id', req.user.id)
        res.status(200).json(format(posts));
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error));
    }
}
const addLike = async (req, res) => {
    try {
        const post = await Posts.query().findById(req.params.id);
        
        if(!post)return res.status(404).json(format(null,404,'not found'))
        const follow = await Follows.query().findOne({'user_id':post.user_id,'follower_id':req.user.id})
        if(!follow)return res.status(403).json(format(null,403,"can't like to private users posts"))
        const likes = await Likes.query().where('post_id', Number(req.params.id)).where('user_id', req.user.id);

        if (likes.length == 0) {
            let liked = {
                post_id: Number(req.params.id),
                user_id: req.user.id,
            }
            const addlike = await Likes.query().insert(liked);
            post.likes += 1;
            const like = await Posts.query().findById(req.params.id).update(post);
            res.status(200).json(format('total likes ' + post.likes));
        }
        else {
            post.likes -= 1;
            const likes = await Likes.query().where('post_id', Number(req.params.id)).where('user_id', req.user.id).delete();
            const like = await Posts.query().findById(req.params.id).update(post);
            res.status(200).json(format('total likes ' + post.likes))
        }
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}


const deletePost = async (req, res) => {
    try {

        const post = await Posts.query().findById(Number (req.params.id));
        
        if (req.user.id != post.user_id) return res.status(403).json(format(null, 403, "You can't able to delete other's post"))
        const comId = await Comments.query().findOne('post_id', req.params.id);
        if(comId){const deltcomments = await Comments.query().delete().where('comment_id', comId.id)};
        const deltcomments1 = await Comments.query().delete().where('post_id', req.params.id);
        const deltlikes = await Likes.query().delete().where('post_id', req.params.id);
        const deltpost = await Posts.query().deleteById(req.params.id);
        fs.unlinkSync(path.dirname(__dirname) + "\\uploads\\" + post.name);
        res.status(200).json(format(null, 200, "Successfully Deleted"))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}

const  postLikes = async (req, res) => {
    try {
        const likes = await Likes.query().select('users.username').joinRelated(Users).innerJoin('users', 'likes.user_id', 'users.id').where('likes.post_id', Number(req.params.id));
        res.status(200).json(format(likes))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error));
    }
}

module.exports = {

    imageUpload, getUserPosts, addLike, deletePost, postLikes,yourPosts

};
