const express = require("express")
const { getMyProfile, getMyPayments } = require("../controllers/MemberDetailsControllers");
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router()


router.get("/me", authMiddleware("member"), getMyProfile);
router.get("/payments", authMiddleware("member"), getMyPayments);


module.exports = router