

// import { useEffect, useState } from "react";
// import API from "../../api/api";


// const PaymentList = () => {
//     const [payments, setPayments] = useState([]);
//     const [filter, setFilter] = useState("All");
//     const [month, setMonth] = useState("All");
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [payingId, setPayingId] = useState(null);

//     const fetchPayments = async () => {
//         try {
//             const token = sessionStorage.getItem("token");
//             const res = await API.get("/owner/payments/all", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPayments(res.data);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPayments();
//     }, []);

//     const handleComplete = async (id) => {
//         const payment = payments.find(p => p._id === id);
//         const due = Math.max(0, payment.amount - (payment.paidAmount || 0));
//         const amt = Number(prompt(`Enter amount (Max ₹${due})`));

//         if (!amt || amt <= 0) return alert("Invalid amount");

//         if (amt > due) {
//             return alert(`Max allowed: ₹${due}`);
//         }
//         // const amt = parseInt(prompt("Enter amount"));
//         // if (!amt || amt <= 0) {
//         //     return alert("Invalid amount");
//         // }

//         try {
//             setPayingId(id);
//             const token = sessionStorage.getItem("token");

//             const res = await API.patch(
//                 `/owner/payments/pay/${id}`,
//                 { payAmount: amt },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setPayments(prev =>
//                 prev.map(p =>
//                     p._id === id ? res.data.payment : p
//                 )
//             );

//         } catch (err) {
//             console.error(err.response?.data);
//         } finally {
//             setPayingId(null);
//         }
//     };

//     const filteredPayments = payments.filter(p => {
//         const paymentDate = new Date(p.date);
//         const paymentMonth = paymentDate.getMonth();

//         const matchStatus =
//             filter === "All" || p.status === filter;

//         const matchMonth =
//             month === "All" || paymentMonth === Number(month);

//         const matchSearch =
//             p.memberId?.name
//                 ?.toLowerCase()
//                 .includes(search.toLowerCase());

//         return matchStatus && matchMonth && matchSearch;
//     });

//     if (loading)
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-50">
//                 <div className="flex flex-col items-center gap-3">
//                     <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                     <p className="text-sm text-gray-400 font-medium">Loading payments...</p>
//                 </div>
//             </div>
//         );

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-6xl mx-auto">


//                 {/* HEADER */}
//                 <div className="mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
//                         All Payments
//                     </h1>
//                     <p className="text-sm text-gray-400 mt-1">{filteredPayments.length} records found</p>
//                 </div>

//                 {/* FILTERS */}
//                 <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">

//                     {/* STATUS */}
//                     {["All", "Pending", "Partial", "Completed"].map((f) => (
//                         <button
//                             key={f}
//                             onClick={() => setFilter(f)}
//                             className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150
//                             ${filter === f
//                                     ? "bg-blue-600 text-white shadow-sm"
//                                     : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//                                 }`}
//                         >
//                             {f}
//                         </button>
//                     ))}

//                     {/* MONTH */}
//                     <select
//                         value={month}
//                         onChange={(e) => setMonth(e.target.value)}
//                         className="border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
//                     >
//                         <option value="All">All Months</option>
//                         {[...Array(12)].map((_, i) => (
//                             <option key={i} value={i}>
//                                 {new Date(0, i).toLocaleString("default", { month: "short" })}
//                             </option>
//                         ))}
//                     </select>

//                     {/* SEARCH */}
//                     <input
//                         type="text"
//                         placeholder="Search member name..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 w-60 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
//                     />
//                 </div>

//                 {/* TABLE */}
//                 <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 font-semibold">
//                                 <th className="px-6 py-4 text-left">#</th>
//                                 <th className="px-6 py-4 text-left">Member</th>
//                                 <th className="px-6 py-4 text-left">Amount</th>
//                                 <th className="px-6 py-4 text-left">Date</th>
//                                 <th className="px-6 py-4 text-left">Status</th>
//                                 <th className="px-6 py-4 text-left">Action</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-gray-50">
//                             {filteredPayments.length > 0 ? (
//                                 filteredPayments.map((p, index) => (
//                                     <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-150">

//                                         <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>

//                                         <td className="px-6 py-4 text-gray-800 font-semibold">{p.memberId?.name || "N/A"}</td>

//                                         <td className="px-6 py-4">
//                                             <div className="font-bold text-blue-600 text-sm">₹{p.amount}</div>
//                                             <div className="text-xs text-green-500 mt-0.5">Paid: ₹{p.paidAmount || 0}</div>
//                                             <div className="text-xs text-red-400 mt-0.5">Due: ₹{p.amount - (p.paidAmount || 0)}</div>
//                                         </td>

//                                         <td className="px-6 py-4 text-gray-500 text-xs">
//                                             {new Date(p.date).toLocaleDateString("en-IN", {
//                                                 day: "2-digit", month: "short", year: "numeric"
//                                             })}
//                                         </td>

