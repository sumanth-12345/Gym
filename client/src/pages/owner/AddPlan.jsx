

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const FITNESS_GOALS = [
    { value: "Weight Loss Plan", icon: "🔥", desc: "Cardio + diet focus" },
    { value: "Muscle Gain Plan", icon: "💪", desc: "Strength + protein" },
    { value: "General Fitness Plan", icon: "🏃", desc: "Overall wellness" },
    { value: "Fat Burn Plan", icon: "⚡", desc: "HIIT + metabolism" },
    { value: "Strength Plan", icon: "🏋️", desc: "Heavy compound lifts" },
];

const AddPlan = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fitnessplan: "",
        duration: "",
        price: "",
        hasTrainer: "No",
        trainerFee: "",
    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const isInvalid = (field) => !form[field];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // trainerFee is NOT required — only these 3 are required
        const required = ["fitnessplan", "duration", "price"];


        if (required.some(f => !form[f])) {
            return setError("Please fill all required fields");
        }

        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const payload = {
                fitnessplan: form.fitnessplan,
                duration: parseInt(form.duration),
                price: parseInt(form.price),
                hasTrainer: form.hasTrainer,
                trainerFee:
                    form.hasTrainer === "Yes"
                        ? parseInt(form.trainerFee || 0)
                        : 0,
            };

            await API.post("/owner/plan/create",
                payload
                , { headers: { Authorization: `Bearer ${token}` } });

            navigate("/owner/planpage");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const totalPrice =
        form.hasTrainer === "Yes" && form.price && form.trainerFee
            ? parseInt(form.price) + parseInt(form.trainerFee)
            : null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Add New Plan</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Fields marked <span className="text-red-500 font-bold">*</span> are required
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ── Fitness Goal ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                            <span>🎯</span>
                            <h2 className="text-sm font-semibold text-gray-700">
                                Fitness Goal <span className="text-red-500">*</span>
                            </h2>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-2">
                            {FITNESS_GOALS.map((g) => (
                                <label key={g.value}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                                        ${form.fitnessplan === g.value
                                            ? "border-blue-500 bg-blue-50"
                                            : isInvalid("fitnessplan")
                                                ? "border-red-200"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                                    <input type="radio" name="fitnessplan" value={g.value}
                                        checked={form.fitnessplan === g.value}
                                        onChange={handleChange}
                                        className="hidden" />
                                    <span className="text-xl">{g.icon}</span>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${form.fitnessplan === g.value ? "text-blue-700" : "text-gray-700"}`}>
                                            {g.value}
                                        </p>
                                        <p className="text-xs text-gray-400">{g.desc}</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                        ${form.fitnessplan === g.value ? "border-blue-500" : "border-gray-300"}`}>
                                        {form.fitnessplan === g.value && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                </label>
                            ))}
                            {isInvalid("fitnessplan") && (
                                <p className="text-xs text-red-500 px-1">Please select a fitness goal</p>
                            )}
                        </div>
                    </div>

                    {/* ── Duration & Price ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                            <span>💳</span>
                            <h2 className="text-sm font-semibold text-gray-700">Plan Details</h2>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-4">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Duration (Months) <span className="text-red-500">*</span>
                                </label>
                                <select name="duration" value={form.duration}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all bg-white
                                        ${isInvalid("duration")
                                            ? "border-red-400 bg-red-50"
                                            : "border-gray-200 focus:border-blue-500 hover:border-gray-300"}`}>
                                    <option value="">Select months</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i} value={i + 1}>
                                            {i + 1} {i + 1 === 1 ? "Month" : "Months"}
                                        </option>
                                    ))}
                                </select>
                                {isInvalid("duration") && (
                                    <p className="text-xs text-red-500">Required</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Plan Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                    <input type="number" name="price" placeholder="0"
                                        value={form.price} onChange={handleChange}
                                        className={`w-full pl-7 pr-3 py-2.5 text-sm rounded-xl border outline-none transition-all
                                            ${isInvalid("price")
                                                ? "border-red-400 bg-red-50"
                                                : "border-gray-200 focus:border-blue-500 hover:border-gray-300"}`} />
                                </div>
                                {isInvalid("price") && (
                                    <p className="text-xs text-red-500">Required</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Trainer ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                            <span>🏋️</span>
                            <h2 className="text-sm font-semibold text-gray-700">Trainer</h2>
                        </div>
                        <div className="p-5 space-y-4">

                            <div className="flex gap-3">
                                {[
                                    { value: "No", label: "❌ Without Trainer", active: "border-gray-400 bg-gray-50 text-gray-700" },
                                    { value: "Yes", label: "✅ With Trainer", active: "border-blue-500 bg-blue-50 text-blue-700" },
                                ].map(opt => (
                                    <label key={opt.value}
                                        className={`flex-1 flex items-center justify-center py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all
                                            ${form.hasTrainer === opt.value
                                                ? opt.active
                                                : "border-gray-200 text-gray-400 hover:bg-gray-50"}`}>
                                        <input type="radio" name="hasTrainer" value={opt.value}
                                            checked={form.hasTrainer === opt.value}
                                            onChange={handleChange}
                                            className="hidden" />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>

                            {/* Trainer Fee — fully optional, no star, no validation */}
                            {form.hasTrainer === "Yes" && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        Trainer Fee (₹)
                                        <span className="normal-case font-normal text-gray-400 text-xs">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                        <input type="number" name="trainerFee" placeholder="Enter fee or leave blank"
                                            value={form.trainerFee} onChange={handleChange}
                                            className="w-full pl-7 pr-3 py-2.5 text-sm rounded-xl border outline-none transition-all border-gray-200 focus:border-blue-500 hover:border-gray-300" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Total summary — only shows when both filled ── */}
                    {totalPrice && (
                        <div className="flex items-center justify-between px-5 py-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <div>
                                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">Total Price</p>
                                <p className="text-xs text-blue-400 mt-0.5">
                                    Plan ₹{form.price} + Trainer ₹{form.trainerFee}
                                </p>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">₹{totalPrice}</p>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                            <span className="text-red-500">⚠</span>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all"
                        style={{ background: loading ? "#93c5fd" : "#2563eb" }}>
                        {loading
                            ? <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating Plan…
                            </span>
                            : "+ Create Plan"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddPlan;