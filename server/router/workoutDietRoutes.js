const express = require("express");
const router = express.Router();


const authMiddleware = require("../Middleware/authMiddleware");
const { createWorkoutDiet, getWorkoutDiet, getMembersWithDiet, updateWorkoutDiet, deleteWorkoutDiet } = require("../controllers/workoutDietController");

router.post("/create", authMiddleware(["owner", "trainer"]), createWorkoutDiet);
router.get("/all", authMiddleware(["owner", "trainer"]), getWorkoutDiet);
router.get("/member-diet", authMiddleware("member"), getMembersWithDiet);
router.put("/update/:id", updateWorkoutDiet);
router.delete("/delete/:id", deleteWorkoutDiet);

module.exports = router;