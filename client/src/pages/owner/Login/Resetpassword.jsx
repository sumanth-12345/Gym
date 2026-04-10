import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";


const ResetPassword = () => {

    const { token } = useParams();


    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showpassword, setShowpassword] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setMessage("Password must be at least 6 characters")
            return
        }
        try {
            const res = await API.post(`/auth/reset-password/${token}`, {
                token,
                password
            })
            setMessage(res.data.message)
            alert("Password updated")
        } catch (err) {
            setMessage("Reset failed")
        }
        navigate("/login")

    };

    const passwordshow = () => {
        if (password.length > 0) {
            setShowpassword(!showpassword);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
            >

                <h2 className="text-xl font-semibold text-center">Reset Password</h2>

                {/* Password */}
                <div className="flex flex-col relative">
                    <label className="mb-1 text-sm font-medium">New Password</label>

                    <input
                        type={showpassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <button
                        type="button"
                        onClick={passwordshow}
                        disabled={!password}
                        className="absolute right-2 top-9 text-gray-600"
                    >
                        {showpassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={!password}
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                    Reset Password
                </button>

                {/* Messages */}
                {message && (
                    <p className="text-green-600 text-sm text-center">{message}</p>
                )}

            </form>

        </div>
    );
};

export default ResetPassword;
