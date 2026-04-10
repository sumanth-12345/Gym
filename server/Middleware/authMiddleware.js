const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const OwnerModel = require("../models/OwnerModel");
const MemberModel = require("../models/MemberModel");
const TrainerModuel = require("../models/TrainerModuel");
const StaffModuel = require("../models/StaffModuel");

const authMiddleware = (roles = []) => async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        let user;
        if (decoded.role === "owner") user = await OwnerModel.findById(decoded.id).select("-password");
        else if (decoded.role === "member") user = await MemberModel.findById(decoded.id).select("-password");
        else if (decoded.role === "trainer") user = await TrainerModuel.findById(decoded.id).select("-password")
        else if (decoded.role === "staff") {
            user = await StaffModuel.findById(decoded.id).select("-password")
        }
        if (!user) return res.status(401).json({ message: "User not found" });

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: "Not authorized" });
        }


        // ✅ Assign req.user BEFORE role check
        req.user = user;
        req.user.role = decoded.role;
        req.role = decoded.role;
        next();

        // Role check after assignment
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid token" });
    }

}

module.exports = authMiddleware;