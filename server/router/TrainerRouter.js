const express = require("express")
const { postTrainer, getTrainer, updateTrainer, deleteTrainer, getTrainerMembers } = require("../controllers/TrainerController")
const authMiddleware = require("../Middleware/authMiddleware")
const router = express.Router()

router.post("/add", authMiddleware(["owner"]), postTrainer)
router.get("/all", authMiddleware(["owner"]), getTrainer)
router.put("/update/:id", authMiddleware(["owner"]), updateTrainer);
router.delete("/delete/:id", authMiddleware(["owner"]), deleteTrainer);
router.get("/members", authMiddleware(["trainer"]), getTrainerMembers);
module.exports = router