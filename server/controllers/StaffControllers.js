
const StaffModuel = require("../models/StaffModuel");



const createStaff = async (req, res) => {
    try {
        console.log("BODY:", req.body); // 🔥 check this

        const { name, phone, password } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const staff = new StaffModuel({
            ownerId: req.user._id,
            name,
            phone,
            password
        });

        await staff.save();

        res.status(201).json({ message: "Staff created", staff });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
// GET STAFF


// GET ALL STAFF (OWNER ONLY)
const getAllStaff = async (req, res) => {
    try {
        console.log("USER:", req.user); // DEBUG

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not found in request" });
        }

        const staff = await StaffModuel.find({
            ownerId: req.user._id
        });

        res.status(200).json(staff);

    } catch (err) {
        console.error("GET STAFF ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};



// UPDATE ACCESS
const updatePermissions = async (req, res) => {
    try {
        const { features } = req.body;
        const staff = await StaffModuel.findByIdAndUpdate(
            req.params.id,
            { features: features || [] },
            { new: true }
        );
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json(staff);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




// 🔥 STAFF PROFILE
const getStaffProfile = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user); // DEBUG

        if (!req.user || req.user.role !== "staff") {
            return res.status(403).json({ message: "Not staff" });
        }

        const staff = await StaffModuel.findById(req.user.id);

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json(staff);

    } catch (err) {
        console.error("STAFF PROFILE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};



module.exports = { createStaff, getAllStaff, updatePermissions, getStaffProfile };