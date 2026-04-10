import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";


const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();   // ✅ add this

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {

            const res = await API.post("/auth/forgot-password", { email })

            const token = res.data.token

            alert("Reset token: " + token)

            navigate(`/resetpassword/${token}`, { replace: true })

        } catch (err) {

            console.log(err)

            alert("Email not found or server error")

        }
    }





    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
            >

                <h2 className="text-xl font-semibold text-center">Forgot Password</h2>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={!email}
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                    Get Reset Token
                </button>

            </form>

        </div>
    );
};

export default ForgotPassword;
