const paymentRequestModel = require("../models/paymentRequestModel");

const getMemberRejectmsgShow = async (req, res) => {
    try {
        const requests = await paymentRequestModel.find({
            memberId: req.user._id
        }).sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getMemberRejectmsgShow }