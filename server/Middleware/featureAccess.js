module.exports = (feature) => {
    return (req, res, next) => {

        if (req.role === "owner") return next();

        if (req.role === "staff") {
            if (!req.user.features.includes(feature)) {
                return res.status(403).json({ message: "No access" });
            }
        }

        next();
    };
};