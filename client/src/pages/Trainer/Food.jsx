// // Food.jsx
// import { useEffect, useState } from "react";
// import API from "../../api/api";

// const Food = () => {
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     // Fetch all workout/diet plans
//     const fetchPlans = async () => {
//         try {
//             setLoading(true);
//             const token = sessionStorage.getItem("token");
//             const res = await API.get("/workout-diet/all", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPlans(res.data || []);
//         } catch (err) {
//             console.error(err);
//             setError("Failed to load plans");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPlans();
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
//                 <h1 className="text-xl font-bold text-gray-900 mb-4">Workout + Diet Plans</h1>

//                 {loading && (
//                     <p className="text-gray-500 text-center py-10">Loading plans...</p>
//                 )}

//                 {error && (
//                     <p className="text-red-500 text-center py-4">{error}</p>
//                 )}

//                 {!loading && plans.length === 0 && (
//                     <p className="text-gray-400 text-center py-10">No plans available.</p>
//                 )}

//                 {plans.length > 0 && (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200 text-sm">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-4 py-2 text-left font-medium text-gray-500">#</th>
//                                     <th className="px-4 py-2 text-left font-medium text-gray-500">Fitness Goal</th>
//                                     <th className="px-4 py-2 text-left font-medium text-gray-500">Workout</th>
//                                     <th className="px-4 py-2 text-left font-medium text-gray-500">Breakfast</th>
//                                     <th className="px-4 py-2 text-left font-medium text-gray-500">Lunch</th>
//                                     <th className="px-4 py-2 text-left font-medium text-gray-500">Snack</th>
//                                     <th className="px-4 py-2 text-left font-medium text-gray-500">Dinner</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100">
//                                 {plans.map((plan, idx) => (
//                                     <tr key={plan._id} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
//                                         <td className="px-4 py-2 text-gray-800">{plan.fitnessGoal}</td>
//                                         <td className="px-4 py-2 text-gray-700">{plan.workout}</td>
//                                         <td className="px-4 py-2 text-gray-700">{plan.breakfast}</td>
//                                         <td className="px-4 py-2 text-gray-700">{plan.lunch}</td>
//                                         <td className="px-4 py-2 text-gray-700">{plan.snack}</td>
//                                         <td className="px-4 py-2 text-gray-700">{plan.dinner}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Food;


// // Food.jsx
// import { useEffect, useState } from "react";
// import API from "../../api/api";

// const GOAL_ICON = {
//     "Weight Loss": "🔥",
//     "Muscle Gain": "💪",
//     "General Fitness": "🏃",
//     "Fat Burn": "⚡",
//     "Strength": "🏋️",
// };

// const MEALS = [
//     { key: "workout", label: "Workout", icon: "🏋️", gramKey: null },
//     { key: "breakfast", label: "Breakfast", icon: "🌅", gramKey: "breakfastGrams" },
//     { key: "lunch", label: "Lunch", icon: "☀️", gramKey: "lunchGrams" },
//     { key: "snack", label: "Snack", icon: "🍎", gramKey: "snackGrams" },
//     { key: "dinner", label: "Dinner", icon: "🌙", gramKey: "dinnerGrams" },
// ];

// const Food = () => {
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [editId, setEditId] = useState(null);
//     const [editForm, setEditForm] = useState({});
//     const [deleteId, setDeleteId] = useState(null);
//     const [saving, setSaving] = useState(false);

//     const fetchPlans = async () => {
//         try {
//             setLoading(true);
//             const token = sessionStorage.getItem("token");
//             const res = await API.get("/workout-diet/all", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPlans(res.data || []);
//         } catch (err) {
//             console.error(err);
//             setError("Failed to load plans");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchPlans(); }, []);

//     const startEdit = (plan) => {
//         setEditId(plan._id);
//         setEditForm({
//             workout: plan.workout || "",
//             breakfast: plan.breakfast || "",
//             breakfastGrams: plan.breakfastGrams || "",
//             lunch: plan.lunch || "",
//             lunchGrams: plan.lunchGrams || "",
//             snack: plan.snack || "",
//             snackGrams: plan.snackGrams || "",
//             dinner: plan.dinner || "",
//             dinnerGrams: plan.dinnerGrams || "",
//         });
//     };

