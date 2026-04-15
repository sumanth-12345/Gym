const MemberModel = require("../models/MemberModel");
const PaymentModel = require("../models/PaymentModel");
const { checkAndActivatePlan } = require("../utils/planUtils");

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

        // 🔥 AUTO ACTIVATE UPCOMING PLAN
        await checkAndActivatePlan(member);

        // 🔥 GET ALL PAYMENTS
        const payments = await PaymentModel.find({
            memberId: id,
            ownerId: req.user._id
        }).sort({ date: -1 });

        // 🔥 FIXED PENDING (NO NEGATIVE VALUES)
        const cleanPayments = payments.map(p => {
            const paid = Number(p.paidAmount || 0);
            const total = Number(p.amount || 0);
            const pending = Math.max(total - paid, 0);

            return {
                ...p.toObject(),
                pendingAmount: pending
            };
        });

        // 🔥 EXPIRY CALCULATION
        const today = new Date();
        const expiry = member.expiryDate ? new Date(member.expiryDate) : null;

        let daysLeft = 0;
        if (expiry && !isNaN(expiry.getTime())) {
            daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        }

        // 🔥 LAST HISTORY
        const lastHistory = member.expiryHistory?.length
            ? member.expiryHistory[member.expiryHistory.length - 1]
            : null;

        // 🔥 SUMMARY CALCULATION (CORRECT)
        let totalPaid = 0;
        let totalPending = 0;

        cleanPayments.forEach(p => {
            totalPaid += Number(p.paidAmount || 0);
            totalPending += Number(p.pendingAmount || 0);
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