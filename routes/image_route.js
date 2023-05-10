const express = require('express');
const router = express.Router();
const photo = require("../service/photoUpload")



router.post("/", (req, res) => {
    photo.upload(req, res, function (err) {
        if (err) return res.send(err);
        res.send("Success. Image Uploaded!")
    })
});


module.exports = router;