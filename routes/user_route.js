const express = require('express');
const router = express.Router();
const User = require("../service/user_service")
const Posts = require("../service/post_service");
const Follows = require('../service/follow_service');



router.post("/createuser",User.createUser);
router.post("/login",User.login);
router.put("/update",User.userAuthenticate,User.updateUser);
router.get("/allusers",User.adminAuthenticate,User.getAllUser);
router.get("/search",User.userAuthenticate,User.searchUsers);
router.post("/otpverify",User.otpVerifyForCreate);
router.put("/updateemail",User.userAuthenticate,User.otpVerifyForUpdate);
router.put("/banuser/:id",User.adminAuthenticate,User.banUser);
router.post("/follow/:id",User.userAuthenticate,Follows.follow);
router.get("/request",User.userAuthenticate,Follows.requestList)
router.put("/approve/:id",User.userAuthenticate,Follows.approveRequest);
router.put("/reject/:id",User.userAuthenticate,Follows.rejectRequest);
router.put("/private",User.userAuthenticate,User.privateAccount);
router.put("/public",User.userAuthenticate,User.publicAccount);

module.exports = router;