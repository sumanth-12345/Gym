
// // PaymentList.jsx
// import { useEffect, useState } from "react";
// import API from "../../api/api";
// import ActionModal from "../../component/ActionModal";

// const statusConfig = {
//     Completed: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
//     Partial: { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
//     Pending: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
// };

// const PaymentList = () => {
//     const [payments, setPayments] = useState([]);
//     const [filter, setFilter] = useState("All");
//     const [month, setMonth] = useState("All");
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState(null);

//     const fetchPayments = async () => {
//         try {
//             const token = sessionStorage.getItem("token");
//             const res = await API.get("/owner/payments/all", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPayments(res.data || []);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchPayments(); }, []);

//     const handleComplete = (id) => setModal({ type: "pay", paymentId: id });

//     const filteredPayments = payments.filter((p) => {
//         const matchStatus = filter === "All" || p.status === filter;
//         const matchMonth = month === "All" || new Date(p.date).getMonth() === Number(month);
//         const matchSearch = p.memberId?.name?.toLowerCase().includes(search.toLowerCase());
//         return matchStatus && matchMonth && matchSearch;
//     });

//     const total = payments.length;
//     const completed = payments.filter(p => p.status === "Completed").length;
//     const pending = payments.filter(p => p.status === "Pending").length;
//     const partial = payments.filter(p => p.status === "Partial").length;
//     const totalDue = payments.reduce((s, p) => s + (p.amount - (p.paidAmount || 0)), 0);
//     const totalCollected = payments.reduce((s, p) => s + (p.paidAmount || 0), 0);

//     if (loading) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="flex flex-col items-center gap-3">
//                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                 <p className="text-sm text-gray-400">Loading payments…</p>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-6xl mx-auto space-y-5">

//                 {/* ── Header — centered ── */}
//                 <div className="text-center py-2">
//                     <h1 className="text-xl font-bold text-gray-900">Payments</h1>
//                     {/* <p className="text-sm text-gray-400 mt-0.5">{total} records total</p> */}
//                 </div>

