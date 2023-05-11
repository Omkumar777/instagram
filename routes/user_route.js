const express = require('express');
const router = express.Router();
const User = require("../service/user_service")
const Posts = require("../service/post_service")

router.use("/user",router);

router.post("/createuser",User.createUser)
router.post("/login",User.login);
router.put("/",User.userAuthenticate,User.updateUser);
router.get("/",User.getAllUser)
router.get("/search",User.searchUsers);
router.post("/otpverify",User.otpVerifyForCreate);
router.put("/updateemail",User.userAuthenticate,User.otpVerifyForUpdate)

module.exports = router;