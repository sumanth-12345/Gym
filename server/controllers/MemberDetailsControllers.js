
const jwt = require("jsonwebtoken")
const PaymentModel = require("../models/PaymentModel")
const MemberModel = require("../models/MemberModel")


const JWT_SECRET = process.env.JWT_SECRET



const getMyProfile = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.id) return res.status(400).json({ message: "Invalid token" });

        const member = await MemberModel.findById(decoded.id).select("-password");
        if (!member) return res.status(404).json({ message: "Member not found" });

        // Calculate remaining days
        const today = new Date();
        let daysLeft = null;
        if (member.expiryDate) {
            const expiry = new Date(member.expiryDate);
            const diff = expiry - today;
            daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
        }

        res.json({ ...member.toObject(), daysLeft });
    } catch (err) {
        console.error("getMyProfile error:", err);
        res.status(500).json({ message: "Server error" });
    }
};



// ✅ GET PAYMENTS
const getMyPayments = async (req, res) => {
    try {
        console.log("USER:", req.user);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const payments = await PaymentModel.find({ memberId: req.user.id })
            .sort({ date: -1 })
            .populate({
                path: 'memberId',
                select: 'plan' // get member plan
            });

        // Map to include planSnapshot if missing
        const mapped = payments.map(p => ({
            _id: p._id,
            amount: p.amount,
            paidAmount: p.paidAmount,
            type: p.type,
            status: p.status,
            date: p.date,
            planSnapshot: p.planSnapshot || (p.memberId ? `${p.memberId.plan}M` : '—')
        }));

        res.json(mapped);

    } catch (err) {
        console.error("PAYMENT ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { getMyProfile, getMyPayments };
