const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getDashboard } = require("../controllers/OwnerHomeControllers");
const router = express.Router();



// 🔥 Dashboard route
router.get("/home", authMiddleware("owner"), getDashboard);


module.exports = router;