const express = require("express");
const { signupUser, loginUser, generateNewAccessToken } = require("./userControllers");
const router = express.Router();

router.post("/user/signup", signupUser);
router.post("/user/login", loginUser);
router.post("/user/newtoken", generateNewAccessToken);

module.exports = router;
