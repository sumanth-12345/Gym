import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

const OwnerMemberDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await API.get(`/owner/member/${id}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!data) return <div className="p-6">No Data</div>;

    const { member, summary, history } = data;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* 🔹 HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Member Details</h1>
                    <button onClick={() => navigate(-1)}
                        className="bg-gray-200 px-3 py-1 rounded">
                        Back
                    </button>
                </div>

                {/* 🔹 BASIC */}
                <div className="bg-white p-5 rounded-xl border">
                    <h2 className="font-bold mb-3">Basic Info</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <p><b>Name:</b> {member.name}</p>
                        <p><b>Phone:</b> {member.phone}</p>
                        <p><b>Plan:</b> {member.plan} Months</p>
                        <p><b>Join:</b> {new Date(member.joinDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* 🔹 FITNESS */}
                <div className="bg-white p-5 rounded-xl border">
                    <h2 className="font-bold mb-3">Fitness</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <p><b>Weight:</b> {member.weight || "-"}</p>
                        <p><b>Height:</b> {member.height || "-"}</p>
                        <p><b>Goal:</b> {member.fitnessGoal || "-"}</p>
                        <p><b>Health:</b> {member.healthIssues || "-"}</p>
                    </div>
                </div>

                {/* 🔹 TRAINER */}
                <div className="bg-white p-5 rounded-xl border">
                    <h2 className="font-bold mb-3">Trainer</h2>
                    <p>{member.hasTrainer ? member.trainerName : "No Trainer"}</p>
                </div>

                {/* 🔹 EXPIRY */}
                <div className="bg-white p-5 rounded-xl border">
                    <h2 className="font-bold mb-3">Expiry</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <p>
                            <b>Old:</b>{" "}
                            {member.oldExpiry
                                ? new Date(member.oldExpiry).toLocaleDateString("en-GB")
                                : "-"}
                        </p>

                        <p>
                            <b>New:</b>{" "}
                            {member.newExpiry
                                ? new Date(member.newExpiry).toLocaleDateString("en-GB")
                                : "-"}
                        </p>


                        <p><b>Status:</b> {summary.status}</p>
                        <p><b>Days Left:</b> {summary.daysLeft}</p>
                    </div>
                </div>

                {/* 🔹 SUMMARY */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-white p-3 text-center border rounded">
                        <p>Total Paid</p>
                        <b>₹{summary.totalPaid}</b>
                    </div>
                    <div className="bg-white p-3 text-center border rounded">
                        <p>Pending</p>
                        <b>₹{summary.totalPending}</b>
                    </div>
                    <div className="bg-white p-3 text-center border rounded">
                        <p>Payments</p>
                        <b>{summary.totalPayments}</b>
                    </div>
                    <div className="bg-white p-3 text-center border rounded">
                        <p>Status</p>
                        <b>{summary.status}</b>
                    </div>
                </div>

                {/* 🔹 PAYMENT HISTORY */}
                <div className="bg-white p-5 rounded-xl border">
                    <h2 className="font-bold mb-3">Payment History</h2>

                    {history.length === 0 ? (
                        <p className="text-gray-400">No payments</p>
                    ) : (
                        history.map((p, i) => (
                            <div key={i}
                                className="flex justify-between border p-3 mb-2 rounded">
                                <div>
                                    <p><b>₹{p.paidAmount}</b> / ₹{p.amount}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(p.date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p>{p.status}</p>
                                    {p.pendingAmount > 0 &&
                                        <p className="text-xs text-red-500">
                                            Pending ₹{p.pendingAmount}
                                        </p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default OwnerMemberDetails;
