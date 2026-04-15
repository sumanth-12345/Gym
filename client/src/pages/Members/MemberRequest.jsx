import { useEffect, useState } from "react";
import API from "../../api/api";

const MemberRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await API.get("/member/requests");
            setRequests(res.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-gray-400">Loading...</p>;
    }

    if (requests.length === 0) {
        return <p className="text-center mt-10 text-gray-400">No requests found</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto space-y-3">

                <h2 className="text-lg font-semibold text-center mb-4">
                    Payment Requests
                </h2>

                {requests.map((r) => {

                    const pending = (r.totalAmount || 0) - (r.paidAmount || 0);

                    return (
                        <div key={r._id} className="bg-white border rounded-lg p-4 shadow-sm space-y-2">

                            {/* STATUS */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Status</span>

                                <span className={`text-xs font-semibold px-2 py-1 rounded-full
                                    ${r.status === "Rejected"
                                        ? "bg-red-100 text-red-600"
                                        : r.status === "Accepted"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-yellow-100 text-yellow-600"
                                    }`}
                                >
                                    {r.status}
                                </span>
                            </div>

                            {/* AMOUNTS */}
                            <p className="text-sm text-gray-700">
                                Total: ₹{r.totalAmount}
                            </p>

                            <p className="text-sm text-green-600">
                                Paid: ₹{r.paidAmount}
                            </p>

                            <p className="text-sm text-red-500">
                                Pending: ₹{pending}
                            </p>

                            {/* DATE */}
                            <p className="text-xs text-gray-400">
                                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>

                            {/* ❌ REJECT MESSAGE (MAIN FIX) */}
                            {r.status === "Rejected" && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                                    <p className="text-xs font-semibold text-red-600 mb-1">
                                        Rejected by Owner
                                    </p>

                                    <p className="text-sm text-red-500">
                                        {r.reason && r.reason.trim() !== ""
                                            ? r.reason
                                            : "No reason provided"}
                                    </p>
                                </div>
                            )}

                            {/* ✅ ACCEPT MESSAGE */}
                            {r.status === "Accepted" && (
                                <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2">
                                    <p className="text-xs text-green-600">
                                        Payment accepted successfully
                                    </p>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MemberRequests;