//     const handleSave = async (id) => {
//         try {
//             setSaving(true);
//             const token = sessionStorage.getItem("token");
//             await API.put(`/workout-diet/update/${id}`, editForm, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setEditId(null);
//             fetchPlans();
//         } catch (err) {
//             console.error(err);
//             alert("Failed to update");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             const token = sessionStorage.getItem("token");
//             await API.delete(`/workout-diet/delete/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setDeleteId(null);
//             fetchPlans();
//         } catch (err) {
//             console.error(err);
//             alert("Failed to delete");
//         }
//     };

//     if (loading) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="flex flex-col items-center gap-3">
//                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                 <p className="text-sm text-gray-400">Loading plans…</p>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-6xl mx-auto space-y-5">

//                 {/* ── Header ── */}
//                 <div className="text-center py-2">
//                     <h1 className="text-xl font-bold text-gray-900">Workout + Diet Plans</h1>
//                     <p className="text-sm text-gray-400 mt-1">{plans.length} plans available</p>
//                 </div>

//                 {error && (
//                     <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
//                         <span className="text-red-500">⚠</span>
//                         <p className="text-sm text-red-600">{error}</p>
//                     </div>
//                 )}

//                 {plans.length === 0 ? (
//                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
//                         <div className="text-4xl mb-3">🥗</div>
//                         <p className="text-gray-400 text-sm">No plans available yet</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-5">
//                         {plans.map((plan) => (
//                             <div key={plan._id}
//                                 className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

//                                 {/* ── Card header ── */}
//                                 <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xl">{GOAL_ICON[plan.fitnessGoal] || "🎯"}</span>
//                                         <span className="font-semibold text-gray-800 text-sm">{plan.fitnessGoal}</span>
//                                     </div>

//                                     <div className="flex gap-2">
//                                         {editId === plan._id ? (
//                                             <>
//                                                 <button onClick={() => handleSave(plan._id)}
//                                                     disabled={saving}
//                                                     className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-80"
//                                                     style={{ background: "#2563eb" }}>
//                                                     {saving ? "Saving…" : "✅ Save"}
//                                                 </button>
//                                                 <button onClick={() => setEditId(null)}
//                                                     className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200">
//                                                     Cancel
//                                                 </button>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <button onClick={() => startEdit(plan)}
//                                                     className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-80"
//                                                     style={{ background: "#2563eb" }}>
//                                                     ✏️ Edit
//                                                 </button>
//                                                 {deleteId === plan._id ? (
//                                                     <div className="flex gap-1">
//                                                         <button onClick={() => handleDelete(plan._id)}
//                                                             className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white"
//                                                             style={{ background: "#ef4444" }}>
//                                                             Confirm
//                                                         </button>
//                                                         <button onClick={() => setDeleteId(null)}
//                                                             className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100">
//                                                             Cancel
//                                                         </button>
//                                                     </div>
//                                                 ) : (
//                                                     <button onClick={() => setDeleteId(plan._id)}
//                                                         className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-80"
//                                                         style={{ background: "#ef4444" }}>
//                                                         🗑️ Delete
//                                                     </button>
//                                                 )}
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* ── Table ── */}
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full text-sm">
//                                         <thead>
//                                             <tr className="border-b border-gray-100">
//                                                 {["#", "Type", "Details", "Grams"].map(h => (
//                                                     <th key={h}
//                                                         className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
//                                                         {h}
//                                                     </th>
//                                                 ))}
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-50">
//                                             {MEALS.map((m, i) => (
//                                                 <tr key={m.key} className="hover:bg-gray-50 transition-colors">

//                                                     {/* # */}
//                                                     <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>

//                                                     {/* Type */}
//                                                     <td className="px-5 py-3 whitespace-nowrap">
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-base">{m.icon}</span>
//                                                             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                                                 {m.label}
//                                                             </span>
//                                                         </div>
//                                                     </td>

