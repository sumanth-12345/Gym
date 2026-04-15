// Reports.jsx
import { useEffect, useState } from "react";
import API from "../../api/api";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Reports = () => {
    const [revenue, setRevenue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterMonth, setFilterMonth] = useState("All");
    const [filterYear, setFilterYear] = useState("All");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const rev = await API.get("/owner/reports/revenue", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRevenue(rev.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const years = [...new Set(revenue.map(r => r._id.year))].sort((a, b) => b - a);

    const filtered = revenue.filter(r => {
        const matchMonth = filterMonth === "All" || r._id.month === Number(filterMonth);
        const matchYear = filterYear === "All" || r._id.year === Number(filterYear);
        return matchMonth && matchYear;
    });

    const totalRevenue = filtered.reduce((s, r) => s + r.totalAmount, 0);
    const totalCompleted = filtered.reduce((s, r) => s + r.completed, 0);
    const totalPending = filtered.reduce((s, r) => s + r.pending, 0);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading reports…</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto space-y-5">

                {/* ── Header ── */}
                <div className="text-center py-2">
                    <h1 className="text-xl font-bold text-gray-900">Reports</h1>
                    <p className="text-sm text-gray-400 mt-1">Monthly revenue overview</p>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, bg: "#dbeafe", color: "#1d4ed8" },
                        { label: "Completed", value: totalCompleted, bg: "#dcfce7", color: "#15803d" },
                        { label: "Pending", value: totalPending, bg: "#fee2e2", color: "#991b1b" },
                    ].map(c => (
                        <div key={c.label} className="rounded-xl p-4 text-center" style={{ background: c.bg }}>
                            <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.label}</p>
                            <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter</span>

                        {/* Month pills */}
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setFilterMonth("All")}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                style={filterMonth === "All"
                                    ? { background: "#2563eb", color: "#fff" }
                                    : { background: "#f3f4f6", color: "#6b7280" }}>
                                All
                            </button>
                            {MONTHS.map((m, i) => (
                                <button key={m} onClick={() => setFilterMonth(String(i + 1))}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={filterMonth === String(i + 1)
                                        ? { background: "#2563eb", color: "#fff" }
                                        : { background: "#f3f4f6", color: "#6b7280" }}>
                                    {m}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1" />

                        {/* Year select */}
                        {years.length > 0 && (
                            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                                className="border border-gray-200 text-sm rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:border-blue-400">
                                <option value="All">All Years</option>
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                        <span>📊</span>
                        <span className="text-sm font-semibold text-gray-700">Monthly Revenue</span>
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-blue-500">
                            {filtered.length}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {["#", "Month", "Year", "Total Revenue", "Completed", "Pending"].map(h => (
                                        <th key={h}
                                            className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length > 0 ? filtered.map((r, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-center text-gray-400 text-xs">{i + 1}</td>
                                        <td className="px-5 py-3.5 text-center font-medium text-gray-800">
                                            {MONTHS[r._id.month - 1]}
                                        </td>
                                        <td className="px-5 py-3.5 text-center text-gray-600">{r._id.year}</td>
                                        <td className="px-5 py-3.5 text-center font-bold text-blue-600">
                                            ₹{r.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                                                style={{ background: "#dcfce7", color: "#15803d" }}>
                                                {r.completed}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                                                style={{ background: "#fef9c3", color: "#854d0e" }}>
                                                {r.pending}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-14 text-center">
                                            <div className="text-3xl mb-2">📭</div>
                                            <p className="text-gray-400 text-sm">No revenue data found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Reports;