//                 {/* ── Summary cards ── */}
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                     {[
//                         { label: "Completed", value: completed, color: "#15803d", bg: "#dcfce7" },
//                         { label: "Partial", value: partial, color: "#854d0e", bg: "#fef9c3" },
//                         { label: "Pending", value: pending, color: "#991b1b", bg: "#fee2e2" },
//                         { label: "Total Collected", value: `₹${totalCollected.toLocaleString()}`, color: "#15803d", bg: "#dcfce7" },
//                         { label: "Total Due", value: `₹${totalDue.toLocaleString()}`, color: "#1d4ed8", bg: "#dbeafe" },
//                         { label: "Total Records", value: total, color: "#374151", bg: "#f3f4f6" },
//                     ].map(c => (
//                         <div key={c.label} className="rounded-xl p-4 text-center" style={{ background: c.bg }}>
//                             <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.label}</p>
//                             <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Filters ── */}
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//                     <div className="flex flex-wrap gap-3 items-center">
//                         <div className="flex gap-2 flex-wrap">
//                             {["All", "Pending", "Partial", "Completed"].map(f => (
//                                 <button key={f} onClick={() => setFilter(f)}
//                                     className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
//                                     style={filter === f
//                                         ? { background: "#2563eb", color: "#fff" }
//                                         : { background: "#f3f4f6", color: "#6b7280" }}>
//                                     {f}
//                                 </button>
//                             ))}
//                         </div>
//                         <div className="flex-1" />
//                         <select value={month} onChange={e => setMonth(e.target.value)}
//                             className="border border-gray-200 text-sm rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:border-blue-400">
//                             <option value="All">All Months</option>
//                             {[...Array(12)].map((_, i) => (
//                                 <option key={i} value={i}>
//                                     {new Date(0, i).toLocaleString("default", { month: "long" })}
//                                 </option>
//                             ))}
//                         </select>
//                         <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
//                             <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//                                 stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
//                                 <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//                             </svg>
//                             <input type="text" placeholder="Search name…" value={search}
//                                 onChange={e => setSearch(e.target.value)}
//                                 className="text-sm outline-none w-32 text-gray-700 placeholder-gray-400" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Table ── */}
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="border-b border-gray-100">
//                                     {["#", "Member", "phone", "Amount", "Paid", "Due", "Date", "Status", ""].map(h => (
//                                         <th key={h}
//                                             className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
//                                             {h}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-50">
//                                 {filteredPayments.length > 0 ? filteredPayments.map((p, i) => {
//                                     const sc = statusConfig[p.status] || {};
//                                     const due = p.amount - (p.paidAmount || 0);
//                                     return (
//                                         <tr key={p._id} className="hover:bg-gray-50 transition-colors">
//                                             <td className="px-4 py-3 text-center text-gray-400 text-xs">{i + 1}</td>
//                                             <td className="px-4 py-3">
//                                                 <div className="flex items-center gap-2 justify-center">
//                                                     <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
//                                                         {p.memberId?.name?.slice(0, 2).toUpperCase() || "NA"}
//                                                     </div>
//                                                     <span className="font-medium text-gray-800 whitespace-nowrap">
//                                                         {p.memberId?.name || "N/A"}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-3 text-center font-semibold text-gray-800">{p.memberId.phone}</td>
//                                             <td className="px-4 py-3 text-center font-semibold text-gray-800">₹{p.amount}</td>
//                                             <td className="px-4 py-3 text-center text-green-600 font-medium">₹{p.paidAmount || 0}</td>
//                                             <td className="px-4 py-3 text-center">
//                                                 <span className={`font-medium ${due > 0 ? "text-red-500" : "text-gray-400"}`}>
//                                                     ₹{due}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-3 text-center text-gray-500 whitespace-nowrap">
//                                                 {new Date(p.date).toLocaleDateString("en-IN", {
//                                                     day: "2-digit", month: "short", year: "numeric"
//                                                 })}
//                                             </td>
//                                             <td className="px-4 py-3 text-center">
//                                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
//                                                     style={{ background: sc.bg, color: sc.color }}>
//                                                     <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
//                                                     {p.status}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-3 text-center">
//                                                 {p.status !== "Completed" && (
//                                                     <button onClick={() => handleComplete(p._id)}
//                                                         className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-80"
//                                                         style={{ background: "#2563eb" }}>
//                                                         Pay
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 }) : (
//                                     <tr>
//                                         <td colSpan="8" className="py-16 text-center">
//                                             <div className="text-3xl mb-2">💳</div>
//                                             <p className="text-gray-400 text-sm">No payments found</p>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//             </div>
//             <ActionModal modal={modal} setModal={setModal} refresh={fetchPayments} />
//         </div>
//     );
// };


// export default PaymentList;


// import { useEffect, useState } from "react";
// import API from "../../api/api";
// import ActionModal from "../../component/ActionModal";

// const statusConfig = {
//     Completed: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
//     Partial: { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
//     Pending: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
// };

// const PaymentList = () => {
//     const [payments, setPayments] = useState([]);
//     const [summary, setSummary] = useState({});
//     const [filter, setFilter] = useState("All");
//     const [month, setMonth] = useState("All");
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState(null);

//     const fetchPayments = async () => {
//         try {
//             const token = sessionStorage.getItem("token");

//             const res = await API.get("/owner/payments/all", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             // ✅ FIXED: correct backend structure usage
//             setPayments(res.data.payments || []);
//             setSummary(res.data.summary || {});
//         } catch (err) {
//             console.error(err);
//             setPayments([]);
//             setSummary({});
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPayments();
//     }, []);

//     const handleComplete = (id) => {
//         setModal({ type: "pay", paymentId: id });
//     };

//     // ✅ ONLY FILTERING (NO CALCULATION)
//     const safePayments = Array.isArray(payments) ? payments : [];

//     const filteredPayments = safePayments.filter((p) => {
//         const matchStatus = filter === "All" || p.status === filter;

//         const matchMonth =
//             month === "All" ||
//             new Date(p.date).getMonth() === Number(month);

//         const matchSearch =
//             p.memberId?.name
//                 ?.toLowerCase()
//                 .includes(search.toLowerCase());

//         return matchStatus && matchMonth && matchSearch;
//     });

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center gap-3">
//                     <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                     <p className="text-sm text-gray-400">Loading payments…</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-6xl mx-auto space-y-5">

//                 {/* Header */}
//                 <div className="text-center py-2">
//                     <h1 className="text-xl font-bold text-gray-900">Payments</h1>
//                 </div>

//                 {/* Summary (ONLY BACKEND) */}
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                     {[
//                         { label: "Completed", value: summary.completed || 0, color: "#15803d", bg: "#dcfce7" },
//                         { label: "Partial", value: summary.partial || 0, color: "#854d0e", bg: "#fef9c3" },
//                         { label: "Pending", value: summary.pending || 0, color: "#991b1b", bg: "#fee2e2" },
//                         { label: "Total Collected", value: `₹${summary.totalCollected || 0}`, color: "#15803d", bg: "#dcfce7" },
//                         { label: "Total Due", value: `₹${summary.totalDue || 0}`, color: "#1d4ed8", bg: "#dbeafe" },
//                         { label: "Total Records", value: summary.totalRecords || 0, color: "#374151", bg: "#f3f4f6" },
//                     ].map((c) => (
//                         <div
//                             key={c.label}
//                             className="rounded-xl p-4 text-center"
//                             style={{ background: c.bg }}
//                         >
//                             <p className="text-xs font-medium mb-1" style={{ color: c.color }}>
//                                 {c.label}
//                             </p>
//                             <p className="text-xl font-bold" style={{ color: c.color }}>
//                                 {c.value}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Filters */}
//                 <div className="flex gap-2 mb-4">
//                     {["All", "Pending", "Partial", "Completed"].map((f) => (
//                         <button
//                             key={f}
//                             onClick={() => setFilter(f)}
//                             className="px-3 py-1 bg-gray-200 rounded"
//                         >
//                             {f}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Table */}
//                 <div className="bg-white p-3 rounded">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr>
//                                 <th>Member</th>
//                                 <th>Amount</th>
//                                 <th>Paid</th>
//                                 <th>Due</th>
//                                 <th>Status</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {filteredPayments.map((p) => {
//                                 const sc = statusConfig[p.status] || {};
//                                 const due = (p.amount || 0) - (p.paidAmount || 0);

//                                 return (
//                                     <tr key={p._id}>
//                                         <td>{p.memberId?.name}</td>
//                                         <td>₹{p.amount}</td>
//                                         <td>₹{p.paidAmount || 0}</td>

//                                         {/* still derived display only (safe UI) */}
//                                         <td>₹{due}</td>

//                                         <td>{p.status}</td>

//                                         <td>
//                                             {p.status !== "Completed" && (
//                                                 <button onClick={() => handleComplete(p._id)}>
//                                                     Pay
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>

//             </div>

//             <ActionModal
//                 modal={modal}
//                 setModal={setModal}
//                 refresh={fetchPayments}
//             />
//         </div>
//     );
// };

// export default PaymentList;

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
                                    {["#", "Member", "Amount", "Paid", "Due", "Status", "Action"].map((h) => (
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

                                                {/* Status */}
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${sc.badge}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${sc.dot}`} />
                                                        {p.status}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className="px-5 py-4">
                                                    {p.status !== "Completed" ? (
                                                        <button
                                                            onClick={() => handleComplete(p._id)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-400/60 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap"
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