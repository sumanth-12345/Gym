// const useAccess = () => {
//     const role = sessionStorage.getItem("role");

//     let features = [];

//     try {
//         features = JSON.parse(sessionStorage.getItem("features")) || [];
//     } catch {
//         features = [];
//     }

//     const hasAccess = (feature) => {
//         if (role === "owner") return true; // 🔥 OWNER FULL ACCESS

//         return features.includes(feature);
//     };

//     return { hasAccess };
// };

// export default useAccess;


const useAccess = () => {
    let features = [];

    try {
        const stored = sessionStorage.getItem("features");
        features = stored ? JSON.parse(stored) : [];
    } catch {
        features = [];
    }

    const hasAccess = (feature) => {
        if (!feature) return true;
        return features.includes(feature);
    };

    return { hasAccess };
};

export default useAccess;