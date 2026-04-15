const { calculateExpiry } = require("./expiry");

const checkAndActivatePlan = async (member) => {

    const now = new Date();

    if (
        member.expiryDate &&
        member.expiryDate < now &&
        member.upcomingPlan?.status === "COMPLETED"
    ) {
        member.expiryDate = calculateExpiry(now, member.plan); // use correct duration
        member.upcomingPlan = null;

        await member.save();
    }
};

module.exports = { checkAndActivatePlan };