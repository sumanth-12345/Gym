import { useEffect, useState } from "react";
import API from "../../api/api";
import ActionModal from "../../component/ActionModal";

const statusConfig = {
    Completed: {
        badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
        dot: "bg-emerald-400",
    },
    Partial: {
        badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
        dot: "bg-yellow-400",
    },
    Pending: {
        badge: "bg-red-500/10 text-red-400 border border-red-500/30",
        dot: "bg-red-400",
    },
};

const filterColors = {
    All: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
    Pending: "text-red-400    border-red-500/40    bg-red-500/10",
    Partial: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
    Completed: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
};

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState({});
    const [filter, setFilter] = useState("All");
    const [month, setMonth] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);

    const fetchPayments = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await API.get("/owner/payments/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPayments(res.data.payments || []);
            setSummary(res.data.summary || {});
        } catch (err) {
            console.error(err);
            setPayments([]);
            setSummary({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPayments(); }, []);

    const handleComplete = (id) => setModal({ type: "pay", paymentId: id });

    const safePayments = Array.isArray(payments) ? payments : [];

    const filteredPayments = safePayments.filter((p) => {
        const matchStatus =
            filter === "All" ||
            p.status?.toUpperCase() === filter.toUpperCase();
        const matchMonth = month === "All" || new Date(p.date).getMonth() === Number(month);
        const matchSearch = p.memberId?.name?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchMonth && matchSearch;
    });

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
                <div className="w-9 h-9 border-[3px] border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading payments…</p>
            </div>
        );
    }

    const cards = [
        { label: "Completed", value: summary.completed || 0, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: "✓" },
        { label: "Partial", value: summary.partial || 0, color: "text-yellow-400", bg: "bg-yellow-500/10  border-yellow-500/20", icon: "◑" },
        { label: "Pending", value: summary.pending || 0, color: "text-red-400", bg: "bg-red-500/10     border-red-500/20", icon: "!" },
        { label: "Total Collected", value: `₹${(summary.totalCollected || 0).toLocaleString()}`, color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20", icon: "↑" },
        { label: "Total Due", value: `₹${(summary.totalDue || 0).toLocaleString()}`, color: "text-blue-400", bg: "bg-blue-500/10    border-blue-500/20", icon: "↓" },
        { label: "Total Records", value: summary.totalRecords || 0, color: "text-violet-400", bg: "bg-violet-500/10  border-violet-500/20", icon: "#" },
    ];

    return (
        <div className="min-h-screen bg-white-950 px-4 py-6 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between border-b border-white/5 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
                            ₹
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Payments</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Track and manage member dues</p>
                        </div>
                    </div>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5">
                        {filteredPayments.length} records
                    </span>
                </div>

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {cards.map((c) => (
                        <div
                            key={c.label}
                            className={`rounded-2xl border p-4 text-center transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-default ${c.bg}`}
                        >
                            <span className="text-xl block mb-1">{c.icon}</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                {c.label}
                            </p>
                            <p className={`text-lg font-bold font-mono leading-none ${c.color}`}>
                                {c.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Controls ── */}
                <div className="flex flex-wrap gap-3 items-center">

                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none select-none">
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="Search member…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200 text-sm placeholder-gray-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
                        {["All", "Pending", "Partial", "Completed"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f
                                    ? `border ${filterColors[f]}`
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] border border-transparent"
                                    }`}
                            >
                                {f !== "All" && (
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${filter === f ? statusConfig[f]?.dot : "bg-gray-600"
                                            }`}
                                    />
                                )}
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Month */}
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-gray-400 outline-none focus:border-indigo-500/50 transition cursor-pointer"
                    >
                        <option value="All">All Months</option>
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                            (m, i) => <option key={i} value={i}>{m}</option>
                        )}
                    </select>
                </div>

                {/* ── Table ── */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                                    {["#", "Member", "phone", "Amount", "Paid", "Due", "Date", "Status", "Action"].map((h) => (
                                        <th
                                            key={h}
                                            className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center">
                                            <span className="text-4xl block mb-3">📭</span>
                                            <p className="text-gray-600 text-sm">No payments found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((p, idx) => {

                                        const sc = statusConfig[p.status] || {};
                                        const due = (p.amount || 0) - (p.paidAmount || 0);

                                        return (
                                            <tr
                                                key={p._id}
                                                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors"
                                            >
                                                {/* Index */}
                                                <td className="px-5 py-4 text-xs font-mono text-gray-600 w-8">
                                                    {idx + 1}
                                                </td>

                                                {/* Member */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-indigo-500/20">
                                                            {p.memberId?.name?.[0]?.toUpperCase() || "?"}
                                                        </div>
                                                        <span className="font-medium text-slate-200 whitespace-nowrap">
                                                            {p.memberId?.name || "—"}
                                                        </span>
                                                    </div>
                                                </td>
                                                {/* {phone} */}
                                                <td className="px-5 py-3 text-center text-gray-500 whitespace-nowrap">
                                                    {p.memberId?.phone}</td>

                                                {/* Amount */}
                                                <td className="px-5 py-4 font-mono text-gray-400 whitespace-nowrap">
                                                    ₹{(p.amount || 0).toLocaleString()}
                                                </td>

                                                {/* Paid */}
                                                <td className="px-5 py-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                                                    ₹{(p.paidAmount || 0).toLocaleString()}
                                                </td>

                                                {/* Due */}
                                                <td className={`px-5 py-4 font-mono font-bold whitespace-nowrap ${due > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                                    ₹{due.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-500 whitespace-nowrap">
                                                    {new Date(p.date).toLocaleDateString("en-IN", {
                                                        day: "2-digit", month: "short", year: "numeric"
                                                    })}
                                                </td>
                                                {/* Status */}
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${sc.badge}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${sc.dot}`} />
                                                        {p.status}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className="px-5 py-4">
                                                    {Number(p.paidAmount) < Number(p.amount) ? (
                                                        <button
                                                            onClick={() => handleComplete(p._id)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Pay Now
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-mono font-semibold text-emerald-400">
                                                            ✓ Done
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <ActionModal modal={modal} setModal={setModal} refresh={fetchPayments} />
        </div>
    );
};

export default PaymentList;