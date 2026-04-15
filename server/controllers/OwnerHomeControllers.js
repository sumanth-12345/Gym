const MemberModel = require("../models/MemberModel");
const PaymentModel = require("../models/PaymentModel");
const PlanModel = require("../models/PlanModel");

const getDashboard = async (req, res) => {
    try {

        const ownerId = req.user._id;

        // 🔥 STEP 1: AUTO EXPIRE UPDATE (PUT HERE)


        const now = new Date();
        // ---------------- MEMBERS ----------------
        const totalMembers = await MemberModel.countDocuments({ ownerId });

        const activeMembers = await MemberModel.countDocuments({
            ownerId,
            expiryDate: { $gte: now }
        });

        const expiredMembers = await MemberModel.countDocuments({
            ownerId,
            expiryDate: { $lt: now }
        });

        // ---------------- PLANS ----------------
        const totalPlans = await PlanModel.countDocuments({ ownerId });

        // ---------------- PAYMENTS ----------------
        const payments = await PaymentModel.find({ ownerId });

        let totalRevenue = 0;
        let totalPendingAmount = 0;
        let monthlyRevenue = 0;
        let todayRevenue = 0;

        let completed = 0;
        let partial = 0;
        let pending = 0;


        const currentMonth = now.getMonth();
        const currentDate = now.toDateString();

        payments.forEach(p => {

            const paid = Number(p.paidAmount || 0);
            const amount = Number(p.amount || 0);

            totalRevenue += paid;
            totalPendingAmount += (amount - paid);

            const paymentDate = new Date(p.date);

            // today revenue
            if (paymentDate.toDateString() === currentDate) {
                todayRevenue += paid;
            }

            // monthly revenue
            if (paymentDate.getMonth() === currentMonth) {
                monthlyRevenue += paid;
            }

            // status count (SAFE)
            const status = (p.status || "").toUpperCase();

            if (status === "COMPLETED") completed++;
            else if (status === "PARTIAL") partial++;
            else pending++;
        });

        res.json({
            totalMembers,
            activeMembers,
            expiredMembers,
            totalPlans,

            totalRevenue,
            monthlyRevenue,
            todayRevenue,
            totalPendingAmount,

            completed,
            partial,
            pending
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Dashboard error" });
    }
};

module.exports = { getDashboard };