const TrainerModuel = require("../models/TrainerModuel");


// POST Trainer
const postTrainer = async (req, res) => {
    try {
        const trainer = new TrainerModuel(req.body);
        await trainer.save();

        res.status(201).json({
            message: "Trainer Added",
            trainer
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET Trainers
const getTrainer = async (req, res) => {
    try {
        const trainers = await TrainerModuel.find();
        res.json(trainers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Trainer
const updateTrainer = async (req, res) => {
    try {
        const updated = await TrainerModuel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        console.log("ID:", req.params.id);
        console.log("updat:", updated);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE Trainer
const deleteTrainer = async (req, res) => {
    try {
        await TrainerModuel.findByIdAndDelete(req.params.id);
        res.json({ message: "Trainer Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { postTrainer, getTrainer, updateTrainer, deleteTrainer };