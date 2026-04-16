const express = require("express");
require("dotenv").config();
const cors = require("cors");

const mongoose = require("mongoose");


const OwnerRouter = require("./router/ownerRegRouter");
const ownerMemberRouter = require("./router/ownermemberRouter");
const ownerExpiringDate = require("./router/ownerExpiringDateRouter");
const MemberRouter = require("./router/MemberRouter");
const ownerpaymentRouter = require("./router/ownerpaymentRouter");

const reportRouter = require("./router/reportRoutes");
const planRouter = require("./router/PlanRouter");
const HomeRouter = require("./router/ownerHomeRouter");
const memberPlanRoutes = require("./router/memberplanRoute");
const OwnerprofileRouter = require("./router/OwnerProfileRoute");
const workoutDietRoutes = require("./router/workoutDietRoutes");
const TrainerRouter = require("./router/TrainerRouter");

const ownerRequestRouter = require("./router/ownerRequsetRoutes");
const ownerMemberRoutes = require("./router/ownerMemberDetailsRoutes");
const MemberMsgRouter = require("./router/MemberMsgRouter");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Debug env
console.log("JWT_SECRET:", process.env.JWT_SECRET);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
//owner
app.use("/api/auth", OwnerRouter);
app.use("/api/owner/addmember", ownerMemberRouter);
app.use("/api/owner", ownerpaymentRouter)
app.use("/api", ownerExpiringDate)

app.use("/api/owner/reports", reportRouter)
app.use("/api/owner/plan", planRouter)
app.use("/api/owner", HomeRouter)
app.use("/api/owner", OwnerprofileRouter)

app.use("/api/workout-diet", workoutDietRoutes);

app.use("/api/trainer", TrainerRouter)

app.use("/api/owner", ownerRequestRouter)
app.use("/api", ownerMemberRoutes);
// member

app.use("/api/member", MemberRouter);
app.use("/api/member", MemberMsgRouter)

app.use("/api/member/plan", memberPlanRoutes);

app.use("/uploads", express.static("uploads"));



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));