//                                         <td className="px-6 py-4">
//                                             <span className={`px-3 py-1 text-xs font-semibold rounded-full
//                                                 ${p.status === "Completed"
//                                                     ? "bg-green-100 text-green-700"
//                                                     : p.status === "Partial"
//                                                         ? "bg-orange-100 text-orange-600"
//                                                         : "bg-yellow-100 text-yellow-700"
//                                                 }`}>
//                                                 {p.status}
//                                             </span>
//                                         </td>

//                                         <td className="px-6 py-4">
//                                             {p.status !== "Completed" && (
//                                                 <button
//                                                     onClick={() => handleComplete(p._id)}
//                                                     className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors duration-150"
//                                                 >
//                                                     Pay
//                                                 </button>
//                                             )}
//                                         </td>

//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="text-center py-14 text-gray-400 text-sm">
//                                         No payments found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default PaymentList;

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

//     // ── Summary counts ────────────────────────────────────────────────────────
//     const total = payments.length;
//     const completed = payments.filter(p => p.status === "Completed").length;
//     const pending = payments.filter(p => p.status === "Pending").length;
//     const partial = payments.filter(p => p.status === "Partial").length;
//     const totalDue = payments.reduce((s, p) => s + (p.amount - (p.paidAmount || 0)), 0);

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

//                 {/* ── Page title ── */}
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-xl font-bold text-gray-900">Payments</h1>
//                         <p className="text-sm text-gray-400 mt-0.5">{total} records total</p>
//                     </div>
//                 </div>

//                 {/* ── Summary cards ── */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                     {[
//                         { label: "Completed", value: completed, color: "#15803d", bg: "#dcfce7" },
//                         { label: "Partial", value: partial, color: "#854d0e", bg: "#fef9c3" },
//                         { label: "Pending", value: pending, color: "#991b1b", bg: "#fee2e2" },
//                         { label: "Total Due", value: `₹${totalDue.toLocaleString()}`, color: "#1d4ed8", bg: "#dbeafe" },
//                     ].map(c => (
//                         <div key={c.label}
//                             className="rounded-xl p-4"
//                             style={{ background: c.bg }}>
//                             <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.label}</p>
//                             <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Filters ── */}
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//                     <div className="flex flex-wrap gap-3 items-center">

//                         {/* Status pills */}
//                         <div className="flex gap-2 flex-wrap">
//                             {["All", "Pending", "Partial", "Completed"].map((f) => (
//                                 <button
//                                     key={f}
//                                     onClick={() => setFilter(f)}
//                                     className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
//                                     style={filter === f
//                                         ? { background: "#2563eb", color: "#fff" }
//                                         : { background: "#f3f4f6", color: "#6b7280" }}
//                                 >
//                                     {f}
//                                 </button>
//                             ))}
//                         </div>

//                         <div className="flex-1" />

//                         {/* Month */}
//                         <select
//                             value={month}
//                             onChange={(e) => setMonth(e.target.value)}
//                             className="border border-gray-200 text-sm rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:border-blue-400"
//                         >
//                             <option value="All">All Months</option>
//                             {[...Array(12)].map((_, i) => (
//                                 <option key={i} value={i}>
//                                     {new Date(0, i).toLocaleString("default", { month: "long" })}
//                                 </option>
//                             ))}
//                         </select>

//                         {/* Search */}
//                         <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
//                             <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//                                 stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
//                                 <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//                             </svg>
//                             <input
//                                 type="text"
//                                 placeholder="Search name…"
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 className="text-sm outline-none w-32 text-gray-700 placeholder-gray-400"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Table ── */}
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="border-b border-gray-100">
//                                     {["#", "Member", "Amount", "Paid", "Due", "Date", "Status", ""].map(h => (
//                                         <th key={h}
//                                             className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
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

//                                             <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>

//                                             <td className="px-4 py-3">
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
//                                                         {p.memberId?.name?.slice(0, 2).toUpperCase() || "NA"}
//                                                     </div>
//                                                     <span className="font-medium text-gray-800 whitespace-nowrap">
//                                                         {p.memberId?.name || "N/A"}
//                                                     </span>
//                                                 </div>
//                                             </td>

//                                             <td className="px-4 py-3 font-semibold text-gray-800">₹{p.amount}</td>

//                                             <td className="px-4 py-3 text-green-600 font-medium">
//                                                 ₹{p.paidAmount || 0}
//                                             </td>

//                                             <td className="px-4 py-3">
//                                                 <span className={`font-medium ${due > 0 ? "text-red-500" : "text-gray-400"}`}>
//                                                     ₹{due}
//                                                 </span>
//                                             </td>

//                                             <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
//                                                 {new Date(p.date).toLocaleDateString("en-IN", {
//                                                     day: "2-digit", month: "short", year: "numeric"
//                                                 })}
//                                             </td>

//                                             <td className="px-4 py-3">
//                                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
//                                                     style={{ background: sc.bg, color: sc.color }}>
//                                                     <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
//                                                         style={{ background: sc.dot }} />
//                                                     {p.status}
//                                                 </span>
//                                             </td>

//                                             <td className="px-4 py-3">
//                                                 {p.status !== "Completed" && (
//                                                     <button
//                                                         onClick={() => handleComplete(p._id)}
//                                                         className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
//                                                         style={{ background: "#2563eb" }}
//                                                     >
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

// PaymentList.jsx
import { useEffect, useState } from "react";
import API from "../../api/api";
import ActionModal from "../../component/ActionModal";

const statusConfig = {
    Completed: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
    Partial: { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
    Pending: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
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
            setPayments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPayments(); }, []);

    const handleComplete = (id) => setModal({ type: "pay", paymentId: id });

    const filteredPayments = payments.filter((p) => {
        const matchStatus = filter === "All" || p.status === filter;
        const matchMonth = month === "All" || new Date(p.date).getMonth() === Number(month);
        const matchSearch = p.memberId?.name?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchMonth && matchSearch;
    });

    const total = payments.length;
    const completed = payments.filter(p => p.status === "Completed").length;
    const pending = payments.filter(p => p.status === "Pending").length;
    const partial = payments.filter(p => p.status === "Partial").length;
    const totalDue = payments.reduce((s, p) => s + (p.amount - (p.paidAmount || 0)), 0);
    const totalCollected = payments.reduce((s, p) => s + (p.paidAmount || 0), 0);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading payments…</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto space-y-5">

                {/* ── Header — centered ── */}
                <div className="text-center py-2">
                    <h1 className="text-xl font-bold text-gray-900">Payments</h1>
                    {/* <p className="text-sm text-gray-400 mt-0.5">{total} records total</p> */}
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        { label: "Completed", value: completed, color: "#15803d", bg: "#dcfce7" },
                        { label: "Partial", value: partial, color: "#854d0e", bg: "#fef9c3" },
                        { label: "Pending", value: pending, color: "#991b1b", bg: "#fee2e2" },
                        { label: "Total Collected", value: `₹${totalCollected.toLocaleString()}`, color: "#15803d", bg: "#dcfce7" },
                        { label: "Total Due", value: `₹${totalDue.toLocaleString()}`, color: "#1d4ed8", bg: "#dbeafe" },
                        { label: "Total Records", value: total, color: "#374151", bg: "#f3f4f6" },
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
                        <div className="flex gap-2 flex-wrap">
                            {["All", "Pending", "Partial", "Completed"].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={filter === f
                                        ? { background: "#2563eb", color: "#fff" }
                                        : { background: "#f3f4f6", color: "#6b7280" }}>
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1" />
                        <select value={month} onChange={e => setMonth(e.target.value)}
                            className="border border-gray-200 text-sm rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:border-blue-400">
                            <option value="All">All Months</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input type="text" placeholder="Search name…" value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="text-sm outline-none w-32 text-gray-700 placeholder-gray-400" />
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {["#", "Member", "phone", "Amount", "Paid", "Due", "Date", "Status", ""].map(h => (
                                        <th key={h}
                                            className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredPayments.length > 0 ? filteredPayments.map((p, i) => {
                                    const sc = statusConfig[p.status] || {};
                                    const due = p.amount - (p.paidAmount || 0);
                                    return (
                                        <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-center text-gray-400 text-xs">{i + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                                                        {p.memberId?.name?.slice(0, 2).toUpperCase() || "NA"}
                                                    </div>
                                                    <span className="font-medium text-gray-800 whitespace-nowrap">
                                                        {p.memberId?.name || "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-800">{p.memberId.phone}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-800">₹{p.amount}</td>
                                            <td className="px-4 py-3 text-center text-green-600 font-medium">₹{p.paidAmount || 0}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`font-medium ${due > 0 ? "text-red-500" : "text-gray-400"}`}>
                                                    ₹{due}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-500 whitespace-nowrap">
                                                {new Date(p.date).toLocaleDateString("en-IN", {
                                                    day: "2-digit", month: "short", year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                                    style={{ background: sc.bg, color: sc.color }}>
                                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {p.status !== "Completed" && (
                                                    <button onClick={() => handleComplete(p._id)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-80"
                                                        style={{ background: "#2563eb" }}>
                                                        Pay
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="8" className="py-16 text-center">
                                            <div className="text-3xl mb-2">💳</div>
                                            <p className="text-gray-400 text-sm">No payments found</p>
                                        </td>
                                    </tr>
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