const express = require('express');
const router = express.Router();
const User = require("../service/user_service")
const Posts = require("../service/post_service");
const Follows = require('../service/follow_service');
const auth =require("../Authenticate/authen")


router.post("/createuser",User.createUser);
router.post("/login",User.login);
router.put("/update",auth.userAuthenticate,User.updateUser);
router.get("/allusers",auth.adminAuthenticate,User.getAllUser);
router.get("/search",auth.userAuthenticate,User.searchUsers);
router.post("/otpverify",User.otpVerifyForCreate);
router.put("/updateemail",auth.userAuthenticate,User.otpVerifyForUpdate);
router.put("/banuser/:id",auth.adminAuthenticate,User.banUser);
router.post("/follow/:id",auth.userAuthenticate,Follows.follow);
router.get("/request",auth.userAuthenticate,Follows.requestList)
router.put("/approve/:id",auth.userAuthenticate,Follows.approveRequest);
router.put("/reject/:id",auth.userAuthenticate,Follows.rejectRequest);
router.put("/private",auth.userAuthenticate,User.privateAccount);
router.put("/public",auth.userAuthenticate,User.publicAccount);

module.exports = router;