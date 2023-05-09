const express = require('express');
const router = express.Router();
const photo = require("../service/photoUpload")

router.use("/image",router);

router.post("/photo", (req, res) => {
    photo.upload(req, res, function (err) {
        if (err) return res.send(err);
        res.send("Success. Image Uploaded!")
    })
});


module.exports = router;