const express = require('express');
const Comments = require('../service/comment_service');
const User = require('../service/user_service');
const router = express.Router();
const auth =require("../Authenticate/authen");


router.post("/addcomment",auth.userAuthenticate,Comments.addComment);
router.post("/reply/:id",auth.userAuthenticate,Comments.replyComment);
router.get("/:id",auth.userAuthenticate,Comments.postComments)



module.exports = router;