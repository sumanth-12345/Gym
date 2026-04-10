import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../../../api/api";

const Register = () => {
    const [formData, setformdata] = useState({
        name: "", email: "", phone: "", password: ""
    })
    const [error, setError] = useState("");
    const [showpassword, setshowpassword] = useState(false)
    const navigate = useNavigate()


    const handlechange = (e) => {
        const { name, value } = e.target
        setformdata((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const isvalidemail = (email) => {
        return /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/.test(email);
    };


    const isStrongPassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };


    const handlesubmit = async (e) => {
        e.preventDefault()


        if (!isvalidemail(formData.email)) {
            setError("Invalid email format");
            return;
        }

        if (!isStrongPassword(formData.password)) {
            setError(
                "Password must be at least 8 chars, include uppercase, lowercase, number, and special char"
            );
            return;
        }
        setError(""); // clear error
        //  console.log("Form Data:", formData);


        try {

            const res = await API.post("/auth/register", formData);

            sessionStorage.setItem("token", res.data.token);
            console.log("token", res.data.token)

            //  localStorage.setItem("owner", JSON.stringify(res.data.owner));
            //  console.log("owner", localStorage.setItem("owner", JSON.stringify(res.data.owner)))

        } catch (err) {

            setError(err.response?.data?.message || "Registration failed");
        }
        navigate("/owner/addmember");
        console.log(formData)

    }

    const passwordshow = () => {
        if (formData.password.length > 0) {
            setshowpassword(!showpassword)
        }

    }

    return (
        <>

            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

                <form
                    onSubmit={handlesubmit}
                    className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
                >

                    <h2 className="text-xl font-semibold text-center">Register</h2>

                    {/* Name */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            onChange={handlechange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handlechange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    {/* Phone */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone"
                            value={formData.phone}
                            onChange={handlechange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col relative">
                        <label className="mb-1 text-sm font-medium">Password</label>

                        <input
                            type={showpassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handlechange}
                            className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="button"
                            disabled={!formData.password}
                            onClick={passwordshow}
                            className="absolute right-2 top-9 text-gray-600"
                        >
                            {showpassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={!formData.email || !formData.phone || !formData.password || !formData.name}
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        Register
                    </button>

                    {/* Footer */}
                    <div className="text-center text-sm">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>

                </form>

            </div>
        </>
    )
}
export default Register