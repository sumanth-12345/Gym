const PaymentModel = require("../models/PaymentModel");
const MemberModel = require("../models/MemberModel");
const paymentRequestModel = require("../models/paymentRequestModel");
const { calculateExpiry } = require("../utils/expiry");



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
        const { mode = "previous" } = req.body;

        const request = await paymentRequestModel.findById(req.params.id)
            .populate("planId");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const plan = request.planId;
        if (!plan || !plan.duration) {
            return res.status(400).json({
                message: "Plan duration missing"
            });
        }


        // STEP 2: CALCULATE TOTAL
        const totalAmount = plan.price + (plan.trainerFee || 0);
        const paidAmount = request.paidAmount || 0;
        const pendingAmount = totalAmount - paidAmount;

        const paymentStatus =
            paidAmount === totalAmount ? "COMPLETED"
                : paidAmount > 0 ? "PARTIAL" : "PENDING";

        // STEP 3: SAVE PAYMENT HISTORY
        const payment = new PaymentModel({
            memberId: request.memberId,
            ownerId: request.ownerId,
            planId: plan._id,

            amount: totalAmount,
            paidAmount,
            pendingAmount,
            status: paymentStatus,
            date: new Date(),
            type: request.type || "renew"
        });

        await payment.save();

        // STEP 4: UPDATE MEMBER (IMPORTANT FIX AREA)
        const member = await MemberModel.findById(request.memberId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        const oldExpiry = member.expiryDate;
        member.expiryHistory = member.expiryHistory || [];
        const newExpiry = calculateExpiry(oldExpiry, Number(plan.duration), mode);
        member.expiryHistory.push({
            oldExpiry: oldExpiry,
            newExpiry: newExpiry,
            renewedAt: new Date()
        });
        member.expiryDate = newExpiry;

        member.paymentStatus = paymentStatus;
        member.fitnessGoal = plan.fitnessplan;
        member.plan = plan.duration;
        member.amount = totalAmount;
        await member.save();
        await paymentRequestModel.findByIdAndDelete(req.params.id);



        return res.json({
            message: "Request accepted successfully",
            payment,
            member
        });

    } catch (err) {
        console.log("ACCEPT ERROR:", err);
        return res.status(500).json({ message: err.message });
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