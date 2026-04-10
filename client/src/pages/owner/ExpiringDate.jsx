// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/api";

// const ExpiringDate = () => {
//     const navigate = useNavigate();

//     const [expired, setExpired] = useState([]);
//     const [expiring, setExpiring] = useState([]);
//     const [active, setActive] = useState([]);

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const token = sessionStorage.getItem("token");

//             if (!token) {
//                 navigate("/login");
//                 return;
//             }

//             const [res1, res2, res3] = await Promise.all([
//                 API.get("/owner/expired"),
//                 API.get("/owner/expiring"),
//                 API.get("/owner/active")
//             ]);

//             setExpired(res1.data || []);
//             setExpiring(res2.data || []);
//             setActive(res3.data || []);

//         } catch (err) {
//             console.error("Fetch error:", err);

//             if (err.response?.status === 401) {
//                 navigate("/login");
//             } else {
//                 setError("Failed to load dashboard data");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     // ✅ FIXED: now creates REQUEST (not direct renew)
//     const handleRenew = async (id) => {
//         try {
//             await API.post("/renew", { memberId: id });

//             alert("Request sent to member");

//             fetchData();

//         } catch (err) {
//             console.error("Renew error:", err);
//             alert(err.response?.data?.message || "Request failed");
//         }
//     };

//     if (loading) {
//         return <p className="text-center mt-10 text-lg">Loading dashboard...</p>;
//     }

//     if (error) {
//         return <p className="text-center mt-10 text-red-500">{error}</p>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-6 md:p-10">
//             <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
//                 Owner Dashboard
//             </h2>

//             {/* 🔴 EXPIRED */}
//             <Section
//                 title="Expired Members"
//                 color="red"
//                 data={expired}
//                 showButton={true}
//                 onRenew={handleRenew}
//             />

//             {/* 🟡 EXPIRING */}
//             <Section
//                 title="Expiring Soon"
//                 color="yellow"
//                 data={expiring}
//                 showButton={true}
//                 onRenew={handleRenew}
//             />

//             {/* 🟢 ACTIVE */}
//             <Section
//                 title="Active Members"
//                 color="green"
//                 data={active}
//             />
//         </div>
//     );
// };

// export default ExpiringDate;


// // ✅ Section component (unchanged logic)
// const Section = ({ title, color, data, showButton, onRenew }) => {

//     const colors = {
//         red: { text: "text-red-600", bg: "bg-red-50", button: "bg-red-500 hover:bg-red-600" },
//         yellow: { text: "text-yellow-600", bg: "bg-yellow-50", button: "bg-yellow-500 hover:bg-yellow-600" },
//         green: { text: "text-green-600", bg: "bg-green-50", button: "bg-green-500 hover:bg-green-600" },
//     };
//     const colorClass = colors[color] || colors.green;
//     return (
//         <div className="mb-10">
//             <h3 className={`${colorClass.text} font-bold text-xl mb-5`}>
//                 {title} ({data.length})
//             </h3>

//             <div className="overflow-x-auto">
//                 <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
//                     <thead className={`${colorClass.bg} border-b border-gray-300`}>
//                         <tr>
//                             <th className="px-6 py-3 text-left text-gray-700 font-medium">S.No</th>
//                             <th className="px-6 py-3 text-left text-gray-700 font-medium">Name</th>
//                             <th className="px-6 py-3 text-left text-gray-700 font-medium">Expiry</th>
//                             {showButton && <th className="px-6 py-3 text-left text-gray-700 font-medium">Action</th>}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {data.length > 0 ? (
//                             data.map((m, index) => (
//                                 <tr key={m._id} className="hover:bg-gray-50 transition">
//                                     <td className="px-6 py-3 text-gray-800">{index + 1}</td>
//                                     <td className="px-6 py-3 text-gray-800">{m.name}</td>
//                                     <td className="px-6 py-3 text-gray-700">{new Date(m.expiryDate).toLocaleDateString()}</td>
//                                     {showButton && (
//                                         <td className="px-6 py-3">
//                                             <button
//                                                 onClick={() => onRenew(m._id)}
//                                                 className={`${colorClass.button} text-white px-4 py-2 rounded-lg font-medium transition`}
//                                             >
//                                                 Renew
//                                             </button>
//                                         </td>
//                                     )}
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={showButton ? 4 : 3} className="text-center py-6 text-gray-500">
//                                     No data
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };


