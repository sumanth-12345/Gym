const PlanModel = require("../models/PlanModel");

const getmemberplan = async (req, res) => {
    try {
        // Member must have a linked ownerId in their user profile
        const ownerId = req.user.ownerId;
        console.log("ownerId", ownerId)
        if (!ownerId) return res.status(400).json({ message: "Owner not linked" });

        const plans = await PlanModel.find({ ownerId });
        console.log("plans", plans)
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: "Error fetching plans" });
    }
};

module.exports = { getmemberplan }