const OwnerModel = require("../models/OwnerModel");

// GET /owner/me
const getOwnerProfile = async (req, res) => {
    try {
        const ownerId = req.user._id;
        console.log("ownerId", ownerId)

        const owner = await OwnerModel.findById(ownerId).select("-password");

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // ✅ Only send owner details (NO token here)
        res.status(200).json({
            id: owner._id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
            role: "owner"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { getOwnerProfile };