import { useNavigate } from "react-router-dom";

const MemberLogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all session data
        sessionStorage.clear();

        // Redirect to login page
        navigate("/login", { replace: true });
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            Logout
        </button>
    );
};

export default MemberLogoutButton;