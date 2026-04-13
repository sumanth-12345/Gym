const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan"
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    pendingAmount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["new", "renew", "upgrade"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["PENDING", "PARTIAL", "COMPLETED"],
        default: "PENDING"
    },
    screenshot: String,

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);