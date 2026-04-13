const mongoose = require("mongoose");

const PaymentRequestSchema = new mongoose.Schema({

    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },

    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paidAmount: {
        type: Number,
        default: 0
    },

    pendingAmount: {
        type: Number,
        default: 0
    },

    screenshot: {
        type: String
    },
    reason: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("PaymentRequest", PaymentRequestSchema);