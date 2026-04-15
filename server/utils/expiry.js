

const calculateExpiry = (currentExpiry, durationMonths, mode = "previous") => {
    let baseDate;

    const now = new Date();
    const oldDate = currentExpiry ? new Date(currentExpiry) : null;

    if (mode === "current") {
        // Start from today
        baseDate = new Date(now);
    } else {
        // Start from old expiry (even if expired)
        baseDate = oldDate ? new Date(oldDate) : new Date(now);
    }

    baseDate.setMonth(baseDate.getMonth() + Number(durationMonths));

    return baseDate;
};

module.exports = { calculateExpiry };