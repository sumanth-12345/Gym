import { useEffect, useState } from "react";
import API from "../../api/api";

const DailyAttendanceAll = () => {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const res = await API.get(`/owner/attendance/daily/all?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Daily Attendance</h1>
                    <p className="text-sm text-gray-500 mt-1">View attendance by date</p>
                </div>

                <div className="mb-5">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Attendance for {date}</span>
                        <span className="text-xs text-gray-400">{attendance.length} records</span>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["#", "Member Name", "Status"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.length > 0 ? attendance.map((a, index) => (
                                    <tr key={a.memberId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm text-gray-400">{index + 1}</td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{a.name}</td>

                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium
                                        ${a.status === "Present" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-12 text-sm text-gray-400">No attendance data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyAttendanceAll;