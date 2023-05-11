const express = require('express');
const router = express.Router();
const photo = require("../service/post_service")
const User = require("../service/user_service")



router.post("/",User.userAuthenticate,photo.imageUpload);



module.exports = router;