const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
require('dotenv').config();
const nodemailer = require('nodemailer');
const otp = require('generate-password');
const { default: knex } = require("knex");
const { raw } = require("mysql");



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
        const otp1 = otp.generate({
            length: 6,
            symbols: false,
            uppercase: true
        })

        const pass = await bcrypt.hash(req.body.password, 7);
        req.body.password = pass;

        const data = await User.query().insert(req.body);
        sendmail(req.body.email, otp1);
        res.status(200).json(format(data));
    } catch (error) {
        res.status(500).json(format(null, 500, error));
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
        res.status(500).json(format(null, 500, error));
    }
}

const adminAuthenticate = async (req, res,next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json(format(null, 401, 'Not Authorized'));

        jwt.verify(token, process.env.TOKEN, async (err, user) => {
            if (err) {
                return res.status(403).json(format(null, 403, err));
            }
            const data = await User.query().findOne({ username: user.username })

        
            if (data == null ) return res.status(404).json(format(null, 404, "Username is wrong "))

            const checkPass = await bcrypt.compare(user.password, data.password)
            if (!checkPass) return res.status(404).json(format(null, 404, "Password is wrong "))
            
            if(!(data.role =="admin")) return res.status(404).json(format(null, 404, "you are not admin "))
          
            next();
            
        })
    } catch (error) {
        res.status(500).json(format(null, 500, error));
    }
}

const userAuthenticate = async (req, res,next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json(format(null, 401, 'Not Authorized'));

        jwt.verify(token, process.env.TOKEN, async (err, user) => {
            if (err) {
                return res.status(403).json(format(null, 403, err));
            }
            const data = await User.query().findOne({ username: user.username })

        
            if (data == null ) return res.status(404).json(format(null, 404, "Username is wrong "))

            const checkPass = await bcrypt.compare(user.password, data.password)
            if (!checkPass) return res.status(404).json(format(null, 404, "Password is wrong "))
            
            if(!(data.role =="user")) return res.status(404).json(format(null, 404, "you are not user "))
            req.body.user = data.username;
            
            next();
            
        })
    } catch (error) {
        res.status(500).json(format(null, 500, error));
    }
}

const getAllUser = async (req, res) => {
    try {
        const data = await User.query();
        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500, error))
    }
}
const searchUsers = async (req, res) => {
    try {
        const data = await User.query().where("username",'like', "%"+req.body.search+"%").where("type",true).orWhere("name",'like', "%"+req.body.search+"%").where("type",true);
        
        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null, 500, error))
    }
}

const updateUser = async (req, res) => {
    try {
        const otp1 = otp.generate({
            length: 6,
            symbols: false,
            uppercase: true
        })
        req.body.updated_at = new Date;
        const user = await User.query().findById(Number(req.params.id)).update(req.body);
        sendmail(req.body.email, otp1);
        res.status(200).json(format(user));

    } catch (error) {
        res.status(500).json(format(null, 500, "" + error))
    }

}

module.exports = {
    createUser, login, updateUser, getAllUser, searchUsers, adminAuthenticate,userAuthenticate
}