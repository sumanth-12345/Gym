const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getExpiredMembers, getExpiringMembers, getActiveMembers, renewOrUpgradeMember } = require("../controllers/OwnerExpiringControllers");

const router = express.Router()

router.get("/expired", authMiddleware(["owner"]), getExpiredMembers);
router.get("/expiring", authMiddleware(["owner"]), getExpiringMembers);
router.get("/active", authMiddleware(["owner"]), getActiveMembers);
router.post("/renew-or-upgrade", authMiddleware(["owner"]), renewOrUpgradeMember);


module.exports = router