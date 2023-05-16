const Follows = require("../model/follow");
const Requested = require("../model/requested");
const Users = require("../model/user");








function format(data, status = 200, message = 'ok') {
    return { status, message, data }
}


const follow = async (req,res)=>{
    try {
        const user = Users.query().findById(req.params.id);
        if(user.status == false)return res.status(404).json(format(null,404,'User not found'));
        if(user.type == false){
            data ={
                user_id : req.user.id,
                requested_id : req.params.id
            }
           const resquest= Requested.query().insert(data);
           res.status(200).json(format(null,200,'resquested'));
        }
        else{
            const user = Users.query().findById(req.user.id);
            user.following_id +=1;
            const addfollowing = Users.query().findById(req.user.id).update(user.following_id);
            const user2 = Users.query().findById(req.params.id);
            user2.followers_id +=1 ;
            const addfollowers = Users.query().findById(req.params.id).update(user2.followers_id);
            res.status(200).json(format(null,200,'followed'));
        }
        res.status(200).json(format(null));
    } catch (error) {
        res.status(500).json(format(null,500,""+error));
    }
}


module.exports = {
    follow
}