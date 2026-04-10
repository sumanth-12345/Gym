

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