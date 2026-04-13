import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/api";
import jwt_decode from "jwt-decode";

// adjust path if needed

const Login = () => {
    const [identifier, setIdentifier] = useState(""); // email or phone
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!identifier) {
            setError("Please enter email/phone and password");
            return;
        }

        try {
            const res = await API.post("/auth/login", {
                email: identifier.includes("@") ? identifier : undefined,
                phone: !identifier.includes("@") ? identifier : undefined,
                password: identifier.includes("@") ? password : password || undefined,
            });




            const { token, user } = res.data;

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("role", user.role);
            sessionStorage.setItem(
                "features",
                JSON.stringify(user.features || [])
            );

            // 🔥 ROLE BASED REDIRECT
            if (user.role.toLowerCase() === "owner") {
                navigate("/owner/home");

            } else if (user.role.toLowerCase() === "trainer") {
                navigate("/trainer/profile");



            } else if (user.role.toLowerCase() === "member") {
                navigate("/member/profile");

            } else {
                navigate("/login");
            }

            // // ✅ Decode role
            // const decoded = jwt_decode(res.data.token);
            // sessionStorage.setItem("role", decoded.role);

            // // 🔥 REDIRECT BASED ON ROLE
            // if (decoded.role === "owner") {
            //     navigate("/owner/home");
            // } else if (decoded.role === "trainer") {
            //     navigate("/trainer/profile")
            // } else if (decoded.role === "member") {
            //     navigate("/member/profile");
            // } else {
            //     navigate("/login");
            // }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block mb-1">Email or Phone</label>
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter email or phone"
                    />
                </div>
                <div>
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Password"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>


                <div className="flex justify-between text-sm mt-2">
                    <Link to="/forgotpassword" className="text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
};
export default Login
