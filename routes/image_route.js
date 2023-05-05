const express = require('express');
const router = express.Router();
const photo = require("../service/photoUpload")

// router.use("/user");

router.post("/photo",photo.upload);


module.exports = router;