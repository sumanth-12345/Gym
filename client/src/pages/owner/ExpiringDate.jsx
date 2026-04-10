

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