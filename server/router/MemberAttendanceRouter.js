const express = require("express");
const { generateQR, markAttendanceQR, viewAttendance } = require("../controllers/MemberAttendanceController");
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();

// 🔥 QR routes
router.get("/qr", generateQR);
router.post("/scan-qr", authMiddleware("member"), markAttendanceQR);
router.get("/view", authMiddleware("member"), viewAttendance);

module.exports = router;