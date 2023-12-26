const express = require("express");
const { createWebsite, deleteWebsite, getAllWebsites } = require("./websiteControllers");
const verifyAccessToken = require("../user/userMiddleware");
const router = express.Router();

router.get("/website", verifyAccessToken ,getAllWebsites);
router.post("/website/create", verifyAccessToken ,createWebsite);
router.delete("/website/delete", verifyAccessToken ,deleteWebsite);

module.exports = router;
