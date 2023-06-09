const express = require("express");
const app = express();
app.use(express.json());

app.use(require('./src/routes/routes').route)

app.listen(8080, () => {
    console.log("server started at 8080");
})