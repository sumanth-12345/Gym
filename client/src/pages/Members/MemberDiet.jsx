// import { useEffect, useState } from "react";
// import API from "../../api/api";

// const MemberDiet = () => {
//     const [plan, setPlan] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const fetchDiet = async () => {
//         try {
//             const token = sessionStorage.getItem("token");

//             const res = await API.get("/workout-diet/member-diet", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             setPlan(res.data);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchDiet();
//     }, []);

//     if (loading) return <p>Loading...</p>;
//     if (!plan) return <p>No Diet for your goal</p>;

//     return (
//         <div className="min-h-screen bg-gray-50 p-4">
//             <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

//                 <h1 className="text-xl font-bold mb-4">
//                     {plan.fitnessGoal}
//                 </h1>

//                 <p><b>Workout:</b> {plan.workout}</p>
//                 <p><b>Breakfast:</b> {plan.breakfast}</p>
//                 <p><b>Lunch:</b> {plan.lunch}</p>
//                 <p><b>Snack:</b> {plan.snack}</p>
//                 <p><b>Dinner:</b> {plan.dinner}</p>

//             </div>
//         </div>
//     );
// };

// export default MemberDiet;

// MemberDiet.jsx
// import { useEffect, useState } from "react";
// import API from "../../api/api";

// const GOAL_ICON = {
//     "Weight Loss": "🔥",
//     "Muscle Gain": "💪",
//     "General Fitness": "🏃",
//     "Fat Burn": "⚡",
//     "Strength": "🏋️",
// };

// const MemberDiet = () => {





//     const [plan, setPlan] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchDiet = async () => {
//             try {
//                 const token = sessionStorage.getItem("token");
//                 const res = await API.get("/workout-diet/member-diet", {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setPlan(res.data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchDiet();
//     }, []);

//     if (loading) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="flex flex-col items-center gap-3">
//                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                 <p className="text-sm text-gray-400">Loading your plan…</p>
//             </div>
//         </div>
//     );

//     if (!plan) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="text-center">
//                 <div className="text-5xl mb-4">🥗</div>
//                 <h2 className="text-lg font-bold text-gray-700 mb-1">No Diet Plan Found</h2>
//                 <p className="text-sm text-gray-400">Your trainer hasn't assigned a plan yet</p>
//             </div>
//         </div>
//     );

//     const rows = [
//         { icon: "🏋️", label: "Workout", value: plan.workout },
//         { icon: "🌅", label: "Breakfast", value: plan.breakfast },
//         { icon: "☀️", label: "Lunch", value: plan.lunch },
//         { icon: "🍎", label: "Snack", value: plan.snack },
//         { icon: "🌙", label: "Dinner", value: plan.dinner },
//     ];

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-2xl mx-auto space-y-5">

//                 {/* ── Header ── */}
//                 <div className="text-center py-2">
//                     <h1 className="text-xl font-bold text-gray-900">My Diet & Workout</h1>
//                     <p className="text-sm text-gray-400 mt-1">Your personalised fitness plan</p>
//                 </div>

//                 {/* ── Goal banner ── */}
//                 <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl">
//                     <span className="text-3xl">{GOAL_ICON[plan.fitnessGoal] || "🎯"}</span>
//                     <div>
//                         <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Fitness Goal</p>
//                         <p className="text-base font-bold text-blue-700 mt-0.5">{plan.fitnessGoal}</p>
//                     </div>
//                 </div>

//                 {/* ── Table ── */}
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
//                         <span>📋</span>
//                         <h2 className="text-sm font-semibold text-gray-700">Plan Details</h2>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="border-b border-gray-100">
//                                     {["#", "Type", "Details"].map(h => (
//                                         <th key={h}
//                                             className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
//                                             {h}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-50">
//                                 {rows.map((r, i) => (
//                                     <tr key={r.label} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
//                                         <td className="px-5 py-3.5 whitespace-nowrap">
//                                             <div className="flex items-center gap-2">
//                                                 <span className="text-base">{r.icon}</span>
//                                                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                                     {r.label}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                         <td className="px-5 py-3.5 text-gray-700">
//                                             {r.value || <span className="text-gray-300">—</span>}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default MemberDiet;



// import { useEffect, useState } from "react";
// import API from "../../api/api";

// const MemberDiet = () => {
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchPlans = async () => {
//             try {
//                 const token = sessionStorage.getItem("token");
//                 const res = await API.get("/workout-diet/member-diet", {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 setPlans(res.data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPlans();
//     }, []);

//     if (loading) return <p>Loading...</p>;

//     if (plans.length === 0) return <p>No plans found</p>;

//     return (
//         <div>
//             <h2>My Workout & Diet Plan</h2>

//             {plans.map((plan) => (
//                 <div key={plan._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
//                     <h2>{plan.fitnessGoal}</h2>
//                     <h3>Day {plan.order}</h3>

//                     <p>Workout: {plan.workout}</p>
//                     <p>Breakfast: {plan.breakfast}</p>
//                     <p>Lunch: {plan.lunch}</p>
//                     <p>Snack: {plan.snack}</p>
//                     <p>Dinner: {plan.dinner}</p>

//                 </div>
//             ))}
//         </div>
//     );
// };

// export default MemberDiet;


import { useEffect, useState } from "react";
import API from "../../api/api";

const MemberDiet = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const res = await API.get("/workout-diet/member-diet", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlans(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return <p style={{ padding: "1.5rem", color: "#888" }}>Loading...</p>;
    if (plans.length === 0) return <p style={{ padding: "1.5rem", color: "#888" }}>No diet plans found.</p>;

    return (
        <div style={{ padding: "1.5rem 1rem" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 500, margin: 0, color: "#111" }}>
                    My Workout & Diet Plan
                </h2>
                <span style={{
                    fontSize: "12px", fontWeight: 500, padding: "3px 10px",
                    borderRadius: "20px", background: "#E1F5EE", color: "#0F6E56"
                }}>
                    {plans.length} Days
                </span>
            </div>

            {/* Table */}
            <div style={{
                borderRadius: "12px",
                border: "0.5px solid #e0e0e0",
                overflow: "hidden"
            }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                        <thead>
                            <tr style={{ background: "#E1F5EE" }}>
                                {["Day", "Workout", "Breakfast", "Lunch", "Snack", "Dinner"].map((col) => (
                                    <th key={col} style={{
                                        padding: "13px 16px",
                                        textAlign: "left",
                                        fontWeight: 500,
                                        fontSize: "12px",
                                        color: "#0F6E56",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                        borderBottom: "1px solid #9FE1CB",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan, i) => (
                                <tr key={plan._id} style={{
                                    borderBottom: i < plans.length - 1 ? "0.5px solid #eee" : "none",
                                    transition: "background 0.15s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f7f7f5"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "14px 16px", borderRight: "0.5px solid #eee" }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center",
                                            background: "#E1F5EE", color: "#0F6E56",
                                            fontSize: "12px", fontWeight: 500,
                                            padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap"
                                        }}>
                                            Day {plan.order}
                                        </span>
                                    </td>
                                    {[plan.workout, plan.breakfast, plan.lunch, plan.snack, plan.dinner].map((val, j) => (
                                        <td key={j} style={{
                                            padding: "14px 16px",
                                            color: "#555",
                                            verticalAlign: "top",
                                            lineHeight: 1.5,
                                            borderRight: j < 4 ? "0.5px solid #eee" : "none"
                                        }}>
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MemberDiet;