const express = require("express")
const { OwnerRegister, OwnerForgot, OwnerRset, OwnerLogin } = require("../controllers/Ownercontrollers")



const router = express.Router()

router.post("/register", OwnerRegister)
router.post("/login", OwnerLogin)
router.post("/forgot-password", OwnerForgot)
router.post("/reset-password/:token", OwnerRset)

module.exports = router