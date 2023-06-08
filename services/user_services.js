const User = require("../model/user");


const findUser = async(payloads)=>{
    return await User.query().findOne(payloads)
};
const findUserById =async(payloads)=>{
    return await User.query().findById(payloads)
};

const createUser = async (payloads)=>{
    return await User.query().insert(payloads);
};
const updateUser = async(payloads,data)=>{
    return await User.query().findOne(payloads).update(data);
};
const updateUserById = async(Id,data)=>{
    return await User.query().findById(Id).update(data);
}; 

const getAllUser =async()=>{
    return await User.query().where('type', true).where('status', true).where('role', '!=', 'admin');
};

const searchUser = async(search,id)=>{
    return await User.query().select('name', 'username', 'email', 'phonenumber').where("username", 'like', "%" + search + "%").where("type", true).where('id', "!=", id).where('role', "!=", "admin").orWhere("name", 'like', "%" + search + "%").where("type", true).where('id', "!=", id).where('role', "!=", "admin");

}

module.exports={
    findUser,findUserById,createUser,updateUser,updateUserById,getAllUser,searchUser
}