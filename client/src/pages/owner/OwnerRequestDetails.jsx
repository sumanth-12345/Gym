
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";

const OwnerRequestDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [mode, setMode] = useState("current");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await API.get(`/owner/request/${id}`);
        setData(res.data);
    };

    const handleAccept = async () => {
        await API.put(`/owner/accept/${id}`, {
            mode: mode
        });
        alert("Accepted");
        fetchData();
    };

    const handleReject = async () => {
        await API.put(`/owner/reject/${id}`);
        alert("Rejected");
        fetchData();
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="p-5 space-y-3">

            <h2 className="text-xl font-bold">Request Details</h2>

            {/* 🔥 DATE FIX */}
            <p>
                <b>Date:</b>{" "}
                {new Date(data.createdAt).toLocaleDateString()}
            </p>

            <p><b>Name:</b> {data.memberId?.name}</p>
            <p><b>Phone:</b> {data.memberId?.phone}</p>

            <p><b>Goal:</b> {data.planId?.fitnessplan}</p>
            <p><b>Duration:</b> {data.planId?.duration} Months</p>

            <p><b>Total:</b> ₹{data.totalAmount}</p>
            <p><b>Paid:</b> ₹{data.paidAmount}</p>
            <p><b>Pending:</b> ₹{data.pendingAmount}</p>

            {/* screenshot */}
            {data.screenshot && (
                <img
                    src={`http://localhost:4000/uploads/${data.screenshot}`}
                    className="w-64 border rounded"
                />
            )}

            {/* STATUS */}
            <p>
                <b>Status:</b>{" "}
                <span className={
                    data.status === "Accepted"
                        ? "text-green-600"
                        : data.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                }>
                    {data.status}
                </span>
            </p>
            <div className="mt-3">
                <p><b>Select Mode</b></p>

                <label>
                    <input
                        type="radio"
                        value="current"
                        checked={mode === "current"}
                        onChange={(e) => setMode(e.target.value)}
                    />
                    Current
                </label>

                <label className="ml-4">
                    <input
                        type="radio"
                        value="previous"
                        checked={mode === "previous"}
                        onChange={(e) => setMode(e.target.value)}
                    />
                    Previous
                </label>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">

                <button
                    onClick={handleAccept}
                    className="bg-green-600 text-white p-2 rounded"
                >
                    Accept
                </button>

                <button
                    onClick={handleReject}
                    className="bg-red-600 text-white p-2 rounded"
                >
                    Reject
                </button>

            </div>

        </div>
    );
};

export default OwnerRequestDetails;