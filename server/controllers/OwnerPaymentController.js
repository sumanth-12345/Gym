const MemberModel = require("../models/MemberModel");
const OwnerModel = require("../models/OwnerModel");
const PaymentModel = require("../models/PaymentModel");

// GET /owner/payments/all
const ownerGetPaymentsAll = async (req, res) => {
    try {

        // Fetch all payments, populate member name, sort by date descending
        const payments = await PaymentModel.find({ ownerId: req.user._id })
            .populate("memberId", "name phone") // must match Member schema ref
            .sort({ date: -1 }); // use 'date' field from schema

        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch payments" });
    }
};


const ownerPatchPayment = async (req, res) => {
    try {
        const { payAmount } = req.body;

        if (!payAmount || payAmount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const payment = await PaymentModel.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }


        const newPaid = payment.paidAmount + Number(payAmount);

        if (newPaid > payment.amount) {
            return res.status(400).json({ message: "Exceeds total amount" });
        }

        payment.paidAmount = newPaid;


        // ✅ Update payment status
        if (payment.paidAmount === payment.amount) {
            payment.status = "Completed";
        } else if (payment.paidAmount > 0) {
            payment.status = "Partial";
        } else {
            payment.status = "Pending";
        }

        await payment.save();

        // 🔹 Update member paymentStatus automatically
        const memberPayments = await PaymentModel.find({ memberId: payment.memberId })
            .sort({ date: -1 }); // latest first

        const latestPayment = memberPayments[0]; // newest payment


        const member = await MemberModel.findById(payment.memberId);

        if (member && latestPayment) {
            member.paymentStatus = latestPayment.status; // "Pending", "Partial", or "Completed"

            await member.save();
        }

        res.json({ payment, memberPaymentStatus: member?.paymentStatus });



    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update payment" });
    }
};

module.exports = { ownerGetPaymentsAll, ownerPatchPayment };