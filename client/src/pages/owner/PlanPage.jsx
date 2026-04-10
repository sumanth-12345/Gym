// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/api";

// const PlanPage = () => {
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const fetchPlans = async () => {
//         try {
//             const token = sessionStorage.getItem("token");

//             const res = await API.get("/owner/plan/all", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setPlans(res.data);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPlans();
//     }, []);

//     const handleDelete = async (id) => {
//         try {
//             const token = sessionStorage.getItem("token");

//             await API.delete(`/owner/plan/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setPlans((prev) => prev.filter((p) => p._id !== id));
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     if (loading) return <p>Loading...</p>;

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-5xl mx-auto">

//                 <div className="flex items-center justify-between mb-6">
//                     <div>
//                         <h1 className="text-2xl font-semibold text-gray-800">Plans</h1>
//                         <p className="text-sm text-gray-500 mt-1">{plans.length} plans available</p>
//                     </div>
//                     <button onClick={() => navigate("/owner/addplan")}
//                         className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
//                         + Add Plan
//                     </button>
//                 </div>

//                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="bg-gray-50 border-b border-gray-100">
//                                 {["Fitness Goal", "Duration", "Price", "Action"].map((h) => (
//                                     <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {plans.map((p) => (
//                                 <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                                     {/* <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{p.plan}</td> */}
//                                     <td className="px-5 py-3.5 text-sm text-gray-600">{p.fitnessplan}</td>
//                                     <td className="px-5 py-3.5 text-sm text-gray-600">{p.duration} months</td>
//                                     <td className="px-5 py-3.5 text-sm font-semibold text-blue-600">₹{p.price}</td>
//                                     <td className="px-5 py-3.5">
//                                         <button onClick={() => handleDelete(p._id)}
//                                             className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition">
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PlanPage;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const PlanPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    const fetchPlans = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await API.get("/owner/plan/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlans(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    const handleDelete = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            await API.delete(`/owner/plan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlans(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading plans…</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto space-y-5">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Plans</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{plans.length} plans available</p>
                    </div>
                    <button onClick={() => navigate("/owner/addplan")}
                        className="px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-opacity hover:opacity-80"
                        style={{ background: "#2563eb" }}>
                        + Add Plan
                    </button>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        {
                            label: "Total Plans",
                            value: plans.length,
                            bg: "#dbeafe", color: "#1d4ed8"
                        },
                        {
                            label: "With Trainer",
                            value: plans.filter(p => p.hasTrainer === "Yes").length,
                            bg: "#dcfce7", color: "#15803d"
                        },
                        {
                            label: "Without Trainer",
                            value: plans.filter(p => p.hasTrainer === "No").length,
                            bg: "#f3f4f6", color: "#374151"
                        },
                        {
                            label: "Total Price",
                            value: plans.length
                                ? `₹${Math.round(plans.reduce((s, p) => s + p.price + p.trainerFee, 0))}`
                                : "₹0",
                            bg: "#fef9c3", color: "#854d0e"
                        },
                    ].map(c => (
                        <div key={c.label} className="rounded-xl p-4" style={{ background: c.bg }}>
                            <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.label}</p>
                            <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {plans.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="text-gray-400 text-sm">No plans yet</p>
                            <button onClick={() => navigate("/owner/addplan")}
                                className="mt-4 px-4 py-2 text-white text-sm rounded-xl"
                                style={{ background: "#2563eb" }}>
                                + Add First Plan
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {["#", "Fitness Goal", "Duration", "Plan Price", "Trainer", "Trainer Fee", "Total", ""].map(h => (
                                            <th key={h}
                                                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {plans.map((p, i) => {
                                        const total = p.hasTrainer === "Yes"
                                            ? p.price + (p.trainerFee || 0)
                                            : p.price;

                                        return (
                                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">

                                                <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>

                                                {/* Fitness goal */}
                                                <td className="px-4 py-3">
                                                    <span className="font-medium text-gray-800 whitespace-nowrap">
                                                        {p.fitnessplan}
                                                    </span>
                                                </td>

                                                {/* Duration */}
                                                <td className="px-4 py-3">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                                        style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                                                        {p.duration} {p.duration === 1 ? "Month" : "Months"}
                                                    </span>
                                                </td>

                                                {/* Plan price */}
                                                <td className="px-4 py-3 font-semibold text-gray-800">
                                                    ₹{p.price}
                                                </td>

                                                {/* Trainer badge */}
                                                <td className="px-4 py-3">
                                                    {p.hasTrainer === "Yes" ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                                                            style={{ background: "#dcfce7", color: "#15803d" }}>
                                                            ✅ Yes
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                                                            style={{ background: "#f3f4f6", color: "#6b7280" }}>
                                                            ❌ No
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Trainer fee */}
                                                <td className="px-4 py-3">
                                                    {p.hasTrainer === "Yes"
                                                        ? <span className="text-purple-600 font-medium">₹{p.trainerFee || 0}</span>
                                                        : <span className="text-gray-300">—</span>
                                                    }
                                                </td>

                                                {/* Total */}
                                                <td className="px-4 py-3">
                                                    <span className="font-bold text-blue-600">₹{total}</span>
                                                </td>

                                                {/* Delete */}
                                                <td className="px-4 py-3">
                                                    {deleteId === p._id ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() => handleDelete(p._id)}
                                                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
                                                                style={{ background: "#ef4444" }}>
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteId(null)}
                                                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteId(p._id)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
                                                            style={{ background: "#ef4444" }}>
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PlanPage;