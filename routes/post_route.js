const express = require('express');
const router = express.Router();
const Posts = require("../service/post_service")
const User = require("../service/user_service")
const auth =require("../Authenticate/authen")



router.post("/upload",auth.userAuthenticate,Posts.imageUpload);
router.post("/addlike/:id",auth.userAuthenticate,Posts.addLike)
router.get("/getposts/:id",auth.userAuthenticate,Posts.getUserPosts)
router.delete("/deltpost/:id",auth.userAuthenticate,Posts.deletePost);
router.get("/getlikes/:id",Posts.postLikes);    
router.get("/myposts",auth.userAuthenticate,Posts.yourPosts)


module.exports = router;