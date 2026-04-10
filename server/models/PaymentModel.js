const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },

    type: {
        type: String,
        enum: ["renew", "upgrade"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Pending", "Partial", "Completed"],
        default: "Pending"
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);