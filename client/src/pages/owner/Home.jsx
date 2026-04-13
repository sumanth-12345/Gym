import { useEffect, useState } from "react";
import API from "../../api/api";

const Home = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = sessionStorage.getItem("token");

                const res = await API.get("/owner/home", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setData(res.data || {});
            } catch (err) {
                console.log(err);
                setData({});
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <Card title="Total Members" value={data.totalMembers} />
                    <Card title="Active Members" value={data.activeMembers} />
                    <Card title="Expired Members" value={data.expiredMembers} />
                    <Card title="Total Plans" value={data.totalPlans} />

                    <Card title="Total Revenue" value={`₹${data.totalRevenue || 0}`} />
                    <Card title="Monthly Revenue" value={`₹${data.monthlyRevenue || 0}`} />
                    <Card title="Today Revenue" value={`₹${data.todayRevenue || 0}`} />
                    <Card title="Pending Amount" value={`₹${data.totalPendingAmount || 0}`} />

                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value }) => (
    <div className="bg-white p-5 rounded-xl shadow border">
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value || 0}</h2>
    </div>
);

export default Home;