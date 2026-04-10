const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getMonthlyRevenue, getMemberStats } = require("../controllers/OwnerReportController");


const router = express.Router();

router.get("/revenue", authMiddleware("owner"), getMonthlyRevenue);
router.get("/members", authMiddleware("owner"), getMemberStats);

module.exports = router;