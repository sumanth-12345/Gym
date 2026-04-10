const PlanModel = require("../models/PlanModel");

const createPlan = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let { fitnessplan, duration, price, hasTrainer, trainerFee } = req.body;

        // ✅ FORCE NUMBER
        // 🔥 FORCE CLEAN VALUES
        duration = parseInt(duration);
        price = parseInt(price);
        trainerFee = parseInt(trainerFee || 0);

        if (!fitnessplan || !duration || !price) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const plan = await PlanModel.create({
            ownerId: req.user._id,
            plan: `${duration} Month${duration > 1 ? "s" : ""}`,
            fitnessplan,
            duration,
            price,
            hasTrainer: hasTrainer || "No",
            trainerFee: hasTrainer === "Yes" ? trainerFee : 0,
        });

        res.status(201).json(plan);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating plan" });
    }
};



// GET ALL (owner-specific)
const getPlans = async (req, res) => {
    try {
        const plans = await PlanModel.find({ ownerId: req.user._id });
        res.json(plans);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching plans" });
    }
};

// DELETE
const deletePlan = async (req, res) => {
    try {
        await PlanModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Plan deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting plan" });
    }
};

module.exports = { createPlan, getPlans, deletePlan };