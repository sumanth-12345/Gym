import { useEffect, useState } from "react";
import API from "../../api/api";

const QrDisplay = () => {
    const [qrImage, setQrImage] = useState("");

    const fetchQR = async () => {
        try {
            const res = await API.get("/member/attendance/qr");
            setQrImage(res.data.qrImage);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchQR();
        const interval = setInterval(fetchQR, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-sm mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">QR Code</h1>
                    <p className="text-sm text-gray-500 mt-1">Show this at the gym entrance</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center gap-4">
                    {qrImage ? (
                        <>
                            <img src={qrImage} alt="QR Code" className="w-52 h-52 rounded-lg" />
                            <p className="text-xs text-gray-400 text-center">
                                Scan this QR to mark your attendance
                            </p>
                        </>
                    ) : (
                        <div className="w-52 h-52 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                            Loading QR...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrDisplay;