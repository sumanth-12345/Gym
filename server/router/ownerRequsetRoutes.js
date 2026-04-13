const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const { getOwnerRequests, acceptRequest, getSingleRequest, rejectRequest } = require("../controllers/ownerrequestPaymentController");



router.get("/requests", authMiddleware("owner"), getOwnerRequests);
router.get("/request/:id", authMiddleware("owner"), getSingleRequest);
router.put("/accept/:id", authMiddleware("owner"), acceptRequest);
router.put("/reject/:id", authMiddleware("owner"), rejectRequest);

module.exports = router;