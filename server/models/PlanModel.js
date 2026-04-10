const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
    plan: String,           // e.g. "1 Month"
    fitnessplan: String,    // e.g. "Weight Loss Plan"
    duration: Number,       // in months
    price: Number,          // plan price
    hasTrainer: {
        type: String,
        enum: ["Yes", "No"],
        default: "No",
    },
    trainerFee: {
        type: Number,
        default: 0,         // 0 if no trainer
    },
}, { timestamps: true });

module.exports = mongoose.model("Plan", PlanSchema);