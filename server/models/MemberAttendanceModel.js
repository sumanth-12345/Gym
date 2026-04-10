const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: { type: String, enum: ["Present", "Absent"], required: true }

}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);