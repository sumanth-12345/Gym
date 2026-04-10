const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getExpiredMembers, getExpiringMembers, getActiveMembers, renewOrUpgradeMember } = require("../controllers/OwnerExpiringControllers");
const featureAccess = require("../Middleware/featureAccess");
const router = express.Router()

router.get("/expired", authMiddleware(["owner", "staff"]), featureAccess("expiredMembers"), getExpiredMembers);
router.get("/expiring", authMiddleware(["owner", "staff"]), featureAccess("expiringMembers"), getExpiringMembers);
router.get("/active", authMiddleware(["owner", "staff"]), featureAccess("activeMembers"), getActiveMembers);
router.post("/renew-or-upgrade", authMiddleware(["owner", "staff"]), featureAccess("renew-or-upgrade"), renewOrUpgradeMember);


module.exports = router