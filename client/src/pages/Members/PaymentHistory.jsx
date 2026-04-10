import { useEffect, useState } from "react";
import API from "../../api/api";

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);

    const fetchPayments = async () => {
        try {
            const res = await API.get("/member/payments");

            // latest first
            const sorted = res.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setPayments(sorted);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Payment History</h1>
                    <p className="text-sm text-gray-500 mt-1">All your past transactions</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Transactions</span>
                        <span className="text-xs text-gray-400">{payments.length} records</span>
                    </div>

                    {payments.length === 0 ? (
                        <div className="py-16 text-center text-sm text-gray-400">No payments yet</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["#", "Amount", "Plan", "Type", "Status", "Date"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p, i) => (
                                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm text-gray-400">{i + 1}</td>
                                        <td className="px-5 py-3.5 text-sm font-semibold text-blue-600">₹{p.amount}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-600">{p.planSnapshot || "—"}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-600 capitalize">{p.type}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium
                                        ${p.status === "completed" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-gray-400">
                                            {new Date(p.date).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;