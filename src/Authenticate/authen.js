require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const format = require("../helper/helper");
const UserService = require("../services/user_services");



const userAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json(format.format(null, 401, 'Not Authorized'));

        jwt.verify(token, process.env.TOKEN, async (err, user) => {
            if (err) {

                return res.status(403).json(format.format(null, 403, " " + err));
            }
            const data = await User.query().findOne({ username: user.username });


            if (data == null) return res.status(404).json(format.format(null, 404, "Username is wrong "));

            const checkPass = bcrypt.compareSync(user.password, data.password);
            if (!checkPass) return res.status(404).json(format.format(null, 404, "Password is wrong "));
            if (data.status == false) return res.status(404).json(format.format(null, 404, "User account deleted"));
            if (!(data.role == "user")) return res.status(404).json(format.format(null, 404, "you are not user "));
            req.user = data;
            next();

        })
    } catch (error) {
        res.status(500).json(format(null, 500, error));
    }
}


const adminAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json(format.format(null, 401, 'Not Authorized'));

        jwt.verify(token, process.env.TOKEN, async (err, user) => {
            if (err) {
                return res.status(403).json(format.format(null, 403, err));
            }
            const data = await User.query().findOne({ username: user.username })


            if (data == null) return res.status(404).json(format.format(null, 404, "Username is wrong "))

            const checkPass = bcrypt.compareSync(user.password, data.password)
            if (!checkPass) return res.status(404).json(format.format(null, 404, "Password is wrong "))

            if (!(data.role == "admin")) return res.status(404).json(format.format(null, 404, "you are not admin "))
            req.user = data;
            next();

        })
    } catch (error) {
        res.status(500).json(format.format(null, 500, error));
    }
}
const verifyUser =async(req,res,next)=>{
    try {
        const user = await UserService.findUserById(req.user.id);
        if(user.verification == 'Verified'){
            return next();
        }
        res.status(403).json(format.format(null,403,'User Not Verified'));
    } catch (error) {
        res.status(500).json(format.format(null,500,""+error));
    }
}


module.exports = {
    userAuthenticate,adminAuthenticate,verifyUser
}