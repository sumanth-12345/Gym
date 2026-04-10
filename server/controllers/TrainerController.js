const TrainerModuel = require("../models/TrainerModuel");


// POST Trainer
const postTrainer = async (req, res) => {
    try {
        const trainer = new TrainerModuel({ ...req.body, ownerId: req.user.id });
        await trainer.save();

        res.status(201).json({
            message: "Trainer Added",
            trainer
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getTrainer = async (req, res) => {
    try {
        console.log("USER:", req.user);

        const trainers = await TrainerModuel.find({
            ownerId: req.user.id
        });

        console.log("TRAINERS:", trainers); // 🔥 DEBUG

        res.json(trainers);

    } catch (err) {
        console.error("GET TRAINER ERROR:", err);
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

const MemberModel = require("../models/MemberModel");

// 🔥 TRAINER MEMBERS + COUNT
const getTrainerMembers = async (req, res) => {
    try {
        const trainerId = req.user.id;

        const members = await MemberModel.find({
            trainerId,
            isDeleted: false
        });

        const count = await MemberModel.countDocuments({
            trainerId,
            isDeleted: false
        });

        res.json({
            count,
            members
        });

    } catch (err) {
        console.error("TRAINER MEMBERS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};



module.exports = { postTrainer, getTrainer, updateTrainer, deleteTrainer, getTrainerMembers };