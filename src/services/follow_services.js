const Users = require("../model/user");
const Follow = require("../model/follow");
const Requested = require("../model/requested");

const findfollow = async (payloads)=>{
    
    return await Follow.query().findOne(payloads);
}
const follow = async(data)=>{
    return await Follow.query().insert(data);
}
const deleteFollow = async(id)=>{
    return await Follow.query().findById(id).delete();
}

const createRequest = async(data)=>{
    return await Requested.query().insert(data);
}

const getRequest = async(id)=>{
    return await Requested.query().select('users.id','users.username').joinRelated(Users).leftJoin('users','requester_id','users.id').where('requested.user_id',id);
}
const getOneRequest = async(userId,reqId)=>{
    return await  Requested.query().findOne({'user_id' : userId,'requester_id':reqId})
}
const deleteRequestById = async(id)=>{
    return await Requested.query().findById(id).delete();
}
const deleteRequest = async(payloads)=>{
    return await Requested.query().findOne(payloads).delete();
}

module.exports={
    findfollow,createRequest,follow,deleteFollow,getRequest,getOneRequest,deleteRequestById,deleteRequest
}