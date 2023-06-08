
const bcrypt = require("bcrypt");

const joi = require("joi");
require('dotenv').config();
const nodemailer = require('nodemailer');
const otp = require('generate-password');
const { default: knex } = require("knex");
const { raw } = require("mysql");
const User = require("../model/user");


let otpForVerify;
let user = {};

function settime() {
    setTimeout(() => {
        user = {},
            otpForVerify = null
    }, 2 * 1000 * 60)
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omkumar@xponential.digital',
        pass: process.env.email_password
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


        function validate(data) {
            const valid = joi.object({
                name: joi.string().required(),
                username: joi.string().required(),
                password: joi.required(),
                email: joi.string().email().required(),
                phoneNumber: joi.number().required()
            })
            return valid.validate(data);
        }
        const result = validate(req.body);
        if (result.error) { return res.status(500).json(format(null, 500, result.error.details)) }
        const check = await User.query().findOne('username', req.body.username);

        if (check) return res.status(403).json(format(null, 403, 'username not Available'))
        user = req.body;
        const otp1 = otp.generate({
            numbers: true,
            lowercase: false,
            length: 6,
            uppercase: false
        })
        if (req.body.role) return res.status(404).json(format(null, 404, "You can't make as admin"))
        otpForVerify = otp1;
        const pass = bcrypt.hashSync(user.password, 7);
        user.password = pass;
        sendmail(user.email, otp1);
        settime();
        res.status(200).json(format(null, 200, "Otp sent on the mail please verify , \n Valid only 2 mins"))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}

const otpVerifyForCreate = async (req, res) => {

    try {

        if (otpForVerify != req.body.otp) return res.status(403).json(format(null, 403, "Otp not match"))

        const data = await User.query().insert(user);
        user = {};
        otpForVerify = null;
        res.status(200).json(format(data));
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error));
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
        res.status(500).json(format(null, 500, "" + error));
    }
}






const banUser = async (req, res) => {
    try {
        user.status = false;

        const user1 = await User.query().findById(req.params.id).update(user);
        res.status(200).json(format(null, 200, "User banned"))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}




const getAllUser = async (req, res) => {
    try {
        const data = await User.query().where('type', true).where('status', true).where('role', '!=', 'admin');
        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500, error))
    }
}
const searchUsers = async (req, res) => {
    try {
        const data = await User.query().select('name', 'username', 'email', 'phonenumber').where("username", 'like', "%" + req.body.search + "%").where("type", true).where('id', "!=", req.user.id).where('role', "!=", "admin").orWhere("name", 'like', "%" + req.body.search + "%").where("type", true).where('id', "!=", req.user.id).where('role', "!=", "admin");

        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}

const updateUser = async (req, res) => {
    try {
        user = {};
        if (req.body.password) {
            const pass = bcrypt.hashSync(req.body.password, 7);
            req.body.password = pass;
        }
        if (req.body.email) {
            const otp1 = otp.generate({
                length: 6,
                numbers: true,
                symbols: false,
                uppercase: false,
                lowercase: false
            })
            otpForVerify = otp1;
            console.log(otpForVerify);
            user.email = req.body.email
            sendmail(req.body.email, otp1);
            req.body.email = req.user.email;
        }
        if (req.body.role) return res.status(403).json(format(null, 403, "not change to admin role"))
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
        user = {};
        otpForVerify = null;
        res.status(200).json(format(data));
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error));
    }
}
const privateAccount = async (req, res) => {
    try {
        data = {
            type: false
        }
        const user = await User.query().findById(req.user.id).update(data);
        res.status(200).json(format(null, 200, 'Account changed to private'));
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}
const publicAccount = async (req, res) => {
    try {
        data = {
            type: true
        }
        const user = await User.query().findById(req.user.id).update(data);
        res.status(200).json(format(null, 200, 'Account changed to public'));
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}
module.exports = {
    createUser, login, updateUser, getAllUser, searchUsers, privateAccount, publicAccount,
    adminAuthenticate, userAuthenticate, otpVerifyForCreate, otpVerifyForUpdate,
    banUser
}