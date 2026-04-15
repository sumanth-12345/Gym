import { useEffect, useState } from "react";
import API from "../../api/api";

const MemberDiet = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const res = await API.get("/workout-diet/member-diet", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlans(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return <p style={{ padding: "1.5rem", color: "#888" }}>Loading...</p>;
    if (plans.length === 0) return <p style={{ padding: "1.5rem", color: "#888" }}>No diet plans found.</p>;

    return (
        <div style={{ padding: "1.5rem 1rem" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 500, margin: 0, color: "#111" }}>
                    My Workout & Diet Plan
                </h2>
                <span style={{
                    fontSize: "12px", fontWeight: 500, padding: "3px 10px",
                    borderRadius: "20px", background: "#E1F5EE", color: "#0F6E56"
                }}>
                    {plans.length} Days
                </span>
            </div>

            {/* Table */}
            <div style={{
                borderRadius: "12px",
                border: "0.5px solid #e0e0e0",
                overflow: "hidden"
            }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                        <thead>
                            <tr style={{ background: "#E1F5EE" }}>
                                {["Day", "Workout", "Breakfast", "Lunch", "Snack", "Dinner"].map((col) => (
                                    <th key={col} style={{
                                        padding: "13px 16px",
                                        textAlign: "left",
                                        fontWeight: 500,
                                        fontSize: "12px",
                                        color: "#0F6E56",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                        borderBottom: "1px solid #9FE1CB",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan, i) => (
                                <tr key={plan._id} style={{
                                    borderBottom: i < plans.length - 1 ? "0.5px solid #eee" : "none",
                                    transition: "background 0.15s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f7f7f5"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "14px 16px", borderRight: "0.5px solid #eee" }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center",
                                            background: "#E1F5EE", color: "#0F6E56",
                                            fontSize: "12px", fontWeight: 500,
                                            padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap"
                                        }}>
                                            Day {plan.order}
                                        </span>
                                    </td>
                                    {[plan.workout, plan.breakfast, plan.lunch, plan.snack, plan.dinner].map((val, j) => (
                                        <td key={j} style={{
                                            padding: "14px 16px",
                                            color: "#555",
                                            verticalAlign: "top",
                                            lineHeight: 1.5,
                                            borderRight: j < 4 ? "0.5px solid #eee" : "none"
                                        }}>
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MemberDiet;