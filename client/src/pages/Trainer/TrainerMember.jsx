import { useEffect, useState } from "react";
import API from "../../api/api";

const TrainerMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const res = await API.get("/trainer/members", {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("API RESPONSE:", res.data);

            // ✅ FIX: take only members array
            setMembers(res.data.members || []);

        } catch (err) {
            console.error("FETCH MEMBERS ERROR:", err);
            setMembers([]); // safety fallback
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">My Members</h2>

            {loading ? (
                <p>Loading...</p>
            ) : members.length === 0 ? (
                <p>No Members Assigned</p>
            ) : (
                <table className="border w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Join Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(members) &&
                            members.map((m) => (
                                <tr key={m._id}>
                                    <td>{m.name}</td>
                                    <td>{m.phone}</td>
                                    <td>
                                        {m.joinDate
                                            ? new Date(m.joinDate).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TrainerMembers;