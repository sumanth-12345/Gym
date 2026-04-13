const mongoose = require("mongoose");
require("dotenv").config();

const MemberModel = require("../models/MemberModel");

const runFix = async () => {
    try {
        // ✅ CONNECT DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // ✅ FIND MEMBERS WITHOUT previousExpiryDate
        const members = await MemberModel.find({
            previousExpiryDate: { $exists: false }
        });

        console.log(`Found ${members.length} members to fix`);

        let count = 0;

        for (let m of members) {
            // 🔥 COPY OLD EXPIRY
            m.previousExpiryDate = m.expiryDate;

            await m.save();
            count++;
        }

        console.log(`✅ Fixed ${count} members`);

        process.exit();

    } catch (err) {
        console.error("❌ ERROR:", err);
        process.exit(1);
    }
};

runFix();