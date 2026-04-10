const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { addMember, getMembers, updateMember, deleteMember } = require("../controllers/OwnerAddMemberDetailsControllers");
const featureAccess = require("../Middleware/featureAccess");

const router = express.Router();

// Protected routes (owner only)
router.post("/add", authMiddleware(["owner", "staff"]), featureAccess("addmember"), addMember);
router.get("/all", authMiddleware(["owner", "staff"]), featureAccess("memberList"), getMembers);

router.put("/update/:id", authMiddleware(["owner"]), updateMember); // ✅ now defined
router.delete("/delete/:id", authMiddleware(["owner"]), deleteMember);


module.exports = router;