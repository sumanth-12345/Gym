// const calculateExpiry = (currentExpiry, durationMonths, mode = "previous") => {
//     const now = new Date();
//     let baseDate;

//     if (mode === "current") {
//         baseDate = new Date(now); // today
//     } else {
//         baseDate = currentExpiry
//             ? new Date(currentExpiry) // ALWAYS old expiry
//             : new Date(now);
//     }

//     baseDate.setMonth(baseDate.getMonth() + Number(durationMonths));

//     return baseDate;
// };

// module.exports = { calculateExpiry };

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