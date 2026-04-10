import { useState, useEffect } from "react";
import API from "../../api/api";
import ScanQR from "./ScanQR"; // Your QR scanning component

const GymAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScanner, setShowScanner] = useState(false);

    // Fetch attendance for this member
    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await API.get("/member/attendance/view");
            setAttendanceData(res.data);
        } catch (err) {
            console.error("Fetch attendance error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">My Attendance</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your daily gym visits</p>
                </div>

                {/* Scan Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Scan QR to Mark Attendance
                    </button>
                </div>

                {/* Scanner */}
                {showScanner && (
                    <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6 flex justify-center">
                        <ScanQR
                            onScanSuccess={() => { setShowScanner(false); fetchAttendance(); }}
                            onClose={() => setShowScanner(false)}
                        />
                    </div>
                )}

                {/* Table Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Daily Attendance</span>
                        <span className="text-xs text-gray-400">{attendanceData.length} records</span>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map((a, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm text-gray-700">{a.date}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium
                                        ${a.state === "Present"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-600"}`}>
                                                {a.state}
                                            </span>
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

export default GymAttendance;