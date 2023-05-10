const express = require('express');
const router = express.Router();
const User = require("../service/user_service")

router.use("/user",router);

router.post("/",User.createUser);
router.post("/login",User.login);
router.put("/:id",User.updateUser);
router.get("/",User.getAllUser)
router.get("/search",User.searchUsers);


module.exports = router;