const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { createPlan, getPlans, deletePlan } = require("../controllers/OwnerPlanController");


const router = express.Router();

router.post("/create", authMiddleware(["owner", "staff"]), createPlan);
router.get("/all", authMiddleware(["owner", "staff"]), getPlans);
router.delete("/:id", authMiddleware(["owner", "staff"]), deletePlan);

module.exports = router;