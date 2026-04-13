const express = require("express")
const authMiddleware = require("../Middleware/authMiddleware")
const { getmemberplan, getSinglePlan, createPaymentRequest } = require("../controllers/getMemberPlan")
const upload = require("../Middleware/upload")

const router = express.Router()

router.get("/details", authMiddleware("member"), getmemberplan)
// 🔹 Get single plan
router.get("/:id", getSinglePlan);
// 🔹 Payment API
router.post("/payment", authMiddleware("member"), upload.single("screenshot"), createPaymentRequest);


module.exports = router