import { useEffect, useState } from "react";
import API from "../../api/api"; // your axios file

const OwnerProfile = () => {
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const token = sessionStorage.getItem("token");

                const res = await API.get("/owner/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(res.data)

                setOwner(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOwner();
    }, []);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!owner) {
        return <div className="p-6 text-red-500">No data found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

                {/* Header */}
                <div className="flex items-center gap-4 border-b pb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                        {owner.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {owner.name}
                        </h2>
                        <p className="text-sm text-gray-500">{owner.email}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">{owner.phone}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Owner ID</p>
                        <p className="font-medium text-gray-800">{owner.id}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OwnerProfile;