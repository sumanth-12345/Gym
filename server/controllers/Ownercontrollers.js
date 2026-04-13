const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const OwnerModel = require("../models/OwnerModel");
const MemberModel = require("../models/MemberModel");
const TrainerModuel = require("../models/TrainerModuel");







const JWT_SECRET = process.env.JWT_SECRET;



const OwnerRegister = async (req, res) => {
    try {

        const { name, email, phone, password, ...rest } = req.body
        console.log("body", req.body)

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existing = await OwnerModel.findOne({
            $or: [{ email }, { phone }]
        });

        if (existing) {
            return res.status(400).json({ message: "Email or Phone already exists" });
        }


        const user = await OwnerModel.create({
            name,
            email,
            phone,
            password,
            ...rest
        })
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret missing in .env" });
        }

        const token = jwt.sign({ ownerId: user._id, role: "owner" }, JWT_SECRET, { expiresIn: "24h" });

        res.status(201).json({
            message: "Register successful",
            owner: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "server err" })
    }
}


const OwnerLogin = async (req, res) => {
    const { email, phone, password } = req.body;

    let user = null;
    let role = "";

    try {

        // 1️⃣ OWNER (email only)
        if (email && password) {
            user = await OwnerModel.findOne({ email });
            role = "owner";
        }



        if (!user && phone && password) {
            user = await TrainerModuel.findOne({ phone });
            role = "trainer";
        }

        if (!user && phone && password) {
            user = await MemberModel.findOne({ phone, isDeleted: false });
            role = "member";
        }

        // ❌ Not found
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // ❌ Password missing (THIS FIXES YOUR ERROR)
        if (!user.password) {
            return res.status(500).json({ message: "Password not set for this user" });
        }

        // ✅ Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        // ✅ Token
        const token = jwt.sign(
            { id: user._id, role },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role

            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const OwnerForgot = async (req, res) => {
    try {
        const { email } = req.body
        const user = await OwnerModel.findOne({ email })

        if (!user) {
            return res.send("user not found")
        }
        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: "15m" }
        )
        res.json({ message: "reset token generated", token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "check the forgotpassword" })
    }
}

const OwnerRset = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await OwnerModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = password;   // plain password
        await user.save();




        res.status(200).json({ message: "Password reset successful", user });



    } catch (err) {
        console.log(err)
        res.send("invalid expired token")
    }

}




module.exports = { OwnerRegister, OwnerLogin, OwnerForgot, OwnerRset }