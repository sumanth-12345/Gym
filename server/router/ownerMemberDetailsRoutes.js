const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const { getOwnerMemberDetails } = require("../controllers/ownergetFullMemberDetails");


// ✅ OWNER → MEMBER DETAILS
router.get("/owner/member/:id", authMiddleware("owner"), getOwnerMemberDetails);

module.exports = router;