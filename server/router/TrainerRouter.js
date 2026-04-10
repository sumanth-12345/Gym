const express = require("express")
const { postTrainer, getTrainer, updateTrainer, deleteTrainer } = require("../controllers/TrainerController")
const authMiddleware = require("../Middleware/authMiddleware")
const router = express.Router()

router.post("/add", authMiddleware(["owner", "staff"]), postTrainer)
router.get("/all", authMiddleware(["owner", "staff"]), getTrainer)
router.put("/update/:id", authMiddleware(["owner", "staff"]), updateTrainer);
router.delete("/delete/:id", authMiddleware(["owner", "staff"]), deleteTrainer);

module.exports = router