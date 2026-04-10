// utils/auth.js
export const getUserType = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        // simple decode for testing, in production use real JWT decode
        const payload = JSON.parse(atob(token));
        return payload.role; // "member" or "owner"
    } catch (e) {
        return null;
    }
};

export const getUserName = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token));
        return payload.name;
    } catch (e) {
        return null;
    }
};

export const removeToken = () => {
    sessionStorage.removeItem("token");
};