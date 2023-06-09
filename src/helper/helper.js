const nodemailer = require('nodemailer');
const User = require("../model/user")


function format(data, status = 200, message = 'ok') {
    return { status, message, data }
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
const otpVerify = async (req, res) => {

    try {

        const user1 = await User.query().findById(req.user.id);
        if (user1.verification == req.body.otp) {
            user1.verification = 'Verified'
            const validUser = await User.query().findById(req.user.id).update(user1);
            res.status(200).json(format(null, 200, 'User verified'));
        }
        else if (user1.verification == 'Verified') {
            res.status(200).json(format(null, 200, 'User already verified'));
        } else { 
            res.status(200).json(format(null, 200, 'Invalid OTP'));
        }
    } catch (error) {
        res.status(400).json(format(null, 400, "" + error));
    }
}

module.exports = {
    format,sendmail,otpVerify
}