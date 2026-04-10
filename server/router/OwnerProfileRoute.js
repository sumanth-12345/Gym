const express = require("express");
const { getOwnerProfile } = require("../controllers/OwnerProfile");
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router()

router.get("/me", authMiddleware(["owner"]), getOwnerProfile);

module.exports = router