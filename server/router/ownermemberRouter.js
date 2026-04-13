const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { addMember, getMembers, updateMember, deleteMember } = require("../controllers/OwnerAddMemberDetailsControllers");


const router = express.Router();

// Protected routes (owner only)
router.post("/add", authMiddleware(["owner"]), addMember);
router.get("/all", authMiddleware(["owner"]), getMembers);

router.put("/update/:id", authMiddleware(["owner"]), updateMember); // ✅ now defined
router.delete("/delete/:id", authMiddleware(["owner"]), deleteMember);


module.exports = router;