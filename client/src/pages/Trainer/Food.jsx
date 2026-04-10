



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