import { useState } from "react";

import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const AddTrainer = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        password: "",
        phone: "",
        monthlyAmount: "",
        joinDate: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.phone) {
            alert("Name & Phone required");
            return;
        }

        try {
            await API.post("/trainer/add", form);

            alert("Trainer Added");

            // Reset form
            setForm({
                name: "",
                password: "",
                phone: "",
                monthlyAmount: "",
                joinDate: ""
            });

            navigate("/owner/trainerdetails");

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Add Trainer
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="number"
                        name="monthlyAmount"
                        placeholder="Monthly Amount"
                        value={form.monthlyAmount}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="date"
                        name="joinDate"
                        value={form.joinDate}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
                    >
                        Add Trainer
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddTrainer;