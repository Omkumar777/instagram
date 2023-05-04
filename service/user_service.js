const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
require('dotenv').config();
const nodemailer = require('nodemailer');
const otp = require('generate-password')



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


function format(data,status=200,message='ok'){
    return {status , message ,data}
}

const createUser = async(req,res)=>{

   try {
    const otp1 = otp.generate({
        length: 6,
        symbols : false,
        uppercase: true
    })

    const pass=await bcrypt.hash(req.body.password , 7);
    req.body.password = pass;
    
    const data = await User.query().insert(req.body);
    sendmail(req.body.email,otp1);
    res.status(200).json(format(data));
   } catch (error) {
    res.status(500).json(format(null,500,error));
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
        res.status(500).json(format(null,500,error));
    }
}
const getAllUser =async(req,res)=>{
    try {
        const data = await User.query();
        res.status(200).json(format(data))
    } catch (error) {
        res.status(500).json(format(null,500,error))
    }
}

const updateUser = async(req,res)=>{
    try {
        const otp1 = otp.generate({
            length: 6,
            symbols : false,
            uppercase: true
        })
        const user = await User.query().findById(Number(req.params.id)).update(req.body);
        sendmail(req.body.email,otp1);
        res.status(200).json(format(user));

    } catch (error) {
        res.status(500).json(format(null,500,""+error))
    }
    
}

module.exports = {
    createUser,login,updateUser,getAllUser
}