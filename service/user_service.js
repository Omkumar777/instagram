const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
require('dotenv').config();
const nodemailer = require('nodemailer');
const otp = require('generate-password');
const { default: knex } = require("knex");
const { raw } = require("mysql");

let otpForVerify;
let user={};

function settime(){
    setTimeout(()=>{
        user = {},
        otpForVerify = null
    },60000)
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omkumar@xponential.digital',
        pass: 'opvlzarbtphyoqbu'
    }
});
function sendmail(toMail, otp) {
    const mailOptions = {
        from: 'omkumar@xponential.digital',
        to: toMail,
        subject: 'New Account created',
        text: `There is your OTP : ${otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
          
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


function format(data, status = 200, message = 'ok') {
    return { status, message, data }
}



const createUser = async (req, res) => {
    try {
        user = req.body;
        const otp1 = otp.generate({
            numbers: true,
            lowercase: false,
            length: 6,
            uppercase: false
        })
        if(req.body.role)return res.status(404).json(format(null,404,"You can't make as admin"))
        otpForVerify = otp1;
        const pass = await bcrypt.hash(user.password, 7);
        user.password = pass;
        sendmail(user.email, otp1);
        settime();
        res.status(200).json(format(null, 200, "Otp sent on the mail please verify"))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}

const otpVerifyForCreate = async (req, res) => {

    try {

        if (otpForVerify != req.body.otp) return res.status(403).json(format(null, 403, "Otp not match"))

        const data = await User.query().insert(user);
        user = {};
        res.status(200).json(format(data));
    } catch (error) {
        res.status(500).json(format(null, 500,""+ error));
    }
}

const login = async (req, res) => {
    function validate(data) {
        const valid = joi.object({
            username: joi.string().required(),
            password: joi.required()
        })
        return valid.validate(data);
    }
    try {
        const result = validate(req.body);
        if (!result.error) {
            const access_token = jwt.sign(req.body, process.env.TOKEN);
            res.json(format(access_token))
        }
        else {
            res.status(404).json(format(null, 404, result.error.details))
        }
    } catch (error) {
        res.status(500).json(format(null, 500,""+ error));
    }
}

const adminAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json(format(null, 401, 'Not Authorized'));

        jwt.verify(token, process.env.TOKEN, async (err, user) => {
            if (err) {
                return res.status(403).json(format(null, 403, err));
            }
            const data = await User.query().findOne({ username: user.username })


            if (data == null) return res.status(404).json(format(null, 404, "Username is wrong "))

            const checkPass = await bcrypt.compare(user.password, data.password)
            if (!checkPass) return res.status(404).json(format(null, 404, "Password is wrong "))

            if (!(data.role == "admin")) return res.status(404).json(format(null, 404, "you are not admin "))
            req.user = data;
            next();

        })
    } catch (error) {
        res.status(500).json(format(null, 500, error));
    }
}

const userAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json(format(null, 401, 'Not Authorized'));

        jwt.verify(token, process.env.TOKEN, async (err, user) => {
            if (err) {
                return res.status(403).json(format(null, 403, " " + err));
            }
            const data = await User.query().findOne({ username: user.username })


            if (data == null) return res.status(404).json(format(null, 404, "Username is wrong "))

            const checkPass = await bcrypt.compare(user.password, data.password)
            if (!checkPass) return res.status(404).json(format(null, 404, "Password is wrong "))
            if(data.status == false)return res.status(404).json(format(null,404,"User account deleted"))
            if (!(data.role == "user")) return res.status(404).json(format(null, 404, "you are not user "))
            req.user = data;
            next();

        })
    } catch (error) {
        res.status(500).json(format(null, 500, error));
    }
}


const banUser = async (req,res)=>{
    try {
        user.status = false;
        const user1 = await User.query().findById(req.params.id).update(user);
        res.status(200).json(format(null,200,"User"+user.username + "banned"))
    } catch (error) {
        res.status(500).json(format(null,500,""+error))
    }
}




const getAllUser = async (req, res) => {
    try {
        const data = await User.query().where('type',true).where('role','!=','admin');
        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500, error))
    }
}
const searchUsers = async (req, res) => {
    try {
        const data = await User.query().select('name','username','email','phonenumber').where("username", 'like', "%" + req.body.search + "%").where("type", true).where('id',"!=",req.user.id).where('role',"!=","admin").orWhere("name", 'like', "%" + req.body.search + "%").where("type", true).where('id',"!=",req.user.id).where('role',"!=","admin");

        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500,""+ error))
    }
}

const updateUser = async (req, res) => {
    try {
        user = {};
        if(req.body.password){
            const pass = await bcrypt.hash(req.body.password, 7);
            req.body.password = pass;
        }
        if(req.body.email){
            const otp1 = otp.generate({
                length: 6,
                numbers:true,
                symbols: false,
                uppercase: false,
                lowercase:false
            })
            otpForVerify = otp1;
            console.log(otpForVerify);
            user.email= req.body.email
            sendmail(req.body.email, otp1);
            req.body.email = req.user.email;
        }
        if(req.body.role)return res.status(403).json(format(null,403,"not change to admin role"))
        req.body.updated_at = new Date;
        const user1 = await User.query().findById(Number(req.user.id)).update(req.body);
        settime();
        res.status(200).json(format(user1));

    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }

}


const otpVerifyForUpdate = async (req, res) => {

    try {

        if (otpForVerify != req.body.otp) return res.status(403).json(format(null, 403, "Otp not match"))

        const data = await User.query().findById(Number(req.user.id)).update(user);
        user={};
        res.status(200).json(format(data));
    } catch (error) {
        res.status(500).json(format(null, 500,""+ error));
    }
}


module.exports = {
    createUser, login, updateUser, getAllUser, searchUsers,
     adminAuthenticate, userAuthenticate,otpVerifyForCreate,otpVerifyForUpdate,
     banUser
}