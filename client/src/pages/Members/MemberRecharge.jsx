
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

const MemberRecharge = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const [plan, setPlan] = useState(null);
    const [paidAmount, setPaidAmount] = useState("");
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPlan();
    }, []);

    const fetchPlan = async () => {
        try {
            const res = await API.get(`/member/plan/${planId}`);
            setPlan(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load plan");
        }
    };

    const total = plan
        ? plan.hasTrainer === "Yes"
            ? plan.price + plan.trainerFee
            : plan.price
        : 0;

    const pending = total - Number(paidAmount || 0);

    const handleSubmit = async () => {
        if (!paidAmount || !file) {
            setError("Fill all fields");
            return;
        }

        if (Number(paidAmount) > total) {
            setError("Paid amount cannot exceed total");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("planId", planId);
            formData.append("totalAmount", total);
            formData.append("paidAmount", paidAmount);
            formData.append("screenshot", file);

            await API.post("/member/plan/payment", formData);

            // ✅ show success modal
            setShowModal(true);

        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!plan) return <p className="p-5">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-5">
            <div className="max-w-md mx-auto bg-white p-5 rounded-xl shadow space-y-4">

                <h2 className="text-xl font-bold text-center">Recharge Plan</h2>

                {/* PLAN INFO */}
                <div className="border rounded-lg p-3 text-sm space-y-1">
                    <p><b>Goal:</b> {plan.fitnessplan}</p>
                    <p><b>Duration:</b> {plan.duration} Months</p>
                    <p><b>Total:</b> ₹{total}</p>
                </div>

                {/* ERROR */}
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* INPUT */}
                <input
                    type="number"
                    placeholder="Enter Paid Amount"
                    className="border w-full p-2 rounded"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                />

                {/* LIVE PENDING */}
                {paidAmount && (
                    <p className="text-sm text-gray-500 text-center">
                        Pending: ₹{pending}
                    </p>
                )}

                {/* FILE */}
                <input
                    type="file"
                    className="w-full"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                {/* BUTTON */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Sending..." : "Send Request"}
                </button>
            </div>

            {/* 🔥 SUCCESS MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">

                        <h3 className="text-lg font-semibold mb-2">Success</h3>

                        <p className="text-sm text-gray-500 mb-4">
                            Request sent to owner
                        </p>

                        <button
                            onClick={() => {
                                setShowModal(false);

                                // ✅ choose one
                                navigate("/member/plan");
                                // navigate("/member/profile");
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberRecharge;