const MemberModel = require("../models/MemberModel");
const paymentRequestModel = require("../models/paymentRequestModel");
const PlanModel = require("../models/PlanModel");


const getmemberplan = async (req, res) => {
    try {
        const ownerId = req.user.ownerId;

        const plans = await PlanModel.find({ ownerId });

        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




// get single plan
const getSinglePlan = async (req, res) => {
    try {
        const plan = await PlanModel.findById(req.params.id);

        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




const createPaymentRequest = async (req, res) => {
    try {

        const member = await MemberModel.findById(req.user._id);

        const planId = req.body.planId;

        // 🔥 FIX: accept correct fields safely
        const totalAmount = Number(req.body.totalAmount);
        const paidAmount = Number(req.body.paidAmount || 0);
        const pendingAmount = Number(req.body.pendingAmount || (totalAmount - paidAmount));

        if (!totalAmount) {
            return res.status(400).json({ message: "totalAmount missing" });
        }

        const request = new paymentRequestModel({
            memberId: member._id,
            ownerId: member.ownerId,

            planId,

            totalAmount,
            paidAmount,
            pendingAmount,

            screenshot: req.file?.filename
        });

        await request.save();

        res.json(request);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


module.exports = {

    getmemberplan,
    getSinglePlan,
    createPaymentRequest,
};