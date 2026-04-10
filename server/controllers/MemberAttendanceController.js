// attendanceController.js
const QRCode = require("qrcode");
const MemberAttendanceModel = require("../models/MemberAttendanceModel");
const MemberModel = require("../models/MemberModel"); // member details

// 🔹 QR VALIDATION
const isValidQR = (qr) => {
    const current = Math.floor(Date.now() / 30000);
    const previous = current - 1;
    return qr === `${current}-GYM` || qr === `${previous}-GYM`;
};

// 🔹 MARK ATTENDANCE VIA QR
const markAttendanceQR = async (req, res) => {
    try {
        const { qr } = req.body;

        if (!isValidQR(qr)) {
            return res.status(400).json({ message: "Invalid or expired QR" });
        }

        const memberId = req.user.id;

        // Day-lock: start & end of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Prevent duplicate attendance for today
        const already = await MemberAttendanceModel.findOne({
            memberId,
            date: { $gte: today, $lt: tomorrow }
        });

        if (already) {
            return res.json({ message: "Already marked today" });
        }

        // Create attendance record
        const attendance = new MemberAttendanceModel({ memberId, date: today });
        await attendance.save();

        res.json({ message: "Attendance marked ✅", date: today });
    } catch (err) {
        console.error("markAttendanceQR error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 GENERATE DYNAMIC QR IMAGE
const generateQR = async (req, res) => {
    try {
        const time = Math.floor(Date.now() / 30000);
        const qrText = `${time}-GYM`;

        const qrImage = await QRCode.toDataURL(qrText);

        res.json({
            qrText,
            qrImage
        });
    } catch (err) {
        console.error("generateQR error:", err);
        res.status(500).json({ message: "QR generation error" });
    }
};

// 🔹 VIEW MEMBER ATTENDANCE
const viewAttendance = async (req, res) => {
    try {
        const memberId = req.user.id;

        // Fetch member details
        const member = await MemberModel.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Fetch all attendance records of this member
        const attendanceRecords = await MemberAttendanceModel.find({ memberId });

        // Map date strings to Present
        const attendanceMap = {};
        attendanceRecords.forEach(a => {
            const dateStr = new Date(a.date).toLocaleDateString();
            attendanceMap[dateStr] = "Present";
        });

        // Loop from join date → today
        const startDate = new Date(member.joinDate);
        startDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = [];
        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toLocaleDateString();
            result.push({
                name: member.name,
                date: dateStr,
                state: attendanceMap[dateStr] || "Absent"
            });
        }

        res.json(result);
    } catch (err) {
        console.error("viewAttendance error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { markAttendanceQR, generateQR, viewAttendance };