// //2nd is import file 
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/api";

// const ExpiringDate = () => {
//     const navigate = useNavigate();

//     const [expired, setExpired] = useState([]);
//     const [expiring, setExpiring] = useState([]);
//     const [active, setActive] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const token = sessionStorage.getItem("token");
//             if (!token) { navigate("/login"); return; }

//             const [res1, res2, res3] = await Promise.all([
//                 API.get("/expired"),
//                 API.get("/expiring"),
//                 API.get("/active")
//             ]);

//             setExpired(res1.data || []);
//             setExpiring(res2.data || []);
//             setActive(res3.data || []);

//         } catch (err) {
//             console.error(err);
//             setError("Failed to load data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchData(); }, []);

//     const handleRenew = async (id) => {
//         const amount = Number(prompt("Enter amount"));

//         if (!amount || amount <= 0) return alert("Invalid amount");

//         try {
//             await API.post("/renew", { memberId: id, amount },);
//             alert("Renewed successfully");
//             fetchData();
//         } catch (err) {
//             console.error(err);
//             alert("Renew failed");
//         }
//     };

//     const handleUpgrade = async (id) => {
//         const input = prompt("Enter months:");
//         const amount = Number(prompt("Enter amount"));
//         const months = Number(input);
//         if (!months || months <= 0) return alert("Invalid input");
//         if (!amount || amount <= 0) return alert("Invalid amount");

//         try {
//             await API.post("/renew", { memberId: id, months: months, amount });
//             fetchData();
//         } catch (err) {
//             console.error(err.response?.data);
//         }
//     };

//     if (loading) return (
//         <div className="flex items-center justify-center min-h-screen">
//             <div className="flex flex-col items-center gap-3">
//                 <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                 <p className="text-gray-500 text-sm font-medium">Loading dashboard...</p>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="flex items-center justify-center min-h-screen">
//             <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-sm font-medium">
//                 ⚠️ {error}
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-10">
//             <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
//                 Owner Dashboard
//             </h1>

//             <div className="flex flex-col gap-8">
//                 <Section
//                     title="Expired Members"
//                     color="red"
//                     data={expired}
//                     onRenew={handleRenew}
//                     onUpgrade={handleUpgrade}
//                 />
//                 <Section
//                     title="Expiring Soon"
//                     color="yellow"
//                     data={expiring}
//                     onRenew={handleRenew}
//                     onUpgrade={handleUpgrade}
//                 />
//                 <Section
//                     title="Active Members"
//                     color="green"
//                     data={active}
//                     onUpgrade={handleUpgrade}
//                 />
//             </div>
//         </div>
//     );
// };

// export default ExpiringDate;


// const colorConfig = {
//     red: {
//         badge: "bg-red-100 text-red-700 border border-red-200",
//         header: "bg-red-50 border-b border-red-100",
//         dot: "bg-red-400",
//         renew: "bg-red-500 hover:bg-red-600 text-white",
//     },
//     yellow: {
//         badge: "bg-yellow-100 text-yellow-700 border border-yellow-200",
//         header: "bg-yellow-50 border-b border-yellow-100",
//         dot: "bg-yellow-400",
//         renew: "bg-yellow-500 hover:bg-yellow-600 text-white",
//     },
//     green: {
//         badge: "bg-green-100 text-green-700 border border-green-200",
//         header: "bg-green-50 border-b border-green-100",
//         dot: "bg-green-400",
//         renew: "bg-green-500 hover:bg-green-600 text-white",
//     },
// };

// const Section = ({ title, color, data, onRenew, onUpgrade }) => {
//     const c = colorConfig[color];

//     return (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