//                                                     {/* Details */}
//                                                     <td className="px-5 py-3 text-gray-700 max-w-xs">
//                                                         {editId === plan._id ? (
//                                                             m.key === "workout" ? (
//                                                                 <textarea rows={2}
//                                                                     value={editForm.workout}
//                                                                     onChange={e => setEditForm({ ...editForm, workout: e.target.value })}
//                                                                     className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 resize-none" />
//                                                             ) : (
//                                                                 <input type="text"
//                                                                     value={editForm[m.key]}
//                                                                     onChange={e => setEditForm({ ...editForm, [m.key]: e.target.value })}
//                                                                     className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500" />
//                                                             )
//                                                         ) : (
//                                                             plan[m.key] || <span className="text-gray-300">—</span>
//                                                         )}
//                                                     </td>

//                                                     {/* Grams */}
//                                                     <td className="px-5 py-3">
//                                                         {m.gramKey === null ? (
//                                                             <span className="text-gray-300">—</span>
//                                                         ) : editId === plan._id ? (
//                                                             <div className="relative w-24">
//                                                                 <input type="number"
//                                                                     placeholder="0"
//                                                                     value={editForm[m.gramKey]}
//                                                                     onChange={e => setEditForm({ ...editForm, [m.gramKey]: e.target.value })}
//                                                                     className="w-full pl-3 pr-7 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500" />
//                                                                 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
//                                                             </div>
//                                                         ) : (
//                                                             plan[m.gramKey]
//                                                                 ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
//                                                                     style={{ background: "#dbeafe", color: "#1d4ed8" }}>
//                                                                     {plan[m.gramKey]}g
//                                                                 </span>
//                                                                 : <span className="text-gray-300">—</span>
//                                                         )}
//                                                     </td>

//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Food;




import { useEffect, useState } from "react";
import API from "../../api/api";

const Food = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchPlans = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await API.get("/workout-diet/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlans(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    const startEdit = (plan) => { setEditId(plan._id); setEditForm(plan); };
    const cancelEdit = () => setEditId(null);

    const saveEdit = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            await API.put(`/workout-diet/update/${id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditId(null);
            fetchPlans();
        } catch (err) { console.error(err); }
    };

    const deletePlan = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            await API.delete(`/workout-diet/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPlans();
        } catch (err) { console.error(err); }
    };

    const grouped = plans.reduce((acc, plan) => {
        (acc[plan.fitnessGoal] = acc[plan.fitnessGoal] || []).push(plan);
        return acc;
    }, {});

    if (loading) return (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
            Loading plans...
        </div>
    );

    return (
        <div className="p-6 space-y-10">

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Plans", value: plans.length },
                    { label: "Fitness Goals", value: Object.keys(grouped).length },
                    { label: "Max Days", value: plans.length ? Math.max(...plans.map(p => p.order)) : 0 },
                ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-2xl font-semibold text-gray-800">{s.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Tables per Goal */}
            {Object.entries(grouped).map(([goal, rows]) => (
                <div key={goal}>

                    {/* Goal Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-base">
                            🏋️
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">{goal}</h3>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {rows.length} day{rows.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    {["Day", "Workout", "Breakfast", "Lunch", "Snack", "Dinner", "Actions"].map(h => (
                                        <th key={h} className="px-4 py-3 font-medium whitespace-nowrap border-b border-gray-200">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {rows.map(plan => (
                                    <tr key={plan._id} className="hover:bg-gray-50 transition-colors">

                                        {/* Day */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Day {plan.order}
                                            </span>
                                        </td>

                                        {editId === plan._id ? (
                                            <>
                                                {["workout", "breakfast", "lunch", "snack", "dinner"].map(field => (
                                                    <td key={field} className="px-4 py-3">
                                                        <input
                                                            value={editForm[field] || ""}
                                                            onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                                                            className="w-full min-w-[110px] text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
                                                        />
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => saveEdit(plan._id)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 font-medium text-indigo-700">{plan.workout}</td>
                                                <td className="px-4 py-3 text-gray-700">{plan.breakfast}</td>
                                                <td className="px-4 py-3 text-gray-700">{plan.lunch}</td>
                                                <td className="px-4 py-3 text-gray-700">{plan.snack}</td>
                                                <td className="px-4 py-3 text-gray-700">{plan.dinner}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEdit(plan)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deletePlan(plan._id)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Food;