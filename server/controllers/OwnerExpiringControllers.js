const MemberModel = require("../models/MemberModel");
const PaymentModel = require("../models/PaymentModel");

// 🔴 EXPIRED
const getExpiredMembers = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const members = await MemberModel.find({
            ownerId: req.user._id,
            expiryDate: { $lt: today }
        });

        res.json(members);
    } catch (err) {
        console.error("Expired error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// 🟡 EXPIRING
const getExpiringMembers = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const future = new Date();
        future.setDate(today.getDate() + 5);
        future.setHours(23, 59, 59, 999);

        const members = await MemberModel.find({
            ownerId: req.user._id,
            expiryDate: {
                $gte: today,
                $lte: future
            }
        });

        res.json(members);
    } catch (err) {
        console.error("Expiring error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getActiveMembers = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const members = await MemberModel.find({
            ownerId: req.user._id,
            expiryDate: { $gt: today }
        });

        const finalData = await Promise.all(
            members.map(async (m) => {

                // 🔥 latest renew/upgrade
                const latestChange = await PaymentModel.findOne({
                    memberId: m._id,
                    type: { $in: ["renew", "upgrade"] }
                })
                    .sort({ date: -1 })
                    .lean();

                return {
                    ...m.toObject(),

                    // ✅ CORRECT DATA
                    oldExpiry: m.previousExpiryDate || null,
                    newExpiry: m.expiryDate,

                    // ✅ OPTIONAL
                    lastPlanType: latestChange?.type || null,
                    lastPlanDate: latestChange?.date || null
                };
            })
        );

        res.json(finalData);

    } catch (err) {
        console.error("Active members error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const renewOrUpgradeMember = async (req, res) => {
    try {
        const { memberId, months, amount, type } = req.body;

        if (!memberId) return res.status(400).json({ message: "MemberId required" });
        if (!amount || amount <= 0) return res.status(400).json({ message: "Amount required" });
        if (!["renew", "upgrade"].includes(type)) {
            return res.status(400).json({ message: "Invalid type" });
        }

        const member = await MemberModel.findById(memberId);
        if (!member) return res.status(404).json({ message: "Member not found" });

        const usedMonths = Number(months || member.plan || 1);

        // =========================
        // 🔥 FIX: ALWAYS USE OLD EXPIRY (NO LOSS SYSTEM)
        // =========================
        const oldExpiry = member.expiryDate ? new Date(member.expiryDate) : new Date();

        // 👉 ALWAYS EXTEND FROM OLD EXPIRY (EVEN IF EXPIRED)
        const baseDate = new Date(oldExpiry);

        baseDate.setMonth(baseDate.getMonth() + usedMonths);

        const newExpiry = baseDate;

        // =========================
        // UPDATE MEMBER
        // =========================
        member.expiryDate = newExpiry;

        if (type === "upgrade") {
            member.plan = months;
        }

        member.amount = amount;
        member.paymentStatus = "PENDING";

        // =========================
        // HISTORY FIX
        // =========================
        member.expiryHistory = member.expiryHistory || [];

        member.expiryHistory.push({
            oldExpiry: oldExpiry,
            newExpiry: newExpiry,
            paymentDate: new Date(),
            type: type
        });

        await member.save();

        // =========================
        // PAYMENT CREATE
        // =========================
        const payment = new PaymentModel({
            ownerId: req.user._id,
            memberId: member._id,
            amount: Number(amount),
            paidAmount: 0,
            pendingAmount: Number(amount),
            status: "PENDING",
            date: new Date(),
            planSnapshot: `${usedMonths}M`,
            type
        });

        await payment.save();

        res.json({
            message: "Renew / Upgrade success",
            member,
            payment,
            oldExpiry,
            newExpiry
        });

    } catch (err) {
        console.error("Renew/Upgrade error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {
    getExpiredMembers,
    getExpiringMembers,
    getActiveMembers,
    renewOrUpgradeMember
};