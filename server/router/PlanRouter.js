const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { createPlan, getPlans, deletePlan } = require("../controllers/OwnerPlanController");


const router = express.Router();

router.post("/create", authMiddleware(["owner"]), createPlan);
router.get("/all", authMiddleware(["owner"]), getPlans);
router.delete("/:id", authMiddleware(["owner"]), deletePlan);

module.exports = router;