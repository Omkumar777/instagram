const express = require('express');
const router = express.Router();
const User = require("../service/user_service")
const Posts = require("../service/post_service")


router.post("/createuser",User.createUser)
router.post("/login",User.login);
router.put("/update",User.userAuthenticate,User.updateUser);
router.get("/allusers",User.adminAuthenticate,User.getAllUser);
router.get("/search",User.userAuthenticate,User.searchUsers);
router.post("/otpverify",User.otpVerifyForCreate);
router.put("/updateemail",User.userAuthenticate,User.otpVerifyForUpdate);
router.put("/banuser/:id",User.adminAuthenticate,User.banUser);

module.exports = router;