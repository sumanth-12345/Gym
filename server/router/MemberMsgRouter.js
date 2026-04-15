const express = require("express")
const { getMemberRejectmsgShow } = require("../controllers/MemberMassageshow")
const authMiddleware = require("../Middleware/authMiddleware")
const router = express.Router()

router.get("/requests", authMiddleware("member"), getMemberRejectmsgShow)

module.exports = router