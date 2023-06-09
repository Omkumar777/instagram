const express = require("express");
const route = express.Router();
const user_routes = require('./user_route')
const posts_route = require("./post_route")
const comment_route = require("./comment_route")

route.use("/api/v1/user",user_routes);
route.use("/api/v1/post",posts_route);
route.use("/api/v1/comment",comment_route);


module.exports = {route};