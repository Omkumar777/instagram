const express = require('express');
const router = express.Router();
const User = require("../controller/user_controller")
const Follows = require('../controller/follow_controller');
const auth =require("../Authenticate/authen");
const joiValidation =require("../helper/joi_validation");
const helper =require("../helper/helper")

router.post("/createuser",joiValidation.validate,User.createUser);
router.post("/login",User.login);
router.put("/update",auth.userAuthenticate,auth.verifyUser,User.updateUser);
router.get("/allusers",auth.adminAuthenticate,User.getAllUser);
router.get("/search",auth.userAuthenticate,auth.verifyUser,User.searchUsers);
router.post("/otpverify",auth.userAuthenticate,joiValidation.checkOtp,helper.otpVerify);
router.put("/banuser/:id",auth.adminAuthenticate,User.banUser);
router.post("/follow/:id",auth.userAuthenticate,auth.verifyUser,Follows.follow);
router.get("/request",auth.userAuthenticate,auth.verifyUser,Follows.requestList)
router.put("/approve/:id",auth.userAuthenticate,auth.verifyUser,Follows.approveRequest);
router.put("/reject/:id",auth.userAuthenticate,auth.verifyUser,Follows.rejectRequest);
router.put("/private",auth.userAuthenticate,auth.verifyUser,User.privateAccount);
router.put("/public",auth.userAuthenticate,auth.verifyUser,User.publicAccount);

module.exports = router;