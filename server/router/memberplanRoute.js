const express = require("express")
const authMiddleware = require("../Middleware/authMiddleware")
const { getmemberplan } = require("../controllers/getMemberPlan")

const router = express.Router()

router.get("/details", authMiddleware("member"), getmemberplan)

module.exports = router