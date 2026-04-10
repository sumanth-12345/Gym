// import { useState } from "react";
// import API from "../../api/api";

// const goals = [
//     "Weight Loss",
//     "Muscle Gain",
//     "General Fitness",
//     "Fat Burn",
//     "Strength"
// ];

// const WorkoutDietPage = () => {

//     const [form, setForm] = useState({
//         fitnessGoal: "",
//         workout: "",
//         breakfast: "",
//         lunch: "",
//         snack: "",
//         dinner: ""
//     });

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async () => {
//         try {
//             const token = sessionStorage.getItem("token");

//             await API.post("/workout-diet/create", form, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             alert("Saved");
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <div className="p-6 max-w-xl mx-auto">

//             <h1 className="text-xl font-bold mb-4">Workout + Diet</h1>

//             {/* FITNESS GOAL */}
//             <select
//                 name="fitnessGoal"
//                 value={form.fitnessGoal}
//                 onChange={handleChange}
//                 className="border p-2 mb-3 w-full"
//             >
//                 <option value="">Select Goal</option>
//                 {goals.map(g => (
//                     <option key={g} value={g}>{g}</option>
//                 ))}
//             </select>

//             {/* WORKOUT */}
//             <input
//                 name="workout"
//                 placeholder="Workout (Chest + Triceps)"
//                 value={form.workout}
//                 onChange={handleChange}
//                 className="border p-2 mb-3 w-full"
//             />

//             {/* FOOD */}
//             <input name="breakfast" placeholder="Breakfast"
//                 value={form.breakfast} onChange={handleChange}
//                 className="border p-2 mb-3 w-full" />

//             <input name="lunch" placeholder="Lunch"
//                 value={form.lunch} onChange={handleChange}
//                 className="border p-2 mb-3 w-full" />

//             <input name="snack" placeholder="Snack"
//                 value={form.snack} onChange={handleChange}
//                 className="border p-2 mb-3 w-full" />

//             <input name="dinner" placeholder="Dinner"
//                 value={form.dinner} onChange={handleChange}
//                 className="border p-2 mb-3 w-full" />

//             <button
//                 onClick={handleSubmit}
//                 className="bg-blue-600 text-white px-4 py-2 w-full"
//             >
//                 Save
//             </button>

//         </div>
//     );
// };

// export default WorkoutDietPage;


// WorkoutDietPage.jsx
import { useState } from "react";
import API from "../../api/api";

const GOALS = [
    { value: "Weight Loss", icon: "🔥", desc: "Cardio + diet focus" },
    { value: "Muscle Gain", icon: "💪", desc: "Strength + protein" },
    { value: "General Fitness", icon: "🏃", desc: "Overall wellness" },
    { value: "Fat Burn", icon: "⚡", desc: "HIIT + metabolism" },
    { value: "Strength", icon: "🏋️", desc: "Heavy compound lifts" },
];

const MEALS = [
    { name: "breakfast", label: "Breakfast", icon: "🌅", placeholder: "e.g. Oats + banana + eggs" },
    { name: "lunch", label: "Lunch", icon: "☀️", placeholder: "e.g. Rice + dal + salad" },
    { name: "snack", label: "Snack", icon: "🍎", placeholder: "e.g. Peanut butter + toast" },
    { name: "dinner", label: "Dinner", icon: "🌙", placeholder: "e.g. Grilled chicken + veggies" },
];

const WorkoutDietPage = () => {
    const [form, setForm] = useState({
        fitnessGoal: "", workout: "",
        breakfast: "", lunch: "", snack: "", dinner: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.fitnessGoal) return setError("Please select a fitness goal");
        if (!form.workout) return setError("Please enter workout details");
        setError("");
        console.log("FORM DATA:", form);
        try {
            setLoading(true);
            // const token = sessionStorage.getItem("token");
            // await API.post("/workout-diet/create", form, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            // const token = sessionStorage.getItem("token");

            await API.post("/workout-diet/create",
                {
                    fitnessGoal: form.fitnessGoal,
                    workout: form.workout,
                    breakfast: form.breakfast || "",
                    lunch: form.lunch || "",
                    snack: form.snack || "",
                    dinner: form.dinner || ""
                }

            );
            console.log("FORM DATA:", form);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-xl mx-auto space-y-4">

                {/* ── Header ── */}
                <div className="text-center py-2">
                    <h1 className="text-xl font-bold text-gray-900">Workout + Diet Plan</h1>
                    <p className="text-sm text-gray-400 mt-1">Create a plan for your fitness goal</p>
                </div>

                {/* ── Fitness Goal ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                        <span>🎯</span>
                        <h2 className="text-sm font-semibold text-gray-700">Fitness Goal <span className="text-red-500">*</span></h2>
                    </div>
                    <div className="p-4 grid grid-cols-1 gap-2">
                        {GOALS.map(g => (
                            <label key={g.value}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                                    ${form.fitnessGoal === g.value
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                                <input type="radio" name="fitnessGoal" value={g.value}
                                    checked={form.fitnessGoal === g.value}
                                    onChange={handleChange} className="hidden" />
                                <span className="text-xl">{g.icon}</span>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${form.fitnessGoal === g.value ? "text-blue-700" : "text-gray-700"}`}>
                                        {g.value}
                                    </p>
                                    <p className="text-xs text-gray-400">{g.desc}</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                    ${form.fitnessGoal === g.value ? "border-blue-500" : "border-gray-300"}`}>
                                    {form.fitnessGoal === g.value && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* ── Workout ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                        <span>🏋️</span>
                        <h2 className="text-sm font-semibold text-gray-700">Workout <span className="text-red-500">*</span></h2>
                    </div>
                    <div className="p-5">
                        <textarea
                            name="workout"
                            rows={3}
                            placeholder="e.g. Chest + Triceps — Bench Press 4x10, Push-ups 3x15..."
                            value={form.workout}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none resize-none
                                focus:border-blue-500 hover:border-gray-300 transition-all text-gray-800 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* ── Diet / Meals ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                        <span>🥗</span>
                        <h2 className="text-sm font-semibold text-gray-700">Diet Plan</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {MEALS.map(m => (
                            <div key={m.name}>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    <span>{m.icon}</span>{m.label}
                                </label>
                                <input
                                    name={m.name}
                                    placeholder={m.placeholder}
                                    value={form[m.name]}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none
                                        focus:border-blue-500 hover:border-gray-300 transition-all text-gray-800 placeholder-gray-400"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                        <span className="text-red-500">⚠</span>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* ── Success ── */}
                {success && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                        <span>✅</span>
                        <p className="text-sm text-green-700 font-medium">Plan saved successfully!</p>
                    </div>
                )}

                {/* ── Submit ── */}
                <button onClick={handleSubmit} disabled={loading}
                    className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all"
                    style={{ background: loading ? "#93c5fd" : "#2563eb" }}>
                    {loading
                        ? <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving…
                        </span>
                        : "💾 Save Plan"}
                </button>

            </div>
        </div>
    );
};

export default WorkoutDietPage;