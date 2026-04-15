import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const REQUIRED_FIELDS = ["name", "phone", "joinDate", "fitnessGoal", "plan", "amount", "paymentStatus"];

const AddMember = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "", phone: "", password: "", plan: "",
        amount: "", paymentStatus: "", joinDate: "",
        hasTrainer: "No", trainerName: "",
        fitnessGoal: "", weight: "", height: "", healthIssues: ""
    });

    const [touched, setTouched] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setTouched({ ...touched, [e.target.name]: true });
    };

    const isInvalid = (field) =>
        touched[field] && REQUIRED_FIELDS.includes(field) && !formData[field];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Mark all required fields touched
        const allTouched = {};
        REQUIRED_FIELDS.forEach(f => (allTouched[f] = true));
        if (formData.hasTrainer === "Yes") allTouched.trainerName = true;
        setTouched(prev => ({ ...prev, ...allTouched }));

        // Validate
        const missing = REQUIRED_FIELDS.filter(f => !formData[f]);
        if (missing.length > 0) return setError("Please fill all required fields marked with *");
        if (!formData.password) return setError("Password is required");
        if (formData.hasTrainer === "Yes" && !formData.trainerName)
            return setError("Please enter trainer name");

        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            await API.post("/owner/addmember/add", {
                ...formData,
                trainer: formData.hasTrainer === "Yes" ? formData.trainerName : ""
            }, { headers: { Authorization: `Bearer ${token}` } });

            navigate("/owner/memberlist");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">

                {/* ── Page header ── */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Add New Member</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Fields marked <span className="text-red-500 font-bold">*</span> are required
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Section: Basic Info ── */}
                    <Section title="Basic Information" icon="👤">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name" required invalid={isInvalid("name")}>
                                <input name="name" value={formData.name}
                                    onChange={handleChange} placeholder="e.g. Ravi Kumar"
                                    className={input(isInvalid("name"))} />
                            </Field>

                            <Field label="Phone Number" required invalid={isInvalid("phone")}>
                                <input name="phone" value={formData.phone}
                                    onChange={handleChange} placeholder="e.g. 9876543210"
                                    className={input(isInvalid("phone"))} />
                            </Field>

                            <Field label="Password" invalid={false}>
                                <input type="password" name="password" value={formData.password}
                                    onChange={handleChange} placeholder="Set login password"
                                    className={input(false)} />
                            </Field>

                            <Field label="Join Date" required invalid={isInvalid("joinDate")}>
                                <input type="date" name="joinDate" value={formData.joinDate}
                                    onChange={handleChange}
                                    className={input(isInvalid("joinDate"))} />
                            </Field>
                        </div>
                    </Section>

                    {/* ── Section: Fitness ── */}
                    <Section title="Fitness Details" icon="💪">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Fitness Goal" required invalid={isInvalid("fitnessGoal")}
                                className="sm:col-span-2">
                                <select name="fitnessGoal" value={formData.fitnessGoal}
                                    onChange={handleChange}
                                    className={select(isInvalid("fitnessGoal"))}>
                                    <option value="">Select a goal</option>
                                    <option>Weight Loss </option>
                                    <option>Muscle Gain </option>
                                    <option>General Fitness </option>
                                    <option>Fat Burn </option>
                                    <option>Strength </option>
                                </select>
                            </Field>

                            <Field label="Weight (kg)">
                                <input name="weight" value={formData.weight}
                                    onChange={handleChange} placeholder="e.g. 72"
                                    className={input(false)} />
                            </Field>

                            <Field label="Height (cm)">
                                <input name="height" value={formData.height}
                                    onChange={handleChange} placeholder="e.g. 175"
                                    className={input(false)} />
                            </Field>

                            <Field label="Health Issues" className="sm:col-span-2">
                                <input name="healthIssues" value={formData.healthIssues}
                                    onChange={handleChange} placeholder="Any known conditions (optional)"
                                    className={input(false)} />
                            </Field>
                        </div>
                    </Section>

                    {/* ── Section: Trainer ── */}
                    <Section title="Trainer" icon="🏋️">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Trainer Required">
                                <div className="flex gap-3 pt-1">
                                    {["No", "Yes"].map(v => (
                                        <label key={v}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all
                                                ${formData.hasTrainer === v
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                                            <input type="radio" name="hasTrainer" value={v}
                                                checked={formData.hasTrainer === v}
                                                onChange={handleChange}
                                                className="hidden" />
                                            {v === "Yes" ? "✅ Yes" : "❌ No"}
                                        </label>
                                    ))}
                                </div>
                            </Field>

                            {formData.hasTrainer === "Yes" && (
                                <Field label="Trainer Name"
                                    invalid={touched.trainerName && !formData.trainerName}>
                                    <input name="trainerName" value={formData.trainerName}
                                        onChange={handleChange} placeholder="Trainer's name"
                                        className={input(touched.trainerName && !formData.trainerName)} />
                                </Field>
                            )}
                        </div>
                    </Section>

                    {/* ── Section: Plan & Payment ── */}
                    <Section title="Plan & Payment" icon="💳">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Plan Duration (Months)" required invalid={isInvalid("plan")}>
                                <select name="plan" value={formData.plan}
                                    onChange={handleChange}
                                    className={select(isInvalid("plan"))}>
                                    <option value="">Select months</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i} value={i + 1}>
                                            {i + 1} {i + 1 === 1 ? "Month" : "Months"}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Amount (₹)" required invalid={isInvalid("amount")}>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                                    <input type="number" name="amount" value={formData.amount}
                                        onChange={handleChange} placeholder="0"
                                        className={`${input(isInvalid("amount"))} pl-7`} />
                                </div>
                            </Field>

                            <Field label="Payment Status" required invalid={isInvalid("paymentStatus")}
                                className="sm:col-span-2">
                                <div className="flex gap-3">
                                    {[
                                        { value: "payment completed", label: "✅ Completed", active: "border-green-500 bg-green-50 text-green-700" },
                                        { value: "payment pending", label: "⏳ Pending", active: "border-amber-500 bg-amber-50 text-amber-700" },
                                    ].map(opt => (
                                        <label key={opt.value}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all
                                                ${formData.paymentStatus === opt.value
                                                    ? opt.active
                                                    : isInvalid("paymentStatus")
                                                        ? "border-red-300 text-gray-400"
                                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                                            <input type="radio" name="paymentStatus" value={opt.value}
                                                checked={formData.paymentStatus === opt.value}
                                                onChange={handleChange}
                                                className="hidden" />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                                {isInvalid("paymentStatus") && (
                                    <p className="text-xs text-red-500 mt-1">Please select payment status</p>
                                )}
                            </Field>
                        </div>
                    </Section>

                    {/* ── Error ── */}
                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                            <span className="text-red-500 text-sm">⚠</span>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-opacity"
                        style={{ background: loading ? "#93c5fd" : "#2563eb" }}>
                        {loading
                            ? <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Adding Member…
                            </span>
                            : "+ Add Member"}
                    </button>

                </form>
            </div>
        </div>
    );
};

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <span className="text-base">{icon}</span>
            <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, required, invalid, children, className = "" }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
            {required && <span className="text-red-500 text-sm leading-none">*</span>}
        </label>
        {children}
        {invalid && (
            <p className="text-xs text-red-500">This field is required</p>
        )}
    </div>
);

// ── Shared input/select styles ────────────────────────────────────────────────
const input = (invalid) =>
    `w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all
    ${invalid
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"}`;

const select = (invalid) =>
    `w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all bg-white
    ${invalid
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-gray-200 focus:border-blue-500 hover:border-gray-300"}`;

export default AddMember;