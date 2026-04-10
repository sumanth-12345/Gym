const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getDailyAttendanceAllMembers } = require("../controllers/OwnerAttendanceController");
const router = express.Router()

router.get("/attendance/daily/all", authMiddleware(["owner", "staff"]), getDailyAttendanceAllMembers);


module.exports = router