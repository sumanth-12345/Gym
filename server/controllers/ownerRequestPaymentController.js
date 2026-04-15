const PaymentModel = require("../models/PaymentModel");
const MemberModel = require("../models/MemberModel");
const paymentRequestModel = require("../models/paymentRequestModel");

const getOwnerRequests = async (req, res) => {
    try {

        const requests = await paymentRequestModel.find({
            ownerId: req.user._id   // 🔥 FILTER FIX
        })
            .populate("memberId", "name phone")
            .populate("planId")
            .sort({ createdAt: -1 });

        res.json(requests);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};




const getSingleRequest = async (req, res) => {
    try {

        const request = await paymentRequestModel.findById(req.params.id)
            .populate("memberId")
            .populate("planId");

        if (!request) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json(request);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const acceptRequest = async (req, res) => {
    try {
        const request = await paymentRequestModel.findById(req.params.id)
            .populate("planId");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const plan = request.planId;
        const member = await MemberModel.findById(request.memberId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        const totalAmount = plan.price + (plan.trainerFee || 0);
        const paidNow = Number(request.paidAmount || 0);
        const now = new Date();

        const oldExpiry = member.expiryDate ? new Date(member.expiryDate) : null;

        let payment = await PaymentModel.findOne({
            memberId: member._id,
            planId: plan._id,
            status: { $in: ["PENDING", "PARTIAL"] }
        });

        let paymentStatus = "PARTIAL";

        // =========================
        // PAYMENT LOGIC
        // =========================
        if (payment) {
            payment.paidAmount += paidNow;
            payment.pendingAmount = payment.amount - payment.paidAmount;

            if (payment.pendingAmount <= 0) {
                payment.status = "COMPLETED";
                payment.pendingAmount = 0;
                paymentStatus = "COMPLETED";
            } else {
                payment.status = "PARTIAL";
            }

            await payment.save();
        } else {
            paymentStatus =
                paidNow >= totalAmount ? "COMPLETED" : "PARTIAL";

            payment = new PaymentModel({
                memberId: member._id,
                ownerId: member.ownerId,
                planId: plan._id,
                amount: totalAmount,
                paidAmount: paidNow,
                pendingAmount: totalAmount - paidNow,
                status: paymentStatus
            });

            await payment.save();

            member.plan = plan.duration;
            member.amount = totalAmount;
            member.fitnessGoal = plan.fitnessGoal;
        }

        member.paymentStatus = paymentStatus;

        // =========================
        // EXPIRY FIX (NO LOSS SYSTEM)
        // =========================
        let baseDate;

        if (oldExpiry) {
            baseDate = new Date(oldExpiry);
        } else {
            baseDate = new Date(now);
        }

        baseDate.setMonth(baseDate.getMonth() + plan.duration);

        const newExpiry = baseDate;

        member.expiryDate = newExpiry;

        // =========================
        // HISTORY
        // =========================
        member.expiryHistory = member.expiryHistory || [];

        member.expiryHistory.push({
            oldExpiry,
            newExpiry,
            paymentDate: request.createdAt || new Date(),
            renewedAt: new Date()
        });

        // =========================
        // 🔥 UPCOMING PLAN FIX (ADDED NOW)
        // =========================
        if (paymentStatus !== "COMPLETED") {
            member.upcomingPlan = {
                planId: plan._id,
                amount: totalAmount,
                paidAmount: payment.paidAmount || paidNow,
                pendingAmount: totalAmount - (payment.paidAmount || paidNow),
                status: paymentStatus
            };
        } else {
            member.upcomingPlan = null;
        }

        await member.save();

        await paymentRequestModel.findByIdAndDelete(req.params.id);

        res.json({
            message: "Request accepted successfully",
            member,
            payment,
            oldExpiry,
            newExpiry
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


const rejectRequest = async (req, res) => {
    try {
        const { reason } = req.body;

        const request = await paymentRequestModel.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = "Rejected";
        request.reason = reason || "Payment rejected";
        await request.save();
        // await paymentRequestModel.findByIdAndDelete(req.params.id);
        await paymentRequestModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Request Rejected" });

    } catch (err) {
        res.status(500).json(err.message);
    }
};

module.exports = {
    getOwnerRequests,
    getSingleRequest,
    acceptRequest,
    rejectRequest

};