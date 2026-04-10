import { useEffect, useState } from "react";

import API from "../../api/api";

const MemberProfile = () => {
    // const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/member/me");
            setProfile(res.data);
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
    </div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Your membership details</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Name", value: profile.name },
                            { label: "Phone", value: profile.phone },
                            { label: "Plan", value: profile.plan },
                            { label: "Amount", value: profile.amount && `₹${profile.amount}` },
                            { label: "Trainer", value: profile.trainer || "No" },
                            { label: "Fitness Goal", value: profile.fitnessGoal },
                            { label: "Weight", value: profile.weight ? `${profile.weight} kg` : "—" },
                            { label: "Height", value: profile.height ? `${profile.height} cm` : "—" },
                            { label: "Health Issues", value: profile.healthIssues || "—" },
                            { label: "Join Date", value: profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : "—" },
                            { label: "Expiry Date", value: profile.expiryDate ? new Date(profile.expiryDate).toLocaleDateString() : "—" },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg px-4 py-3.5 border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                                <p className="text-sm font-semibold text-gray-800 mt-1">{item.value}</p>
                            </div>
                        ))}

                        {/* Days Left — full width */}
                        <div className="sm:col-span-2 rounded-lg px-4 py-3.5 border border-gray-100 bg-gray-50 flex items-center justify-between">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Days Left</p>
                            <p className={`text-lg font-bold ${profile.daysLeft > 0 ? "text-green-600" : "text-red-500"}`}>
                                {profile.daysLeft > 0 ? `${profile.daysLeft} days` : "Expired"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;