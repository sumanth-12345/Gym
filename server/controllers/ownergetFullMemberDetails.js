const MemberModel = require("../models/MemberModel");
const PaymentModel = require("../models/PaymentModel");




const getOwnerMemberDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await MemberModel.findOne({
            _id: id,
            ownerId: req.user._id
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // 🔥 GET ALL PAYMENTS
        const payments = await PaymentModel.find({
            memberId: id,
            ownerId: req.user._id
        }).sort({ date: -1 });

        // 🔥 IMPORTANT FIX → ensure correct pending
        const cleanPayments = payments.map(p => ({
            ...p.toObject(),
            pendingAmount: (p.amount || 0) - (p.paidAmount || 0)
        }));
        const today = new Date();
        const expiry = member.expiryDate ? new Date(member.expiryDate) : null;
        let daysLeft = 0;
        if (expiry && !isNaN(expiry.getTime())) {
            daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        }


        const lastHistory = member.expiryHistory?.length
            ? member.expiryHistory[member.expiryHistory.length - 1]
            : null;

        // 🔥 SUMMARY FIX
        let totalPaid = 0;
        let totalPending = 0;

        cleanPayments.forEach(p => {
            totalPaid += p.paidAmount || 0
            totalPending += p.pendingAmount || 0
        });


        res.json({
            member: {
                ...member.toObject(),
                oldExpiry: lastHistory?.oldExpiry || null,
                newExpiry: member.expiryDate || null
            },

            summary: {
                totalPaid,
                totalPending,
                totalPayments: cleanPayments.length,
                status: daysLeft <= 0 ? "Expired" : "Active",
                daysLeft
            },
            history: cleanPayments
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { getOwnerMemberDetails };