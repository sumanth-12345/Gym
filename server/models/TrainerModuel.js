const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    monthlyAmount: {
        type: Number,
        required: true
    },
    joinDate: {
        type: Date,
        required: true
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },

}, { timestamps: true });

trainerSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// 🔥 OPTIONAL (BUT GOOD PRACTICE)
trainerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Trainer", trainerSchema);