//             {/* Header */}
//             <div className={`${c.header} px-6 py-4 flex items-center gap-3`}>
//                 <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
//                 <h2 className="text-base font-semibold text-gray-700">{title}</h2>
//                 <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
//                     {data.length} {data.length === 1 ? "member" : "members"}
//                 </span>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wide">
//                             <th className="px-6 py-3 text-left font-medium">#</th>
//                             <th className="px-6 py-3 text-left font-medium">Name</th>
//                             <th className="px-6 py-3 text-left font-medium">Expiry Date</th>
//                             <th className="px-6 py-3 text-left font-medium">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-50">
//                         {data.length > 0 ? data.map((m, i) => (
//                             <tr key={m._id} className="hover:bg-gray-50 transition-colors duration-150">
//                                 <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
//                                 <td className="px-6 py-4 text-gray-800 font-medium">{m.name}</td>
//                                 <td className="px-6 py-4 text-gray-500">
//                                     {new Date(m.expiryDate).toLocaleDateString("en-IN", {
//                                         day: "2-digit", month: "short", year: "numeric"
//                                     })}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex items-center gap-2">
//                                         {onRenew && (
//                                             <button
//                                                 onClick={() => onRenew(m._id)}
//                                                 className={`${c.renew} text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150`}
//                                             >
//                                                 +1 Month
//                                             </button>
//                                         )}
//                                         <button
//                                             onClick={() => onUpgrade(m._id)}
//                                             className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150"
//                                         >
//                                             Upgrade
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan={4} className="text-center py-10 text-gray-400 text-sm">
//                                     No members in this category
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };



// // ExpiredMembers.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/api";
// import ActionModal from "../../component/ActionModal";

// const ExpiredMembers = () => {
//     const navigate = useNavigate();
//     const [modal, setModal] = useState(null);
//     const [expired, setExpired] = useState([]);
//     const [expiring, setExpiring] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             setError("");
//             const token = sessionStorage.getItem("token");
//             if (!token) {
//                 navigate("/login");
//                 return;
//             }
//             const [r1, r2] = await Promise.all([API.get("/expired"), API.get("/expiring")]);
//             setExpired(r1.data || []);
//             setExpiring(r2.data || []);
//         } catch (err) {
//             console.error(err);
//             setError("Failed to load data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleRenew = (id) => setModal({ type: "renew", memberId: id });
//     const handleUpgrade = (id) => setModal({ type: "upgrade", memberId: id });

//     if (loading)
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center gap-3">
//                     <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                     <p className="text-sm text-gray-400">Loading members…</p>
//                 </div>
//             </div>
//         );

//     if (error)
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="text-4xl mb-3">⚠️</div>
//                     <p className="text-red-500 font-medium">{error}</p>
//                     <button
//                         onClick={fetchData}
//                         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-6xl mx-auto space-y-5">
//                 <div>
//                     <h1 className="text-xl font-bold text-gray-900">Expired Members</h1>
//                     <p className="text-sm text-gray-400 mt-0.5">
//                         Manage renewals and upgrades for expired members
//                     </p>
//                 </div>

//                 <Section
//                     title="Expired Members"
//                     emoji="🔴"
//                     accent="#ef4444"
//                     headerBg="#fee2e2"
//                     data={expired}
//                     onRenew={handleRenew}
//                     onUpgrade={handleUpgrade}
//                 />

//                 <Section
//                     title="Expiring Soon"
//                     emoji="🟡"
//                     accent="#eab308"
//                     headerBg="#fef9c3"
//                     data={expiring}
//                     onRenew={handleRenew}
//                     onUpgrade={handleUpgrade}
//                 />
//             </div>

//             <ActionModal modal={modal} setModal={setModal} refresh={fetchData} />
//         </div>
//     );
// };

