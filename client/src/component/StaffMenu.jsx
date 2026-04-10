
import { Link } from "react-router-dom";
import useAccess from "../hooks/useAccess";

const StaffMenu = () => {
    const { hasAccess } = useAccess();

    return (
        <div className="p-4 space-y-2">

            {hasAccess("memberList") && (
                <Link to="/members" className="block p-2 bg-gray-100 rounded">
                    Member List
                </Link>
            )}

            {hasAccess("memberRegistration") && (
                <Link to="/add-member" className="block p-2 bg-gray-100 rounded">
                    Add Member
                </Link>
            )}

            {hasAccess("payments") && (
                <Link to="/payments" className="block p-2 bg-gray-100 rounded">
                    Payments
                </Link>
            )}

            {hasAccess("expiredMembers") && (
                <Link to="/expired" className="block p-2 bg-gray-100 rounded">
                    Expired Members
                </Link>
            )}

            {hasAccess("activeMembers") && (
                <Link to="/active" className="block p-2 bg-gray-100 rounded">
                    Active Members
                </Link>
            )}

            {hasAccess("trainerList") && (
                <Link to="/trainers" className="block p-2 bg-gray-100 rounded">
                    Trainer List
                </Link>
            )}

        </div>
    );
};

export default StaffMenu;