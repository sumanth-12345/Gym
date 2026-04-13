const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { ownerGetPaymentsAll, ownerPatchPayment } = require("../controllers/OwnerPaymentController");



const router = express.Router();

// GET all payments (Owner only)
router.get("/payments/all", authMiddleware(["owner"]), ownerGetPaymentsAll);

// PATCH payment as completed (Owner only)
router.patch("/payments/pay/:id", authMiddleware("owner"), ownerPatchPayment);


module.exports = router;