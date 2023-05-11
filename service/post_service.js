const path = require('path');
const multer = require('multer');
const Posts=require("../model/posts")
const Users =require("../model/user")
const fs= require("fs");
const Comments = require('../model/comments');




function format(data, status = 200, message = 'ok') {
    return { status,  message, data }
}

let name;
let imageName;
const storage = multer.diskStorage({
    destination: 'uploads',
   
    filename:
     function (req, file, cb) {
        imageName = name+new Date().toISOString().replace(/:/g , "-") + path.extname(file.originalname)
        cb(null, name+new Date().toISOString().replace(/:/g , "-") + path.extname(file.originalname))
    }
})


let maxSize = 20 * 1000 * 1000

const upload = multer({
    storage: storage,
    limits :{
        fileSize:maxSize
    },

    fileFilter: function (req,file, cb) {

        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase())

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the following filetypes: " + filetypes)

    }
}).single("image")

const imageUpload= async (req,res)=>{
    name = req.user.username;
    let id = req.user.id;
    const totalposts = await Posts.query().where('user_id',id);
    if(totalposts.length >= 10)return res.status(500).json(format(null,500,"User can upload only 10 images"))
    upload(req, res,  async(err)=> {
    if (err) return res.send(err);
    
    let data={
        name : imageName,
        user_id : id
    }
    const image = await Posts.query().insert(data)
    res.status(200).json(format("Success. Image Uploaded!"))
})}

const getuserposts = async (req,res)=>{
    try {
        const user = await Users.query().findById(req.params.id);
        if (user.type == false)return res.status(403).json(format(null,403,"This user is a private user .You can't see his/her posts"))
        const posts = await Posts.query().select('posts.*','users.username','users.email').joinRelated(Users).innerJoin('users','posts.user_id','users.id').where('user_id',req.params.id)
        res.status(200).json(format(posts));
    } catch (error) {
        res.status(500).json(format(null,500,""+error));
    }
}

const addLike = async (req,res)=>{
    try {
        const post = await Posts.query().findById(req.params.id);
        post.likes +=1;
        const like = await Posts.query().findById(req.params.id).update(post);
        res.status(200).json(format('total likes '+ post.likes))
    } catch (error) {
        res.status(500).json(format(null,500,error))
    }
}


const deletepost = async(req,res)=>{
    try {
        
        const post =await Posts.query().findById(req.params.id);
        if(req.user.id != post.user_id)return res.status(403).json(format(null,403,"You can't able to delete other's post"))
        const comId = await Comments.query().findOne('post_id',req.params.id);
        
        const deltcomments = await Comments.query().delete().where('comment_id',comId.id)       
       
        const deltcomments1 = await Comments.query().delete().where('post_id',req.params.id)
        
        const deltpost =await Posts.query().deleteById(req.params.id);
        fs.unlinkSync(path.dirname(__dirname)+"\\uploads\\"+post.name);
        res.status(200).json(format(null,200,"Successfully Deleted"))
    } catch (error) {
        res.status(500).json(format(null,500,""+error))
    }
}

module.exports = {

    imageUpload,getuserposts,addLike,deletepost

};
