const MemberModel = require("../models/MemberModel");
const PaymentModel = require("../models/PaymentModel");
const { calculateExpiry } = require("../utils/expiry");



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
        if (months !== undefined && months <= 0) return res.status(400).json({ message: "Invalid months" });
        if (!["renew", "upgrade"].includes(type)) return res.status(400).json({ message: "Invalid type" });

        const member = await MemberModel.findById(memberId);
        if (!member) return res.status(404).json({ message: "Member not found" });


        const usedMonths = months || member.plan;
        member.expiryHistory = member.expiryHistory || [];
        member.expiryHistory.push({
            oldExpiry: member.expiryDate,
            newExpiry: calculateExpiry(member.expiryDate, usedMonths),
            renewedAt: new Date()
        });
        member.expiryDate = calculateExpiry(member.expiryDate, usedMonths);

        let baseDate = member.expiryDate ? new Date(member.expiryDate) : new Date();

        const today = new Date();

        // if already expired → start from today
        if (baseDate.getTime() < today.getTime()) {
            baseDate = new Date(today);
        }

        baseDate.setMonth(baseDate.getMonth() + Number(usedMonths));

        const newExpiry = baseDate;

        member.expiryDate = newExpiry;

        // 🔥 STORE HISTORY (MAIN FIX)


        // 🔥 UPDATE PLAN ONLY ON UPGRADE
        if (type === "upgrade") {
            member.plan = months;
        }

        member.amount = amount;
        member.paymentStatus = "PENDING";

        await member.save();

        // 🔥 CREATE PAYMENT RECORD
        const payment = new PaymentModel({
            ownerId: req.user._id,
            memberId: member._id,
            amount: amount,
            paidAmount: 0,
            status: "PENDING",
            date: new Date(),
            planSnapshot: `${usedMonths}M`,
            type: type
        });

        await payment.save();

        res.json({
            message: "Renew / Upgrade success",
            member,
            payment
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