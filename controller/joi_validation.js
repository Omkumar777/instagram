const joi = require("joi");


function validate(req,res,next) {
    const valid = joi.object({
        name: joi.string().required(),
        username: joi.string().required(),
        password: joi.required(),
        email: joi.string().email().required(),
        phoneNumber: joi.number().required()
    })

    const validation = valid.validate(req.body);
    if(validation.error){
        return res.send(validation.error.details) 
    }
    next();
};

module.exports = {validate};