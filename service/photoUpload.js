const path = require('path');
const multer = require('multer');
const { log } = require('console');


let name;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {


        cb(null, 'uploads')
    },
    filename:
     function (req, file, cb) {
        cb(null, name + path.extname(file.originalname))
    }
})

let maxSize = 20 * 1000 * 1000

const upload = multer({
    storage: storage,

    fileFilter: function (req,file, cb) {

        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase())

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the following filetypes: " + filetypes)

    }
}).single("image")

const imageUpload= async(req,res)=>{
    name = req.body.user;
    upload(req, res, function (err) {
    if (err) return res.send(err);
    res.send("Success. Image Uploaded!")
})}

module.exports = {imageUpload};
