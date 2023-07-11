const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  login,
  setAvatar,
  getOneUser,
} = require("../controllers/user");
const { isLoggedIn } = require("../middlewares/user");

router.post("/user/register", createUser);
router.post("/user/login", login);
router.get("/users", getAllUsers);
router.get("/user/:id", getOneUser);
router.patch("/user/setavatar", isLoggedIn, setAvatar);

module.exports = router;
