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


// // 🟢 ACTIVE
// const getActiveMembers = async (req, res) => {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const future = new Date();
//         future.setDate(today.getDate() + 5);

//         const members = await MemberModel.find({
//             ownerId: req.user._id,
//             expiryDate: { $gt: future }
//         });

//         res.json(members);
//     } catch (err) {
//         console.error("Active error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };


const getActiveMembers = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const future = new Date();
        future.setDate(today.getDate() + 5);

        const members = await MemberModel.find({
            ownerId: req.user._id,
            expiryDate: { $gt: future }
        });

        // Attach latest renew/upgrade info
        const membersWithPlanChange = await Promise.all(
            members.map(async (m) => {
                // Find latest renew/upgrade payment
                const latestChange = await PaymentModel.findOne({
                    memberId: m._id,
                    type: { $in: ["renew", "upgrade"] } // only renew/upgrade
                })
                    .sort({ date: -1 }) // newest first
                    .lean();

                return {
                    ...m.toObject(),
                    lastPlanType: latestChange?.type || null,
                    lastPlanDate: latestChange?.date || null
                };
            })
        );

        res.json(membersWithPlanChange);
    } catch (err) {
        console.error("Active members error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// const renewOrUpgradeMember = async (req, res) => {
//     try {
//         const { memberId, months, amount } = req.body;

//         if (!memberId) {
//             return res.status(400).json({ message: "MemberId required" });
//         }



//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: "Amount required" });
//         }

//         // months optional
//         if (months !== undefined && months <= 0) {
//             return res.status(400).json({ message: "Invalid months" });
//         }

//         const member = await MemberModel.findById(memberId);

//         if (!member) {
//             return res.status(404).json({ message: "Member not found" });
//         }




//         const usedMonths = months || member.plan;
//         // ✅ DATE LOGIC
//         const today = new Date();
//         let baseDate = new Date(
//             member.expiryDate < today ? today : member.expiryDate
//         );

//         // baseDate.setMonth(baseDate.getMonth() + months);
//         baseDate.setMonth(baseDate.getMonth() + usedMonths);
//         member.expiryDate = baseDate;


//         if (months) {
//             member.plan = months; // only update in upgrade
//         }

//         member.amount = amount;

//         member.paymentStatus = "pending"

//         await member.save();

//         // ✅ PAYMENT SAVE
//         const payment = new PaymentModel({
//             ownerId: req.user._id,
//             memberId: member._id,
//             amount: amount,
//             paidAmount: 0,
//             status: "Pending",
//             date: new Date(),
//             planSnapshot: `${usedMonths}M`,
//             type: req.body.type || "renew"
//         });

//         await payment.save();

//         res.json({
//             message: "Renew / Upgrade success",
//             payment
//         });

//     } catch (err) {
//         console.error("Renew/Upgrade error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };


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
        const today = new Date();
        let baseDate = new Date(member.expiryDate < today ? today : member.expiryDate);
        baseDate.setMonth(baseDate.getMonth() + usedMonths);
        member.expiryDate = baseDate;

        if (type === "upgrade") member.plan = months; // only upgrade updates plan
        member.amount = amount;
        member.paymentStatus = "pending";

        await member.save();

        const payment = new PaymentModel({
            ownerId: req.user._id,
            memberId: member._id,
            amount: amount,
            paidAmount: 0,
            status: "Pending",
            date: new Date(),
            planSnapshot: `${usedMonths}M`,
            type: type // ✅ type passed from frontend
        });

        await payment.save();

        res.json({ message: "Renew / Upgrade success", payment });

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