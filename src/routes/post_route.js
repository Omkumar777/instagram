const express = require('express');
const router = express.Router();
const Posts = require("../controller/post_controller")
const User = require("../controller/user_controller")
const auth =require("../Authenticate/authen")



router.post("/upload",auth.userAuthenticate,auth.verifyUser,Posts.imageUpload);
router.post("/addlike/:id",auth.userAuthenticate,auth.verifyUser,Posts.addLike)
router.get("/getposts/:id",auth.userAuthenticate,auth.verifyUser,Posts.getUserPosts)
router.delete("/deltpost/:id",auth.userAuthenticate,auth.verifyUser,Posts.deletePost);
router.get("/getlikes/:id",Posts.postLikes);    
router.get("/myposts",auth.userAuthenticate,auth.verifyUser,Posts.yourPosts)


module.exports = router;