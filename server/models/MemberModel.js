const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },

    phone: { type: String, required: true, match: /^\d{10}$/ },

    password: { type: String, required: true },

    plan: { type: Number, required: true, min: 1, max: 20 },

    amount: { type: Number, required: true },

    paymentStatus: { type: String, required: true },

    joinDate: { type: Date, default: Date.now },

    expiryDate: { type: Date },

    // ✅ FIXED STRUCTURE
    hasTrainer: {
        type: Boolean,
        default: false
    },
    trainerName: {
        type: String,
        default: ""
    },
    fitnessGoal: { type: String },
    weight: Number,
    height: Number,
    healthIssues: String,
    planSnapshot: String,
    isDeleted: { type: Boolean, default: false },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Trainer"
    }
});

MemberSchema.index({ phone: 1, ownerId: 1 }, { unique: true });

// 🔥 CORRECT PASSWORD HASHING (NO BUGS)
MemberSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// 🔥 OPTIONAL (BUT GOOD PRACTICE)
MemberSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Member", MemberSchema);