import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/api";

const UpDateMember = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const memberToEdit = location.state?.member;

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        plan: 1,
        joinDate: "",
        amount: "",
        paymentStatus: "",
        hasTrainer: "No",
        trainerName: "",
        fitnessGoal: "",
        weight: "",
        height: "",
        healthIssues: ""
    });

    const [error, setError] = useState("");

    // ✅ LOAD DATA PROPERLY
    useEffect(() => {
        if (memberToEdit) {
            setFormData({
                name: memberToEdit.name || "",
                phone: memberToEdit.phone || "",
                password: "",
                plan: memberToEdit.plan || 1,
                joinDate: memberToEdit.joinDate
                    ? new Date(memberToEdit.joinDate).toISOString().slice(0, 10)
                    : "",
                amount: memberToEdit.amount || "",
                paymentStatus: memberToEdit.paymentStatus || "",
                hasTrainer: memberToEdit.hasTrainer ? "Yes" : "No",
                trainerName: memberToEdit.trainerName || "",
                fitnessGoal: memberToEdit.fitnessGoal || "",
                weight: memberToEdit.weight || "",
                height: memberToEdit.height || "",
                healthIssues: memberToEdit.healthIssues || ""
            });
        }
    }, [memberToEdit]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ✅ SUBMIT FIXED
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.phone || !formData.joinDate) {
            return setError("Required fields missing");
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            return setError("Invalid phone number");
        }

        if (formData.hasTrainer === "Yes" && !formData.trainerName) {
            return setError("Trainer name required");
        }

        try {
            await API.put(
                `/owner/addmember/update/${memberToEdit._id}`,
                formData
            );

            navigate("/owner/memberlist");

        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Update Member</h1>
                    <p className="text-sm text-gray-500 mt-1">Edit member details below</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {[
                            { label: "Name", name: "name", type: "text" },
                            { label: "Phone", name: "phone", type: "text" },
                            { label: "Password", name: "password", type: "password" },
                            { label: "Amount", name: "amount", type: "text" },
                            { label: "Weight (kg)", name: "weight", type: "text" },
                            { label: "Height (cm)", name: "height", type: "text" },
                        ].map((f) => (
                            <div key={f.name} className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{f.label}</label>
                                <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange}
                                    className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                        ))}

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan</label>
                            <select name="plan" value={formData.plan} onChange={handleChange}
                                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} Month</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Join Date</label>
                            <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange}
                                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trainer</label>
                            <select name="hasTrainer" value={formData.hasTrainer} onChange={handleChange}
                                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>

                        {formData.hasTrainer === "Yes" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trainer Name</label>
                                <input name="trainerName" value={formData.trainerName} onChange={handleChange}
                                    className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Status</label>
                            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}
                                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                                <option value="">Select</option>
                                <option>payment completed</option>
                                <option>payment pending</option>

                            </select>

                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fitness Goal</label>
                            <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}
                                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="">Select</option>
                                <option>Weight Loss</option>
                                <option>Muscle Gain</option>
                                <option>General Fitness</option>
                                <option>Fat Burn </option>
                                <option>Strength </option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Health Issues</label>
                            <textarea name="healthIssues" value={formData.healthIssues} onChange={handleChange} rows={3}
                                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                        </div>

                        {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}

                        <button type="submit"
                            className="md:col-span-2 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">
                            Update Member
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpDateMember;