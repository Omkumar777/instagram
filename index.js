const express = require("express");
const app = express();
const user_routes = require("./routes/user_route")

app.use(express.json());

app.use("/user",user_routes);




app.listen(8080,()=>{
    console.log("server started at 8080");
})