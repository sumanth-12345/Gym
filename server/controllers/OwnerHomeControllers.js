


// const MemberModel = require("../models/MemberModel");
// const PaymentModel = require("../models/PaymentModel");
// const PlanModel = require("../models/PlanModel");

// const getDashboard = async (req, res) => {
//     try {
//         const ownerId = req.user.id;
//         const now = new Date();

//         const startOfDay = new Date();
//         startOfDay.setHours(0, 0, 0, 0);

//         const endOfDay = new Date();
//         endOfDay.setHours(23, 59, 59, 999);

//         // ✅ TOTAL MEMBERS
//         const totalMembers = await MemberModel.countDocuments({ ownerId, isDeleted: false });

//         // ✅ ACTIVE MEMBERS
//         const activeMembers = await MemberModel.countDocuments({
//             ownerId,
//             isDeleted: false,
//             expiryDate: { $gte: now }
//         });

//         // ✅ EXPIRED MEMBERS
//         const expiredMembers = await MemberModel.countDocuments({
//             ownerId,
//             isDeleted: false,
//             expiryDate: { $lt: now }
//         });

//         // ✅ TOTAL PLANS
//         const totalPlans = await PlanModel.countDocuments({ ownerId });

//         // 🔥 PENDING + PARTIAL (USE remainingAmount ONLY)
//         const pendingMembers = await MemberModel.find({
//             ownerId,
//             isDeleted: false,
//             paymentStatus: { $in: ["Pending", "Partial"] }
//         });

//         const totalPendingAmount = pendingMembers.reduce(
//             (sum, m) => sum + (m.remainingAmount || m.amount || 0),
//             0
//         );

//         // 🔥 TODAY REVENUE (FULL + PARTIAL PAYMENTS)
//         const todayPayments = await PaymentModel.find({
//             ownerId,
//             date: { $gte: startOfDay, $lte: endOfDay }
//         });

//         const todayRevenue = todayPayments.reduce(
//             (sum, p) => sum + (p.amount || 0),
//             0
//         );

//         // 🔥 TOTAL REVENUE
//         const allPayments = await PaymentModel.find({ ownerId });

//         const totalRevenue = allPayments.reduce(
//             (sum, p) => sum + (p.amount || 0),
//             0
//         );

//         res.json({
//             totalMembers,
//             activeMembers,
//             expiredMembers,
//             totalPlans,
//             totalRevenue,
//             todayRevenue,
//             totalPendingAmount
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Dashboard error" });
//     }
// };

// module.exports = { getDashboard };



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