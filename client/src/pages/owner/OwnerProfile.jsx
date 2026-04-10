

import { useEffect, useState } from "react";
import API from "../../api/api";

const FEATURES = [
    { key: "memberAdd", label: "Add Member" },
    { key: "memberList", label: "Members List" },
    { key: "payments", label: "Payments" },
    { key: "expiredMembers", label: "Expiring Members" },
    { key: "activeMembers", label: "Active Members" },
    { key: "trainerList", label: "Trainer Details" }
];

const OwnerProfile = () => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [features, setFeatures] = useState([]);

    const fetchStaff = async () => {
        const token = sessionStorage.getItem("token");

        const res = await API.get("/staff/all", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setStaffList(res.data);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleFeatureChange = (key) => {
        if (features.includes(key)) {
            setFeatures(features.filter(f => f !== key));
        } else {
            setFeatures([...features, key]);
        }
    };

    const giveAccess = async () => {
        if (!selectedStaff) {
            alert("Select staff first");
            return;
        }

        const token = sessionStorage.getItem("token");

        await API.put(`/staff/permissions/${selectedStaff}`, {
            features
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Access Updated");
    };

    const removeAccess = async () => {
        if (!selectedStaff) {
            alert("Select staff first");
            return;
        }

        const token = sessionStorage.getItem("token");

        await API.put(`/staff/permissions/${selectedStaff}`, {
            features: []
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Access Removed");
    };

    return (
        <div className="p-6">

            <h2 className="text-xl font-bold mb-4">Staff Access Control</h2>

            {/* SELECT STAFF */}
            <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="border p-2 mb-4"
            >
                <option value="">Select Staff</option>
                {staffList.map(s => (
                    <option key={s._id} value={s._id}>
                        {s.name}
                    </option>
                ))}
            </select>

            {/* FEATURES */}
            <div className="mb-4">
                {FEATURES.map(f => (
                    <label key={f.key} className="block">
                        <input
                            type="checkbox"
                            checked={features.includes(f.key)}
                            onChange={() => handleFeatureChange(f.key)}
                        />
                        {f.label}
                    </label>
                ))}
            </div>

            {/* BUTTONS */}
            <div className="space-x-3">
                <button onClick={giveAccess} className="bg-green-500 text-white px-4 py-2">
                    Give Access
                </button>

                <button onClick={removeAccess} className="bg-red-500 text-white px-4 py-2">
                    Remove Access
                </button>
            </div>
        </div>
    );
};

export default OwnerProfile;