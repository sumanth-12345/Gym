// import { useEffect, useState } from "react";
// import API from "../../api/api";

// const MemberPlans = () => {
//     const [plans, setPlans] = useState([]);
//     const [filteredPlans, setFilteredPlans] = useState([]);
//     const [search, setSearch] = useState("");
//     const [selectedPlan, setSelectedPlan] = useState(null);

//     // Fetch owner-specific plans
//     useEffect(() => {
//         const fetchPlans = async () => {
//             try {
//                 const res = await API.get("/member/plan/details"); // backend returns only owner's plans
//                 console.log(res.data)
//                 setPlans(res.data);
//                 setFilteredPlans(res.data);
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         fetchPlans();
//     }, []);

//     // Filter plans by search
//     useEffect(() => {
//         const filtered = plans.filter((plan) =>
//             plan.plan.toLowerCase().includes(search.toLowerCase())
//         );
//         setFilteredPlans(filtered);
//     }, [search, plans]);

//     const handleSelectPlan = (plan) => {
//         setSelectedPlan(plan);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-4xl mx-auto">

//                 {/* Page Header */}
//                 <div className="mb-6">
//                     <h1 className="text-2xl font-semibold text-gray-800">Choose Your Plan</h1>
//                     <p className="text-sm text-gray-500 mt-1">Select a plan that fits your goals</p>
//                 </div>

//                 {/* Search */}
//                 <div className="relative mb-6">
//                     <input
//                         type="text"
//                         placeholder="Search plans..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-full pl-4 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>

//                 {/* Plans Grid */}
//                 <div className="grid sm:grid-cols-2 gap-4 mb-6">
//                     {filteredPlans.map((plan) => (
//                         <div
//                             key={plan._id}
//                             onClick={() => handleSelectPlan(plan)}
//                             className={`bg-white rounded-xl border p-5 cursor-pointer transition-all duration-150
//                         ${selectedPlan?._id === plan._id
//                                     ? "border-blue-500 ring-2 ring-blue-100"
//                                     : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
//                         >
//                             <h3 className="text-base font-semibold text-gray-800 mb-3">{plan.plan}</h3>
//                             <div className="space-y-1.5 mb-4">
//                                 <p className="text-sm text-gray-500">
//                                     Duration: <span className="font-medium text-gray-700">{plan.duration}</span>
//                                 </p>
//                                 <p className="text-sm text-gray-500">
//                                     Price: <span className="font-semibold text-blue-600">₹{plan.price}</span>
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan); }}
//                                 className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
//                             >
//                                 Select Plan
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Selected Plan Summary */}
//                 {selectedPlan && (
//                     <div className="bg-white rounded-xl border-2 border-blue-500 p-5">
//                         <div className="flex items-center gap-2 mb-3">
//                             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
//                             <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Selected Plan</h2>
//                         </div>
//                         <div className="grid sm:grid-cols-3 gap-4">
//                             <div>
//                                 <p className="text-xs text-gray-400">Plan</p>
//                                 <p className="font-semibold text-gray-800 mt-0.5">{selectedPlan.plan}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Duration</p>
//                                 <p className="font-semibold text-gray-800 mt-0.5">{selectedPlan.duration}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Price</p>
//                                 <p className="font-semibold text-blue-600 mt-0.5">₹{selectedPlan.price}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
import { useEffect, useState } from "react";
import API from "../../api/api";

const MemberPlans = () => {
    const [plans, setPlans] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await API.get("/member/plan/details");
                setPlans(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const filteredPlans = selectedMonth
        ? plans.filter(p => parseInt(p.duration) === Number(selectedMonth))
        : plans;

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
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Fitness Plans</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {filteredPlans.length} plan{filteredPlans.length !== 1 ? "s" : ""} available
                    </p>
                </div>



                {/* ── Filter ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Filter by Duration
                    </span>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedMonth("")}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={!selectedMonth
                                ? { background: "#2563eb", color: "#fff" }
                                : { background: "#f3f4f6", color: "#6b7280" }}>
                            All
                        </button>
                        {[...Array(12)].map((_, i) => {
                            const m = i + 1;
                            const hasPlans = plans.some(p => parseInt(p.duration) === m);
                            if (!hasPlans) return null;
                            return (
                                <button key={m}
                                    onClick={() => setSelectedMonth(String(m))}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={selectedMonth === String(m)
                                        ? { background: "#2563eb", color: "#fff" }
                                        : { background: "#f3f4f6", color: "#6b7280" }}>
                                    {m}M
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {filteredPlans.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="text-gray-400 text-sm">No plans found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {["#", "Fitness Goal", "Duration", "Plan Price", "Trainer", "Trainer Fee", "Total"].map(h => (
                                            <th key={h}
                                                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredPlans.map((p, i) => {
                                        const duration = parseInt(p.duration);
                                        const total = p.hasTrainer === "Yes"
                                            ? p.price + (p.trainerFee || 0)
                                            : p.price;

                                        return (
                                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">

                                                <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>

                                                {/* Fitness goal */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base">
                                                            {p.fitnessplan?.includes("Weight Loss") ? "🔥"
                                                                : p.fitnessplan?.includes("Muscle") ? "💪"
                                                                    : p.fitnessplan?.includes("General") ? "🏃"
                                                                        : p.fitnessplan?.includes("Fat") ? "⚡"
                                                                            : p.fitnessplan?.includes("Strength") ? "🏋️"
                                                                                : "🎯"}
                                                        </span>
                                                        <span className="font-medium text-gray-800 whitespace-nowrap">
                                                            {p.fitnessplan || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Duration */}
                                                <td className="px-4 py-3">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                                        style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                                                        {duration} {duration === 1 ? "Month" : "Months"}
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

export default MemberPlans;