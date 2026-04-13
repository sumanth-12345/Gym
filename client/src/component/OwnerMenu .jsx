
// export default OwnerMenu;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaMoneyBill,
    FaClock,
    FaChartBar,

    FaDumbbell,
    FaUserTie,

    FaInbox
} from "react-icons/fa";
// import Inbox from "lucide-react";
import { MdOutlineFitnessCenter } from "react-icons/md";


const menu = [
    { title: "Home", path: "/owner/home", icon: <FaHome />, feature: null },

    { title: "Members List", path: "/owner/memberlist", icon: <FaUsers />, feature: "memberList" },

    { title: "Trainer Details", path: "/owner/trainerdetails", icon: <FaUserTie />, feature: "trainerList" },
    { name: "Requests", path: "/owner/requests", icon: <FaInbox size={18} /> }, // 🔥

    { title: "Plan", path: "/owner/planpage", icon: <MdOutlineFitnessCenter />, feature: "plan" },

    { title: "Payments", path: "/owner/payment", icon: <FaMoneyBill />, feature: "payments" },

    { title: "Expiring Members", path: "/owner/expiring", icon: <FaClock />, feature: "expiredMembers" },

    { title: "Active Members", path: "/owner/ActiveMembers", icon: <FaDumbbell />, feature: "activeMembers" },


    { title: "Reports", path: "/owner/reports", icon: <FaChartBar />, feature: "reports" },


    { title: "Profile", path: "/owner/profile", icon: <FaUserTie />, feature: null }
];

const OwnerMenu = ({ open, onItemClick }) => {
    const location = useLocation();


    const role = sessionStorage.getItem("role");

    return (
        <nav className="py-4 px-2 space-y-1">
            {menu
                .filter(item => {

                    // ✅ OWNER → FULL ACCESS (IMPORTANT FIX)
                    if (role === "owner") return true;




                    return false;
                })
                .map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onItemClick}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                                ${isActive
                                    ? "bg-white text-gray-900 font-semibold"
                                    : "text-white hover:bg-white/10"
                                }`}
                        >
                            <span className={`text-base flex-shrink-0 ${isActive ? "text-gray-900" : "text-white"}`}>
                                {item.icon}
                            </span>

                            {open && (
                                <span className="text-sm whitespace-nowrap">
                                    {item.title}
                                </span>
                            )}
                        </Link>
                    );
                })}
        </nav>
    );
};

export default OwnerMenu;