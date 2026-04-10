const mongoose = require("mongoose");

const workoutDietSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Owner"
    },
    fitnessGoal: {
        type: String,
        required: true
    },
    workout: {
        type: String,
        required: true
    },
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    snack: { type: String, required: true },
    dinner: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("WorkoutDiet", workoutDietSchema);