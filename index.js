const express = require("express");
const app = express();
const user_routes = require("./routes/user_route")
const posts_route = require("./routes/post_route")
const comment_route = require("./routes/comment_route")

app.use(express.json());

app.use("/user",user_routes);
app.use("/post",posts_route);
app.use("/comment",comment_route)




app.listen(8080,()=>{
    console.log("server started at 8080");
})