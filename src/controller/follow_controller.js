const Follows = require("../model/follow");
const Requested = require("../model/requested");
const Users = require("../model/user");
const format = require("../helper/helper");
const FollowService = require("../services/follow_services");
const UserService = require("../services/user_services");

const follow = async (req, res) => {
    try {
        if (req.user.id == req.params.id) return res.status(400).json(format.format(null, 400, 'You not follow you'))
        const user = await UserService.findUserById(Number(req.params.id));
        if (!user || user.status == false) return res.status(404).json(format.format(null, 404, 'User not found'));
        const followlist = await FollowService.findfollow({ 'user_id': Number(req.params.id), 'follower_id': req.user.id });
        if (!followlist) {
            if (user.type == false) {

                data = {
                    user_id: Number(req.params.id),
                    requester_id: req.user.id
                };
                const resquest = await FollowService.createRequest(data);
                res.status(200).json(format.format(null, 200, 'requested'));
            }
            else {
                const user = await UserService.findUserById(req.user.id);
                user.following += 1;

                const addfollowing = await UserService.updateUserById(req.user.id, user);
                const user2 = await UserService.findUserById(Number(req.params.id));
                user2.followers += 1;

                const addfollowers = await UserService.updateUserById(Number(req.params.id), user2);
                let follow = {
                    user_id: Number(req.params.id),
                    follower_id: req.user.id
                }

                const fol = await FollowService.follow(follow);

                res.status(200).json(format.format(null, 200, 'followed'));
            }
        } else {
            const user = await UserService.findUserById(req.user.id);
            user.following -= 1;
            const addfollowing = await UserService.updateUserById(req.user.id, user);
            const user2 = await UserService.findUserById(Number(req.params.id));
            user2.followers -= 1;
            const addfollowers = await UserService.updateUserById(Number(req.params.id, user2));

            const fol = await FollowService.deleteFollow(followlist.id);
            res.status(200).json(format.format(null, 200, 'unfollowed'));
        };

    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error));
    }
}
const requestList = async (req, res) => {
    try {
        const requests = await FollowService.getRequest(req.user.id);
        if (!requests || requests.length == 0) return res.status(200).json(format.format(null, 200, 'No request'));
        res.status(200).json(format.format(requests));
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error));
    }
}

const approveRequest = async (req, res) => {
    try {
        const requests = await FollowService.getOneRequest(req.user.id, Number(req.params.id));
        if (!requests) return res.status(404).json(format.format(null, 404, 'Not found'));
        const user = await UserService.findUserById(Number(req.params.id));
        user.following += 1;
        const addfollowing = await UserService.updateUserById(Number(req.params.id), user);
        const user2 = await UserService.findUserById(req.user.id);
        user2.followers += 1;
        const addfollowers = await UserService.updateUserById(req.user.id, user2);
        let follow = {
            user_id: Number(req.user.id),
            follower_id: Number(req.params.id)
        }
        const fol = await FollowService.follow(follow);
        await FollowService.deleteRequestById(requests.id);
        res.status(200).json(format.format(null, 200, 'Request Approved'));

    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error));
    }
}
const rejectRequest = async (req, res) => {
    try {
        const requests = await FollowService.deleteRequest({ 'user_id': req.user.id, 'requester_id': Number(req.params.id) });
        if (!requests) return res.status(404).json(format.format(null, 404, 'Not Found'))
        res.status(200).json(format.format(null, 200, 'Rejected Requested'))
    } catch (error) {
        res.status(400).json(format.format(null, 400, "" + error));
    }
}

module.exports = {
    follow, requestList, approveRequest, rejectRequest
}