// // ── Section component ─────────────────────────────────────────
// const Section = ({ title, emoji, accent, headerBg, data, onRenew, onUpgrade }) => {
//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//             <div
//                 className="flex items-center justify-between px-5 py-4 cursor-pointer"
//                 style={{ background: headerBg }}
//                 onClick={() => setCollapsed((p) => !p)}
//             >
//                 <div className="flex items-center gap-2">
//                     <span>{emoji}</span>
//                     <h2 className="font-semibold text-gray-800">{title}</h2>
//                     <span
//                         className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
//                         style={{ background: accent }}
//                     >
//                         {data.length}
//                     </span>
//                 </div>
//                 <svg
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#9ca3af"
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     style={{
//                         transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
//                         transition: "transform 0.2s",
//                     }}
//                 >
//                     <polyline points="6,9 12,15 18,9" />
//                 </svg>
//             </div>

//             {!collapsed &&
//                 (data.length === 0 ? (
//                     <div className="py-10 text-center text-gray-400 text-sm">
//                         No members in this category
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="border-b border-gray-100">
//                                     {["#", "Member", "Expiry", "Days Left", "Actions"].map((h) => (
//                                         <th
//                                             key={h}
//                                             className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
//                                         >
//                                             {h}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-50">
//                                 {data.map((m, i) => {
//                                     const expiry = new Date(m.expiryDate);
//                                     const daysLeft = Math.ceil((expiry - Date.now()) / 86400000);
//                                     const dayColor =
//                                         daysLeft < 0 ? "#ef4444" : daysLeft <= 7 ? "#eab308" : "#22c55e";

//                                     return (
//                                         <tr key={m._id} className="hover:bg-gray-50 transition-colors">
//                                             <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
//                                             <td className="px-5 py-3">
//                                                 <div className="flex items-center gap-2">
//                                                     <div
//                                                         className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
//                                                         style={{ background: accent }}
//                                                     >
//                                                         {m.name?.slice(0, 2).toUpperCase()}
//                                                     </div>
//                                                     <span className="font-medium text-gray-800">{m.name}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
//                                                 {expiry.toLocaleDateString("en-IN", {
//                                                     day: "2-digit",
//                                                     month: "short",
//                                                     year: "numeric",
//                                                 })}
//                                             </td>
//                                             <td className="px-5 py-3">
//                                                 <span
//                                                     className="text-xs font-bold px-2.5 py-1 rounded-full"
//                                                     style={{
//                                                         background: dayColor + "22",
//                                                         color: dayColor,
//                                                     }}
//                                                 >
//                                                     {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
//                                                 </span>
//                                             </td>
//                                             <td className="px-5 py-3">
//                                                 <div className="flex gap-2">
//                                                     {onRenew && (
//                                                         <button
//                                                             onClick={() => onRenew(m._id)}
//                                                             className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
//                                                             style={{ background: "#2563eb" }}
//                                                         >
//                                                             Renew
//                                                         </button>
//                                                     )}
//                                                     <button
//                                                         onClick={() => onUpgrade(m._id)}
//                                                         className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
//                                                         style={{ background: "#7c3aed" }}
//                                                     >
//                                                         Upgrade
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 ))}
//         </div>
//     );
// };

// export default ExpiredMembers;




// // ExpiringDate.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/api";
// import ActionModal from "../../component/ActionModal";

// const ExpiringDate = () => {
//     const navigate = useNavigate();
//     const [modal, setModal] = useState(null);
//     const [expired, setExpired] = useState([]);
//     const [expiring, setExpiring] = useState([]);
//     const [active, setActive] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const fetchData = async () => {
//         try {
//             setLoading(true); setError("");
//             const token = sessionStorage.getItem("token");
//             if (!token) { navigate("/login"); return; }
//             const [r1, r2, r3] = await Promise.all([
//                 API.get("/expired"),
//                 API.get("/expiring"),
//                 API.get("/active"),
//             ]);
//             setExpired(r1.data || []);
//             setExpiring(r2.data || []);
//             setActive(r3.data || []);
//         } catch (err) {
//             console.error(err);
//             setError("Failed to load data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchData(); }, []);

//     const handleRenew = (id) => setModal({ type: "renew", memberId: id });
//     const handleUpgrade = (id) => setModal({ type: "upgrade", memberId: id });

//     if (loading) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="flex flex-col items-center gap-3">
//                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                 <p className="text-sm text-gray-400">Loading members…</p>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="text-center">
//                 <div className="text-4xl mb-3">⚠️</div>
//                 <p className="text-red-500 font-medium">{error}</p>
//                 <button onClick={fetchData}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
//                     Retry
//                 </button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-6xl mx-auto space-y-5">

//                 {/* ── Page title ── */}
//                 <div>
//                     <h1 className="text-xl font-bold text-gray-900">Member Status</h1>
//                     <p className="text-sm text-gray-400 mt-0.5">
//                         Manage renewals and upgrades
//                     </p>
//                 </div>

