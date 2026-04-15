import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const Memberlist = () => {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [trainerFilter, setTrainerFilter] = useState("all");
    const [monthFilter, setMonthFilter] = useState(""); // 🔥 NEW
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [deleteModal, setDeleteModal] = useState(null);

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
    }, []);

    // 🔹 Edit
    const handleEdit = (member) => {
        navigate(`/owner/addmember/update/${member._id}`, { state: { member } });
    };

    // 🔹 Delete Confirm
    const confirmDelete = async () => {
        try {
            await API.delete(`/owner/addmember/delete/${deleteModal._id}`);
            setMembers(prev => prev.filter(m => m._id !== deleteModal._id));
            setDeleteModal(null);
        } catch (err) {
            alert("Delete failed");
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

    // 🔥 FILTER LOGIC (FINAL)
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

        // 🔥 MONTH FILTER
        let matchesMonth = true;

        if (monthFilter) {
            const [year, month] = monthFilter.split("-");

            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59);

            const join = new Date(m.joinDate);

            matchesMonth = join >= start && join <= end;
        }

        return matchesSearch && matchesTrainer && matchesMonth;
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

                {/* Filters */}
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

                    {/* 🔥 Month Filter */}
                    <input
                        type="month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full sm:w-60 px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Clear */}
                    {monthFilter && (
                        <button
                            onClick={() => setMonthFilter("")}
                            className="px-3 py-2 text-sm bg-gray-200 rounded-lg"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["#", "Name", "Phone", "Plan", "Amount", "Payment", "Join", "Expiry", "Status", "Actions"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((m, index) => (
                                        <tr
                                            key={m._id}
                                            onClick={() => navigate(`/owner/member/${m._id}`)}
                                            className="border-b hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-400">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{m.name}</td>
                                            <td className="px-4 py-3 text-sm">{m.phone}</td>
                                            <td className="px-4 py-3 text-sm">{m.plan}M</td>
                                            <td className="px-4 py-3 text-sm">₹{m.amount}</td>
                                            <td className="px-4 py-3 text-sm">{m.paymentStatus}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(m.joinDate).toLocaleDateString("en-GB")}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {m.expiryDate
                                                    ? new Date(m.expiryDate).toLocaleDateString("en-GB")
                                                    : "—"}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full
                                                    ${getStatus(m.expiryDate) === "Expired" ? "bg-red-100 text-red-600"
                                                        : getStatus(m.expiryDate) === "Expiring" ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"}`}>
                                                    {getStatus(m.expiryDate)}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(m);
                                                        }}
                                                        className="px-3 py-1 bg-amber-500 text-white text-xs rounded"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteModal(m);
                                                        }}
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
                                        <td colSpan="10" className="text-center py-10 text-gray-400">
                                            No members found
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {/* 🔥 DELETE MODAL */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-5 w-80 text-center shadow-lg">

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Delete Member
                        </h3>

                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to delete <b>{deleteModal.name}</b>?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="w-full py-2 rounded-lg bg-gray-200 text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="w-full py-2 rounded-lg bg-red-500 text-white text-sm"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Memberlist;