import { useEffect, useState } from "react";
import API from "../../api/api";

const FEATURE_LABELS = {
    memberList: "Members List",
    payments: "Payments",
    memberAdd: "Add Member",
    expiredMembers: "Expiring Members",
    activeMembers: "Active Members",
    trainerList: "Trainer Details"
};

const StaffProfile = () => {
    const [staff, setStaff] = useState(null);

    const fetchProfile = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const res = await API.get("/staff/me", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStaff(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (!staff) return <p>Loading...</p>;

    return (
        <div className="p-6">

            <h2 className="text-xl font-bold mb-4">Staff Profile</h2>

            <p><b>Name:</b> {staff.name}</p>
            <p><b>Phone:</b> {staff.phone}</p>

            <h3 className="mt-4 font-semibold">Access:</h3>

            {staff.features.length === 0 ? (
                <p>No Access</p>
            ) : (
                <ul>
                    {staff.features.map(f => (
                        <li key={f}>• {FEATURE_LABELS[f] || f}</li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default StaffProfile;