//                 {/* ── Summary cards ── */}
//                 <div className="grid grid-cols-3 gap-3">
//                     {[
//                         { label: "Expired", value: expired.length, bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
//                         { label: "Expiring Soon", value: expiring.length, bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
//                         { label: "Active", value: active.length, bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
//                     ].map(c => (
//                         <div key={c.label} className="rounded-xl p-4" style={{ background: c.bg }}>
//                             <div className="flex items-center gap-1.5 mb-1">
//                                 <span className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
//                                 <p className="text-xs font-medium" style={{ color: c.color }}>{c.label}</p>
//                             </div>
//                             <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Sections ── */}
//                 <Section
//                     title="Expired Members"
//                     emoji="🔴"
//                     accent="#ef4444"
//                     headerBg="#fee2e2"
//                     data={expired}
//                     onRenew={handleRenew}
//                     onUpgrade={handleUpgrade}
//                 />
//                 <Section
//                     title="Expiring Soon"
//                     emoji="🟡"
//                     accent="#eab308"
//                     headerBg="#fef9c3"
//                     data={expiring}
//                     onRenew={handleRenew}
//                     onUpgrade={handleUpgrade}
//                 />
//                 <Section
//                     title="Active Members"
//                     emoji="🟢"
//                     accent="#22c55e"
//                     headerBg="#dcfce7"
//                     data={active}
//                     onUpgrade={handleUpgrade}
//                 />

//             </div>

//             <ActionModal modal={modal} setModal={setModal} refresh={fetchData} />
//         </div>
//     );
// };

// // ── Section component ─────────────────────────────────────────────────────────
// const Section = ({ title, emoji, accent, headerBg, data, onRenew, onUpgrade }) => {
//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

//             {/* Section header */}
//             <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
//                 style={{ background: headerBg }}
//                 onClick={() => setCollapsed(p => !p)}>
//                 <div className="flex items-center gap-2">
//                     <span>{emoji}</span>
//                     <h2 className="font-semibold text-gray-800">{title}</h2>
//                     <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
//                         style={{ background: accent }}>
//                         {data.length}
//                     </span>
//                 </div>
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
//                     stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"
//                     style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
//                     <polyline points="6,9 12,15 18,9" />
//                 </svg>
//             </div>

//             {!collapsed && (
//                 data.length === 0 ? (
//                     <div className="py-10 text-center text-gray-400 text-sm">
//                         No members in this category
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm">
//                             <thead>
//                                 <tr className="border-b border-gray-100">
//                                     {["#", "Member", "Expiry", "Days Left", "Type", "Actions"].map(h => (
//                                         <th key={h}
//                                             className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
//                                             {h}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-50">
//                                 {data.map((m, i) => {
//                                     const expiry = new Date(m.expiryDate);
//                                     const daysLeft = Math.ceil((expiry - Date.now()) / 86400000);
//                                     const dayColor = daysLeft < 0 ? "#ef4444"
//                                         : daysLeft <= 7 ? "#eab308" : "#22c55e";

//                                     return (
//                                         <tr key={m._id} className="hover:bg-gray-50 transition-colors">

//                                             <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>

//                                             <td className="px-5 py-3">
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
//                                                         style={{ background: accent }}>
//                                                         {m.name?.slice(0, 2).toUpperCase()}
//                                                     </div>
//                                                     <span className="font-medium text-gray-800">{m.name}</span>
//                                                 </div>
//                                             </td>

//                                             <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
//                                                 {expiry.toLocaleDateString("en-IN", {
//                                                     day: "2-digit", month: "short", year: "numeric"
//                                                 })}
//                                             </td>

//                                             <td className="px-5 py-3">
//                                                 <span className="text-xs font-bold px-2.5 py-1 rounded-full"
//                                                     style={{
//                                                         background: dayColor + "22",
//                                                         color: dayColor
//                                                     }}>
//                                                     {daysLeft < 0
//                                                         ? `${Math.abs(daysLeft)}d ago`
//                                                         : `${daysLeft}d left`}
//                                                 </span>
//                                             </td>

//                                             <td className="px-5 py-3 text-xs text-gray-600 font-semibold">
//                                                 {m.type || "—"}  {/* Renew / Upgrade or empty if normal */}
//                                             </td>

