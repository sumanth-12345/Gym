const WorkoutDietModel = require("../models/WorkoutDietModel");

// CREATE
const createWorkoutDiet = async (req, res) => {
    try {
        console.log("body", req.body)
        const data = new WorkoutDietModel({
            ownerId: req.user.id,   // ✅ correct
            fitnessGoal: req.body.fitnessGoal,
            workout: req.body.workout,
            breakfast: req.body.breakfast,
            lunch: req.body.lunch,
            snack: req.body.snack,
            dinner: req.body.dinner
        });

        console.log("data", data)
        await data.save();

        res.status(201).json({ message: "Plan created", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// GET (owner/trainer)
const getWorkoutDiet = async (req, res) => {
    try {
        const data = await WorkoutDietModel.find({
            ownerId: req.user.id   // ✅ fixed
        });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching" });
    }
};

// MEMBER VIEW
const getMembersWithDiet = async (req, res) => {
    try {
        const member = req.user;

        const plans = await WorkoutDietModel.find({
            fitnessGoal: member.fitnessGoal
        });

        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: "Error fetching" });
    }
};

// UPDATE
const updateWorkoutDiet = async (req, res) => {
    try {
        const updated = await WorkoutDietModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
};

// DELETE
const deleteWorkoutDiet = async (req, res) => {
    try {
        await WorkoutDietModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};

module.exports = {
    createWorkoutDiet,
    getWorkoutDiet,
    updateWorkoutDiet,
    deleteWorkoutDiet,
    getMembersWithDiet
};