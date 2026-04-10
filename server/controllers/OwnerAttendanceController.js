const MemberAttendanceModel = require("../models/MemberAttendanceModel");
const MemberModel = require("../models/MemberModel");




const getDailyAttendanceAllMembers = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: "Date required" });

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(targetDate);
        nextDate.setDate(targetDate.getDate() + 1);

        // Step 1: fetch members whose join–expiry include the target date
        const members = await MemberModel.find({
            joinDate: { $lte: targetDate },
            expiryDate: { $gte: targetDate }
        });

        // Step 2: fetch attendance for those members on the date
        const attendance = await MemberAttendanceModel.find({
            memberId: { $in: members.map(m => m._id) },
            date: { $gte: targetDate, $lt: nextDate }
        }).populate("memberId", "name");

        // Step 3: if some members don't have attendance yet, mark as Absent
        const result = members.map(m => {
            const att = attendance.find(a => a.memberId._id.toString() === m._id.toString());
            return {
                memberId: m._id,
                name: m.name,
                status: att ? att.status : "Absent" // default Absent
            };
        });

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch daily attendance" });
    }
};


module.exports = { getDailyAttendanceAllMembers };