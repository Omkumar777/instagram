const express = require('express');
const router = express.Router();
const Posts = require("../service/post_service")
const User = require("../service/user_service")



router.post("/",User.userAuthenticate,Posts.imageUpload);
router.post("/addlike/:id",Posts.addLike)
router.get("/getposts/:id",Posts.getuserposts)
router.delete("/deltpost/:id",User.userAuthenticate,Posts.deletepost)


module.exports = router;