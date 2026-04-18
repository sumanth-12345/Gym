import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:4000/api"
    baseURL: "https://gym-flame-iota.vercel.app/api"
});

// 🔥 AUTO TOKEN ATTACH
API.interceptors.request.use((config) => {

    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;