//                                             <td className="px-5 py-3">
//                                                 <div className="flex gap-2">
//                                                     {onRenew && (
//                                                         <button
//                                                             onClick={() => onRenew(m._id)}
//                                                             className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
//                                                             style={{ background: "#2563eb" }}>
//                                                             Renew
//                                                         </button>
//                                                     )}
//                                                     <button
//                                                         onClick={() => onUpgrade(m._id)}
//                                                         className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
//                                                         style={{ background: "#7c3aed" }}>
//                                                         Upgrade
//                                                     </button>
//                                                 </div>
//                                             </td>

//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )
//             )}
//         </div>
//     );
// };

// export default ExpiringDate;


// ExpiredMembers.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import ActionModal from "../../component/ActionModal";

const ExpiredMembers = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState(null);
    const [expired, setExpired] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true); setError("");
            const token = sessionStorage.getItem("token");
            if (!token) { navigate("/login"); return; }
            const [r1, r2] = await Promise.all([API.get("/expired"), API.get("/expiring")]);
            setExpired(r1.data || []);
            setExpiring(r2.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleRenew = (id) => setModal({ type: "renew", memberId: id });
    const handleUpgrade = (id) => setModal({ type: "upgrade", memberId: id });

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading members…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-500 font-medium">{error}</p>
                <button onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto space-y-5">

                {/* ── Header — centered ── */}
                <div className="text-center py-2">
                    <h1 className="text-xl font-bold text-gray-900">Expiring Members</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage renewals and upgrades</p>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Expired", value: expired.length, bg: "#fee2e2", color: "#991b1b" },
                        { label: "Expiring Soon", value: expiring.length, bg: "#fef9c3", color: "#854d0e" },
                    ].map(c => (
                        <div key={c.label} className="rounded-xl p-4 text-center" style={{ background: c.bg }}>
                            <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.label}</p>
                            <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                        </div>
                    ))}
                </div>

                <Section title="Expired Members" emoji="🔴" accent="#ef4444" headerBg="#fee2e2"
                    data={expired} onRenew={handleRenew} onUpgrade={handleUpgrade} />

                <Section title="Expiring Soon" emoji="🟡" accent="#eab308" headerBg="#fef9c3"
                    data={expiring}
                // onRenew={handleRenew} onUpgrade={handleUpgrade}
                />

            </div>
            <ActionModal modal={modal} setModal={setModal} refresh={fetchData} />
        </div>
    );
};

const Section = ({ title, emoji, accent, headerBg, data, onRenew, onUpgrade }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
                style={{ background: headerBg }}
                onClick={() => setCollapsed(p => !p)}>
                <div className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <h2 className="font-semibold text-gray-800">{title}</h2>
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: accent }}>{data.length}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6,9 12,15 18,9" />
                </svg>
            </div>

            {!collapsed && (
                data.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm">No members in this category</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {["#", "Member", "phone", "Expiry", "Days Left", "Actions"].map(h => (
                                        <th key={h}
                                            className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.map((m, i) => {
                                    const expiry = new Date(m.expiryDate);
                                    const daysLeft = Math.ceil((expiry - Date.now()) / 86400000);
                                    const dayColor = daysLeft < 0 ? "#ef4444" : daysLeft <= 7 ? "#eab308" : "#22c55e";

                                    return (
                                        <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 text-center text-gray-400 text-xs">{i + 1}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                        style={{ background: accent }}>
                                                        {m.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{m.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center text-gray-500 whitespace-nowrap">
                                                {m.phone}
                                            </td>
                                            <td className="px-5 py-3 text-center text-gray-500 whitespace-nowrap">
                                                {expiry.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>

                                            <td className="px-5 py-3 text-center">
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                                    style={{ background: dayColor + "22", color: dayColor }}>
                                                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    {onRenew && (
                                                        <button onClick={() => onRenew(m._id)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-80"
                                                            style={{ background: "#2563eb" }}>
                                                            Renew
                                                        </button>
                                                    )}
                                                    <button onClick={() => onUpgrade(m._id)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-80"
                                                        style={{ background: "#7c3aed" }}>
                                                        Upgrade
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default ExpiredMembers;