import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../../api/api";

const ScanQR = ({ onScanSuccess }) => {
    const scannerRef = useRef(null);
    const isRunningRef = useRef(false);
    const scannedRef = useRef(false); // ✅ track if we already scanned

    useEffect(() => {
        scannerRef.current = new Html5Qrcode("reader");

        scannerRef.current
            .start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    if (scannedRef.current) return; // ✅ prevent multiple triggers
                    scannedRef.current = true;

                    try {
                        const token = sessionStorage.getItem("token");
                        await API.post(
                            "/member/attendance/scan-qr",
                            { qr: decodedText },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        // stop scanner
                        if (isRunningRef.current) {
                            await scannerRef.current.stop();
                            scannerRef.current.clear();
                            isRunningRef.current = false;
                        }

                        if (onScanSuccess) onScanSuccess(); // refresh table

                    } catch (err) {
                        console.error("Invalid or expired QR", err);
                        // no alert
                        if (isRunningRef.current) {
                            await scannerRef.current.stop();
                            scannerRef.current.clear();
                            isRunningRef.current = false;
                        }
                    }
                },
                (error) => console.warn(error)
            )
            .then(() => {
                isRunningRef.current = true;
            });

        return () => {
            if (isRunningRef.current) {
                scannerRef.current.stop().catch(() => { });
                scannerRef.current.clear();
                isRunningRef.current = false;
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-sm mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Scan QR</h1>
                    <p className="text-sm text-gray-500 mt-1">Point camera at the QR code</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center gap-4">
                    <div
                        id="reader"
                        className="w-full rounded-lg overflow-hidden border border-gray-100"
                        style={{ minHeight: "280px" }}
                    />
                    <p className="text-xs text-gray-400 text-center">
                        Make sure camera permission is allowed
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ScanQR;