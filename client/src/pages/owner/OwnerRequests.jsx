import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const OwnerRequests = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const res = await API.get("/owner/requests");
        setRequests(res.data);
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Requests</h2>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {requests.map((r) => (
                        <tr
                            key={r._id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => navigate(`/owner/request/${r._id}`)}
                        >
                            <td>{r.memberId?.name}</td>
                            <td>₹{r.totalAmount}</td>
                            <td>{r.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OwnerRequests;