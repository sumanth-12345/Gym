

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import useAccess from "../../hooks/useAccess";

const Memberlist = () => {
    const navigate = useNavigate();
    const { hasAccess } = useAccess();

    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [trainerFilter, setTrainerFilter] = useState("all"); // 🔥 NEW
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // 🔹 Fetch Members
    useEffect(() => {





        const fetchMembers = async () => {
            try {
                const res = await API.get("/owner/addmember/all");
                setMembers(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch members");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [hasAccess]);

    // 🔹 Edit
    const handleEdit = (member) => {
        navigate(`/owner/addmember/update/${member._id}`, { state: { member } });
    };

    // 🔹 Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this member?")) return;

        try {
            await API.delete(`/owner/addmember/delete/${id}`);
            setMembers(prev => prev.filter(m => m._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    // 🔹 Status Logic
    const getStatus = (expiryDate) => {
        if (!expiryDate) return "Unknown";

        const today = new Date();
        const exp = new Date(expiryDate);

        if (exp < today) return "Expired";

        const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 5) return "Expiring";

        return "Active";
    };

    // 🔥 CENTRAL FILTER LOGIC (STRONG)
    const filteredMembers = members.filter((m) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            !search ||
            m.name.toLowerCase().includes(searchText) ||
            m.phone.includes(search) ||
            (m.trainerName && m.trainerName.toLowerCase().includes(searchText));

        const matchesTrainer =
            trainerFilter === "all" ||
            (trainerFilter === "with" && m.hasTrainer) ||
            (trainerFilter === "without" && !m.hasTrainer);

        return matchesSearch && matchesTrainer;
    });

    if (loading) return <p className="text-center mt-5">Loading members...</p>;
    if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Members List</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredMembers.length} members total
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/owner/addmember")}
                        className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Member
                    </button>

                </div>

                {/* 🔥 Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by name / phone / trainer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Trainer Filter */}
                    <select
                        value={trainerFilter}
                        onChange={(e) => setTrainerFilter(e.target.value)}
                        className="w-full sm:w-60 px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Members</option>
                        <option value="with">With Trainer</option>
                        <option value="without">Without Trainer</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["#", "Name", "Phone", "Plan", "Amount", "Payment", "Join", "Expiry", "Status", "Trainer", "Goal", "Weight", "Height", "Health", "Actions"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((m, index) => (
                                        <tr key={m._id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-400">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{m.name}</td>
                                            <td className="px-4 py-3 text-sm">{m.phone}</td>
                                            <td className="px-4 py-3 text-sm">{m.plan}M</td>
                                            <td className="px-4 py-3 text-sm">₹{m.amount}</td>
                                            <td className="px-4 py-3 text-sm">{m.paymentStatus}</td>
                                            <td className="px-4 py-3 text-sm">{new Date(m.joinDate).toLocaleDateString("en-GB")}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString("en-GB") : "—"}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full
                                                    ${getStatus(m.expiryDate) === "Expired" ? "bg-red-100 text-red-600"
                                                        : getStatus(m.expiryDate) === "Expiring" ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"}`}>
                                                    {getStatus(m.expiryDate)}
                                                </span>
                                            </td>

                                            {/* Trainer */}
                                            <td className="px-4 py-3 text-sm">
                                                {m.hasTrainer ? m.trainerName : "No"}
                                            </td>

                                            <td className="px-4 py-3 text-sm">{m.fitnessGoal || "—"}</td>
                                            <td className="px-4 py-3 text-sm">{m.weight || "—"}</td>
                                            <td className="px-4 py-3 text-sm">{m.height || "—"}</td>
                                            <td className="px-4 py-3 text-sm">{m.healthIssues || "—"}</td>

                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(m)}
                                                        className="px-3 py-1 bg-amber-500 text-white text-xs rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(m._id)}
                                                        className="px-3 py-1 bg-red-500 text-white text-xs rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="15" className="text-center py-10 text-gray-400">
                                            No members found
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

export default Memberlist;