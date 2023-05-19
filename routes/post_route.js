const express = require('express');
const router = express.Router();
const Posts = require("../service/post_service")
const User = require("../service/user_service")



router.post("/upload",User.userAuthenticate,Posts.imageUpload);
router.post("/addlike/:id",User.userAuthenticate,Posts.addLike)
router.get("/getposts/:id",User.userAuthenticate,Posts.getuserposts)
router.delete("/deltpost/:id",User.userAuthenticate,Posts.deletepost);
router.get("/getlikes/:id",Posts.postlikes);    
router.get("/myposts",User.userAuthenticate,Posts.yourposts)


module.exports = router;