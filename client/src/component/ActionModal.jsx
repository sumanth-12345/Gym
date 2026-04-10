// ActionModal.jsx
import { useState } from "react";
import API from "../api/api";

const modalConfig = {
    renew: { label: "Renew Membership", accent: "#2563eb", icon: "↻" },
    upgrade: { label: "Upgrade Plan", accent: "#7c3aed", icon: "⬆" },
    pay: { label: "Record Payment", accent: "#059669", icon: "₹" },
};

const ActionModal = ({ modal, setModal, refresh }) => {
    const [form, setForm] = useState({ amount: "", months: "" });
    const [loading, setLoading] = useState(false);

    if (!modal) return null;
    const config = modalConfig[modal.type] || {};

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (modal.type === "renew" || modal.type === "upgrade") {
                if (!form.amount || (modal.type === "upgrade" && !form.months)) {
                    return alert("Fill all required fields");
                }

                await API.post("/renew-or-upgrade", {
                    memberId: modal.memberId,
                    amount: Number(form.amount),
                    months: modal.type === "upgrade" ? Number(form.months) : undefined,
                    type: modal.type, // ✅ Pass the correct type
                });
            }

            if (modal.type === "pay") {
                if (!form.amount) return alert("Enter amount");
                await API.patch(`/owner/payments/pay/${modal.paymentId}`, {
                    payAmount: Number(form.amount),
                });
            }

            setModal(null);
            setForm({ amount: "", months: "" });
            refresh();
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
            <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#fff" }}>
                <div className="px-6 pt-6 pb-5" style={{ background: config.accent }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
                                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                                {config.icon}
                            </div>
                            <div>
                                <p className="text-xs text-white/70 uppercase tracking-widest font-medium">Action</p>
                                <h2 className="text-white font-semibold text-base leading-tight">{config.label}</h2>
                            </div>
                        </div>
                        <button onClick={() => setModal(null)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors text-sm">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-3">
                    {modal.type === "upgrade" && (
                        <Field
                            label="Months"
                            type="number"
                            placeholder="e.g. 3"
                            value={form.months}
                            onChange={(v) => setForm({ ...form, months: v })}
                            accent={config.accent}
                        />
                    )}

                    {(modal.type === "renew" || modal.type === "upgrade" || modal.type === "pay") && (
                        <Field
                            label="Amount (₹)"
                            type="number"
                            placeholder="e.g. 1500"
                            value={form.amount}
                            onChange={(v) => setForm({ ...form, amount: v })}
                            accent={config.accent}
                        />
                    )}

                    <button onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl text-white text-sm font-semibold mt-1 transition-opacity"
                        style={{ background: config.accent, opacity: loading ? 0.7 : 1 }}>
                        {loading ? "Processing..." : "Confirm"}
                    </button>

                    <button onClick={() => setModal(null)}
                        className="w-full py-2 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, type, placeholder, value, onChange, accent }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all"
            style={{ "--accent": accent }}
            onFocus={(e) => (e.target.style.borderColor = accent)}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
    </div>
);

export default ActionModal;