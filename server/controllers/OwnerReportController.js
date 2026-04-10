const PaymentModel = require("../models/PaymentModel");
const MemberModel = require("../models/MemberModel");
;
// =========================
// 1️⃣ MONTHLY REVENUE (OWNER BASED)
// =========================
const mongoose = require("mongoose");
const getMonthlyRevenue = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const ownerId = new mongoose.Types.ObjectId(req.user._id);

        const data = await PaymentModel.aggregate([
            {
                $match: {
                    ownerId: ownerId,
                    date: { $exists: true, $ne: null } // 🔥 FIX
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                    },
                    totalAmount: { $sum: "$amount" },

                    completed: { $sum: "$paidAmount" },

                    // completed: {
                    //     $sum: {
                    //         $cond: [{ $eq: ["$status", "Completed"] }, "$amount", 0]
                    //     }
                    // },

                    pending: {
                        $sum: {
                            $subtract: ["$amount", "$paidAmount"]
                            // $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        res.json(data);

    } catch (err) {
        console.error("REVENUE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// =========================
// 2️⃣ MEMBER STATS (OWNER BASED)
// =========================
const getMemberStats = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalMembers = await MemberModel.countDocuments({
            ownerId: ownerId // 🔥 IMPORTANT
        });

        const newMembers = await MemberModel.countDocuments({
            ownerId: ownerId,
            joinDate: { $gte: today }
        });

        const expiredMembers = await MemberModel.countDocuments({
            ownerId: ownerId,
            expiryDate: { $lt: today }
        });

        res.json({
            totalMembers,
            newMembers,
            expiredMembers,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};




// =========================
// CREATE PAYMENT
// =========================

const createPayment = async (req, res) => {
    try {
        const { memberId, amount, type } = req.body;

        if (!memberId || !amount) {
            return res.status(400).json({ message: "All fields required" });
        }

        const member = await MemberModel.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // 🔒 Security check
        if (member.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const payment = await PaymentModel.create({
            memberId: member._id,
            ownerId: member.ownerId, // 🔥 IMPORTANT
            amount,
            type: type || "renew",
            date: new Date(), // 🔥 MUST
            status: "Completed",
            planSnapshot
        });

        res.status(201).json({
            message: "Payment created",
            payment,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Payment failed" });
    }
};


module.exports = { getMonthlyRevenue, getMemberStats, createPayment };