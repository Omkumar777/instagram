const express = require('express');
const Comments = require('../service/comment_service');
const User = require('../service/user_service');
const router = express.Router();


router.post("/addcomment",User.userAuthenticate,Comments.addcomment);
router.post("/reply/:id",User.userAuthenticate,Comments.replycomment);
router.get("/:id",User.userAuthenticate,Comments.postcomments)



module.exports = router;