const Follows = require("../model/follow");
const Requested = require("../model/requested");
const Users = require("../model/user");








function format(data, status = 200, message = 'ok') {
    return { status, message, data }
}


const follow = async (req, res) => {
    try {
        if(req.user.id == req.params.id)return res.status(500).json(format(null,500,'You not follow you'))
        const user = await Users.query().findById(req.params.id);
        if (!user || user.status == false) return res.status(404).json(format(null, 404, 'User not found'));
        const followlist = await Follows.query().findOne({ 'user_id': Number(req.params.id), 'follower_id': req.user.id });
        if (!followlist) {
            if (user.type == false) {

                data = {
                    user_id: Number(req.params.id),
                    requester_id: req.user.id
                };
                const resquest = await Requested.query().insert(data);
                res.status(200).json(format(null, 200, 'requested'));
            }
            else {
                const user = await Users.query().findById(req.user.id);
                user.following += 1;
                const addfollowing = await Users.query().findById(req.user.id).update(user);
                const user2 = await Users.query().findById(req.params.id);
                user2.followers += 1;
                const addfollowers = await Users.query().findById(req.params.id).update(user2);
                let follow = {
                    user_id: Number(req.params.id),
                    follower_id: req.user.id
                }
                const fol = await Follows.query().insert(follow);
                res.status(200).json(format(null, 200, 'followed'));
            }
        } else {
            const user = await Users.query().findById(req.user.id);
            user.following -= 1;
            const addfollowing = await Users.query().findById(req.user.id).update(user);
            const user2 = await Users.query().findById(req.params.id);
            user2.followers -= 1;
            const addfollowers = await Users.query().findById(req.params.id).update(user2);

            const fol = await Follows.query().findById(followlist.id).delete();
            res.status(200).json(format(null, 200, 'unfollowed'));
        };

    } catch (error) {
        res.status(500).json(format(null, 500, "" + error));
    }
}
const requestList = async (req,res)=>{
    try {
        const requests = await Requested.query().select('users.id','users.username').joinRelated(Users).leftJoin('users','requester_id','users.id').where('requested.user_id',req.user.id);
        if(!requests || requests.length ==0)return res.status(200).json(format(null,200,'No request'));
        res.status(200).json(format(requests));
    } catch (error) {
        res.status(500).json(format(null,500,""+error));
    }
}

const approveRequest =async(req,res)=>{
    try {
        const requests = await Requested.query().findOne({'user_id' : req.user.id,'requester_id':Number(req.params.id)});
        if(!requests)return res.status(404).json(format(null,404,'Not found'));
        const user = await Users.query().findById(req.params.id);
        user.following += 1;
        const addfollowing = await Users.query().findById(req.params.id).update(user);
        const user2 = await Users.query().findById(req.user.id);
        user2.followers += 1;
        const addfollowers = await Users.query().findById(req.user.id).update(user2);
        let follow = {
            user_id: Number(req.user.id),
            follower_id:Number (req.params.id)
        }
        const fol = await Follows.query().insert(follow);
        await Requested.query().findById(requests.id).delete();
        res.status(200).json(format(null, 200, 'Request Approved'));

    } catch (error) {
        res.status(500).json(format(null,500,""+ error));
    }
}
const rejectRequest =async(req,res)=>{
    try {
        const requests = await Requested.query().findOne({'user_id' : req.user.id,'requester_id':Number(req.params.id)}).delete();
        if(!requests)return res.status(404).json(format(null,404,'Not Found'))
        res.status(200).json(format(null,200,'Rejected Requested'))
    } catch (error) {
        res.status(500).json(format(null,500,""+ error));
    }
}

module.exports = {
    follow,requestList,approveRequest,rejectRequest
}