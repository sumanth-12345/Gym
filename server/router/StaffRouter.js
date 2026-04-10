// routes/StaffRouter.js

const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { createStaff, updatePermissions, getAllStaff, getStaffProfile } = require("../controllers/StaffControllers");
const router = express.Router();



router.post("/create", authMiddleware(["owner"]), createStaff);
router.get("/all", authMiddleware(["owner"]), getAllStaff);
router.put("/permissions/:id", authMiddleware(["owner"]), updatePermissions);
router.get("/me", authMiddleware(["staff"]), getStaffProfile)

module.exports = router;