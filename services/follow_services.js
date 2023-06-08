const Follow = require("../model/follow");


const findfollow = async (payloads)=>{
    return await Follow.query().findOne(payloads);
}

module.exports={
    findfollow
}