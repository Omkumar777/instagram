const path = require('path');
const multer = require('multer');
const { log } = require('console');
const Posts=require("../model/posts")
const Users =require("../model/user")



function format(data, status = 200, message = 'ok') {
    return { status,  message, data }
}

let name;
let imageName;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {


        cb(null, 'uploads')
    },
    filename:
     function (req, file, cb) {
        imageName = name + path.extname(file.originalname)
        cb(null, name + path.extname(file.originalname))
    }
})

let maxSize = 20 * 1000 * 1000

const upload = multer({
    storage: storage,

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
    name = req.body.username;
    let id = req.body.id;
    upload(req, res,  async(err)=> {
    if (err) return res.send(err);
    
    let data={
        name : imageName,
        user_id : id
    }
    const image = await Posts.query().insert(data)
    res.send("Success. Image Uploaded!")
})}

const getposts = async (req,res)=>{
    try {
        const posts = await Posts.query().select('posts.*','users.username','users.email').joinRelated(Users).innerJoin('users','posts.user_id','users.id')
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(""+error);
    }
}

const addLike = async(req,res=>{
    try {
        
    } catch (error) {
        res.status(500).
    }
})


module.exports = {
    imageUpload,getposts

};
