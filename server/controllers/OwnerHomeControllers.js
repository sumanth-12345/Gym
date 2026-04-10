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

//         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//         // ✅ TOTAL MEMBERS
//         const totalMembers = await MemberModel.countDocuments({
//             ownerId,
//             isDeleted: false
//         });

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
//         const totalPlans = await PlanModel.countDocuments({
//             ownerId
//         });

//         // 🔥 IMPORTANT LOGIC START

//         // ✅ PENDING + PARTIAL (NOT EXPIRED)
//         const pendingMembers = await MemberModel.find({
//             ownerId,
//             isDeleted: false,
//             expiryDate: { $gte: now },
//             paymentStatus: { $in: ["Pending", "Partial"] }
//         });

//         // ✅ EXPIRED (DUE)
//         const dueMembers = await MemberModel.find({
//             ownerId,
//             isDeleted: false,
//             expiryDate: { $lt: now },
//             paymentStatus: { $ne: "Paid" }
//         });

//         // ✅ CALCULATE AMOUNTS
//         const pendingAmount = pendingMembers.reduce(
//             (sum, m) => sum + (m.amount || 0),
//             0
//         );

//         const dueAmount = dueMembers.reduce(
//             (sum, m) => sum + (m.amount || 0),
//             0
//         );

//         const totalPendingAmount = pendingAmount + dueAmount;

//         // 🔥 IMPORTANT LOGIC END

//         // ✅ TOTAL REVENUE
//         const payments = await PaymentModel.find({ ownerId });

//         const totalRevenue = payments.reduce(
//             (sum, p) => sum + (p.amount || 0),
//             0
//         );

//         // ✅ TODAY REVENUE
//         const todayPayments = await PaymentModel.find({
//             ownerId,
//             date: { $gte: startOfDay, $lte: endOfDay }
//         });

//         const todayRevenue = todayPayments.reduce(
//             (sum, p) => sum + (p.amount || 0),
//             0
//         );

//         // ✅ MONTHLY REVENUE
//         const monthlyPayments = await PaymentModel.find({
//             ownerId,
//             date: { $gte: startOfMonth }
//         });

//         const monthlyRevenue = monthlyPayments.reduce(
//             (sum, p) => sum + (p.amount || 0),
//             0
//         );

//         // ✅ FINAL RESPONSE
//         res.json({
//             totalMembers,
//             activeMembers,
//             expiredMembers,
//             totalPlans,
//             totalRevenue,
//             monthlyRevenue,
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
        const ownerId = req.user.id;
        const now = new Date();

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // ✅ TOTAL MEMBERS
        const totalMembers = await MemberModel.countDocuments({ ownerId, isDeleted: false });

        // ✅ ACTIVE MEMBERS
        const activeMembers = await MemberModel.countDocuments({
            ownerId,
            isDeleted: false,
            expiryDate: { $gte: now }
        });

        // ✅ EXPIRED MEMBERS
        const expiredMembers = await MemberModel.countDocuments({
            ownerId,
            isDeleted: false,
            expiryDate: { $lt: now }
        });

        // ✅ TOTAL PLANS
        const totalPlans = await PlanModel.countDocuments({ ownerId });

        // 🔥 PENDING + PARTIAL (USE remainingAmount ONLY)
        const pendingMembers = await MemberModel.find({
            ownerId,
            isDeleted: false,
            paymentStatus: { $in: ["Pending", "Partial"] }
        });

        const totalPendingAmount = pendingMembers.reduce(
            (sum, m) => sum + (m.remainingAmount || m.amount || 0),
            0
        );

        // 🔥 TODAY REVENUE (FULL + PARTIAL PAYMENTS)
        const todayPayments = await PaymentModel.find({
            ownerId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const todayRevenue = todayPayments.reduce(
            (sum, p) => sum + (p.amount || 0),
            0
        );

        // 🔥 TOTAL REVENUE
        const allPayments = await PaymentModel.find({ ownerId });

        const totalRevenue = allPayments.reduce(
            (sum, p) => sum + (p.amount || 0),
            0
        );

        res.json({
            totalMembers,
            activeMembers,
            expiredMembers,
            totalPlans,
            totalRevenue,
            todayRevenue,
            totalPendingAmount
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Dashboard error" });
    }
};

module.exports = { getDashboard };