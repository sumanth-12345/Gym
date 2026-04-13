
const bcrypt = require("bcrypt");
const PaymentModel = require("../models/PaymentModel");
const MemberModel = require("../models/MemberModel");
const TrainerModuel = require("../models/TrainerModuel");
const { calculateExpiry } = require("../utils/expiry");

// ✅ Add Member
const addMember = async (req, res) => {
    try {
        const { name, phone, password, plan, amount, joinDate, hasTrainer,
            trainerName, fitnessGoal, weight, height, healthIssues, paymentStatus, ...reset } = req.body;

        const ownerId = req.user.id;


        // 1️⃣ All fields check
        if (!name || !phone || !password || !plan || !amount || !joinDate) {
            return res.status(400).json({ message: "All fields required" });
        }

        // 2️⃣ Phone validation
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        // 3️⃣ Plan validation
        const months = parseInt(plan);
        if (isNaN(months) || months < 1 || months > 20) {
            return res.status(400).json({ message: "Invalid plan" });
        }

        // 4️⃣ Amount validation
        const amt = Number(amount);

        if (!Number.isFinite(amt) || amt <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // 5️⃣ Check existing member phone
        const existing = await MemberModel.findOne({ phone, ownerId })
        if (existing) {
            return res.status(400).json({ message: "Phone already exists" });
        }

        // 6️⃣ Hash password


        // 7️⃣ Calculate expiryDate based on joinDate + plan
        const join = new Date(joinDate);
        if (isNaN(join.getTime())) {
            return res.status(400).json({ message: "Invalid joinDate" });
        }

        const expiry = new Date(join);
        expiry.setMonth(expiry.getMonth() + months);



        // 8️⃣ Normalize paymentStatus
        let normalizedStatus = "Pending";
        let paidAmount = 0;
        if (paymentStatus?.toLowerCase() === "payment completed") {
            normalizedStatus = "Completed";
            paidAmount = amt;
        } else if (paymentStatus?.toLowerCase() === "partial") {
            normalizedStatus = "Partial";
            paidAmount = amt / 2; // example, adjust as needed
        }


        // 🔥 ADD HERE
        let trainerId = null;

        if (hasTrainer === "Yes" && trainerName) {
            const trainer = await TrainerModuel.findOne({ name: trainerName });

            if (!trainer) {
                return res.status(400).json({ message: "Trainer not found" });
            }

            trainerId = trainer._id;
        }

        // 8️⃣ Create member
        const member = await MemberModel.create({
            name,
            phone,
            password,
            plan: months,
            amount: amt,
            joinDate: join,
            // ✅ LOGIC FIX
            hasTrainer: hasTrainer === "Yes",
            trainerName: hasTrainer === "Yes" ? trainerName : "",
            expiryDate: expiry,
            weight,
            height,
            healthIssues,
            fitnessGoal: fitnessGoal || "",
            status: "active",
            paymentStatus: normalizedStatus,
            planSnapshot: `${months}M`,
            trainerId,
            ...reset,
            ownerId
        });

        const pendingAmount = amt - paidAmount;
        // 🔥 CREATE PAYMENT (IMPORTANT)
        const payment = new PaymentModel({
            ownerId: req.user._id,
            memberId: member._id,
            amount: amt,
            paidAmount, // FULL PAID
            pendingAmount: pendingAmount,
            status: normalizedStatus,
            date: new Date()
        });

        await payment.save();
        res.status(201).json({
            message: "Member added successfully",
            member: {
                id: member._id,
                name: member.name,
                phone: member.phone,
                plan: member.plan,
                amount: member.amount,
                status: member.status,
                paymentStatus: member.paymentStatus,
                joinDate: member.joinDate,
                expiryDate: member.expiryDate,
                trainer: member.trainer,
                fitnessGoal: member.fitnessGoal
            },
            payment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ Get Members
const getMembers = async (req, res) => {
    try {
        const members = await MemberModel.find({ ownerId: req.user._id }).sort({ joinDate: -1 });
        res.json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update Member
const updateMember = async (req, res) => {

    try {
        const { id } = req.params;
        const { name, phone, plan, amount, joinDate, trainer,
            fitnessGoal, weight, height, healthIssues, paymentStatus } = req.body;

        if (!name || !phone || !plan || !amount || !joinDate || !paymentStatus) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        const months = Number(plan);
        const amt = Number(amount);

        // 🔹 Validation
        if (
            !Number.isInteger(months) || months < 1 || months > 20 ||
            !Number.isFinite(amt) || amt <= 0
        ) {
            return res.status(400).json({ message: "Invalid plan or amount" });
        }

        const join = new Date(joinDate);
        if (isNaN(join.getTime())) {
            return res.status(400).json({ message: "Invalid joinDate" });
        }

        const expiry = new Date(join);
        expiry.setMonth(expiry.getMonth() + months);


        const updated = await MemberModel.findByIdAndUpdate(
            id,
            {
                name, phone, plan: months, amount: amt, joinDate: join, expiryDate: expiry,
                trainer, fitnessGoal, weight, height, healthIssues, paymentStatus
            },
            { returnDocument: "after", runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json({ message: "Member updated successfully", member: updated });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ Delete Member + related payments (CLEAN FIX)
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. check member exists
        const member = await MemberModel.findById(id);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // 2. delete related payments FIRST (important)
        const paymentDeleteResult = await PaymentModel.deleteMany({
            memberId: id
        });

        // 3. delete member
        await MemberModel.findByIdAndDelete(id);

        res.json({
            message: "Member deleted successfully",
            deletedMemberId: id,
            deletedPayments: paymentDeleteResult.deletedCount
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { addMember, getMembers, updateMember, deleteMember };