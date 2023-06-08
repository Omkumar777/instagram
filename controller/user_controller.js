
const bcrypt = require("bcrypt");
const joi = require("joi");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const otp = require('generate-password');
const { default: knex } = require("knex");
const { raw } = require("mysql");
const User = require("../model/user");
const UserService = require("../services/user_controller");
const sendmail = require("../helper/helper")
// const format = require("./helper");

let otpForVerify;
let user = {};

function settime() {
    setTimeout(() => {
        user = {},
            otpForVerify = null
    }, 2 * 1000 * 60)
}




function format(data, status = 200, message = 'ok') {
    return { status, message, data }
}



const createUser = async (req, res) => {
    try {
        const check = await UserService.findUser({ 'username': req.body.username });
        if (check) return res.status(403).json(format(null, 403, 'username not Available,Please try another username'))

        const otp1 = otp.generate({
            numbers: true,
            lowercase: false,
            length: 6,
            uppercase: false
        })
        req.body.verification = otp1;
        if (req.body.role) return res.status(404).json(format(null, 404, "You can't make as admin"))

        const pass = bcrypt.hashSync(req.body.password, 7);
        req.body.password = pass;

        const data = await UserService.createUser(req.body);
        sendmail.sendmail(req.body.email, otp1);

        res.status(200).json(format(null, 200, "Otp sent on the mail please verify"))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
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

        const user1 = await UserService.updateUserById(req.params.id,user);
        res.status(200).json(format(null, 200, "User banned"))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}




const getAllUser = async (req, res) => {
    try {
        const data = await UserService.getAllUser();
        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500, error))
    }
}
const searchUsers = async (req, res) => {
    try {
        const data = await UserService.searchUser(req.body.search,req.user.id);

        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}

const updateUser = async (req, res) => {
    try {

        const getUser =await UserService.findUserById(req.user.id);
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
            req.body.verification = otp1;
            sendmail.sendmail(req.body.email, otp1);
            req.body.email = req.user.email;
        }

        if (req.body.role) return res.status(403).json(format(null, 403, "not change to admin role"))
        req.body.updated_at = new Date;
        const user1 = await UserService.updateUserById(req.user.id,req.body);
        res.status(200).json(format(user1));

    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }

}



const privateAccount = async (req, res) => {
    try {
        data = {
            type: false
        }
        const user = await UserService.updateUserById(req.user.id,data);
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
        const user = await  UserService.updateUserById(req.user.id,data);
        res.status(200).json(format(null, 200, 'Account changed to public'));
    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }
}
module.exports = {
    createUser, login, updateUser, getAllUser, searchUsers, privateAccount, publicAccount, banUser
}