
// ActiveMembers.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import ActionModal from "../../component/ActionModal";

const ActiveMembers = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(null);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            if (!token) return navigate("/login");
            const res = await API.get("/active");
            setActive(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load active members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpgrade = (id) => setModal({ type: "upgrade", memberId: id });

    const filtered = active.filter(m =>
        m.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading active members…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
            <div>
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
                    <h1 className="text-xl font-bold text-gray-900">Active Members</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{active.length} members currently active</p>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total Active", value: active.length, bg: "#dcfce7", color: "#15803d" },
                        { label: "Expiring ≤ 7d", value: active.filter(m => Math.ceil((new Date(m.expiryDate) - Date.now()) / 86400000) <= 7).length, bg: "#fef9c3", color: "#854d0e" },
                        { label: "Safe", value: active.filter(m => Math.ceil((new Date(m.expiryDate) - Date.now()) / 86400000) > 7).length, bg: "#dbeafe", color: "#1d4ed8" },
                    ].map(c => (
                        <div key={c.label} className="rounded-xl p-4 text-center" style={{ background: c.bg }}>
                            <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.label}</p>
                            <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Search ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 max-w-xs">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search member name…"
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
                        {search && (
                            <button onClick={() => setSearch("")}
                                className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                        )}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
                        style={{ background: "#dcfce7" }}>
                        <div className="flex items-center gap-2">
                            <span>🟢</span>
                            <h2 className="font-semibold text-gray-800">Active Members</h2>
                            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-green-500">
                                {filtered.length}
                            </span>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="py-14 text-center">
                            <div className="text-3xl mb-2">🔍</div>
                            <p className="text-gray-400 text-sm">No members found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {["#", "Member", "phone", "New Expiry", "Days Left"].map(h => (
                                            <th key={h}
                                                className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map((m, i) => {
                                        const expiry = new Date(m.expiryDate);
                                        const daysLeft = Math.ceil((expiry - Date.now()) / 86400000);
                                        const dayColor = daysLeft <= 7 ? "#eab308" : "#22c55e";

                                        return (
                                            <tr key={m._id}
                                                onClick={() => navigate(`/owner/member/${m._id}`)}
                                                className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 text-center text-gray-400 text-xs">{i + 1}</td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0">
                                                            {m.name?.slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-800 whitespace-nowrap">{m.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-center text-gray-500 whitespace-nowrap">{m.phone}</td>
                                                <td className="px-5 py-3 text-center text-gray-500 whitespace-nowrap">
                                                    {expiry.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                                        style={{ background: dayColor + "22", color: dayColor }}>
                                                        {daysLeft}d left
                                                    </span>
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
            <ActionModal modal={modal} setModal={setModal} refresh={fetchData} />
        </div>
    );
};

export default ActiveMembers;