const express = require("express");
const router = express.Router();
const { addMessage, getMessages } = require("../controllers/message");
const { isLoggedIn } = require("../middlewares/user");

router.post("/addmsg", isLoggedIn, addMessage);
router.post("/getmsg", isLoggedIn, getMessages);

module.exports = router;
