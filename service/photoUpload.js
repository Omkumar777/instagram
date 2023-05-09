const path = require('path');
const multer = require('multer');
const { log } = require('console');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {


        cb(null, 'uploads')
    },
    filename:
     function (req, file, cb) {
        cb(null, file.originalname)
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
}).single("mypic")


module.exports = {upload};
