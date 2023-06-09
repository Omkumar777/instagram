const express = require('express');
const router = express.Router();
const Comments = require('../controller/comment_controller');
const auth =require("../Authenticate/authen");
const validation = require("../helper/joi_validation");

router.post("/addcomment",auth.userAuthenticate,auth.verifyUser,validation.comment,Comments.addComment);
router.post("/reply/:id",auth.userAuthenticate,auth.verifyUser,validation.replyComment,Comments.replyComment);
router.get("/:id",auth.userAuthenticate,auth.verifyUser,Comments.postComments)



module.exports = router;