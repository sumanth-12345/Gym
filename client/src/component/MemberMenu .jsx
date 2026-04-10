
// MemberMenu.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineUser, AiOutlineVideoCamera, AiOutlineCreditCard, AiOutlineCalendar, AiOutlineQrcode, AiOutlineLogout, AiOutlineScan, AiOutlineUnorderedList } from "react-icons/ai";

const menu = [
    { title: "Member Profile", path: "/member/profile", icon: <AiOutlineUser size={18} /> },
    { title: "Diet Food", path: "/member/deitfood", icon: <AiOutlineVideoCamera size={18} /> },
    { title: "Plans", path: "/member/plan", icon: <AiOutlineUnorderedList size={18} /> },

    { title: "Payment History", path: "/member/payments", icon: <AiOutlineCreditCard size={18} /> },
    { title: "View Attendance", path: "/member/attendance", icon: <AiOutlineCalendar size={18} /> },
    { title: "QR Display", path: "/member/qr", icon: <AiOutlineQrcode size={18} /> },
    { title: "Scan QR", path: "/member/scan", icon: <AiOutlineScan size={18} /> },

    { title: "Logout", path: "/member/logout", icon: <AiOutlineLogout size={18} /> },
];

const MemberMenu = ({ open, onItemClick }) => {
    const location = useLocation();

    return (
        <nav className="py-4 px-2 space-y-1">
            {menu.map((item) => {
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
                        <span className={`flex-shrink-0 ${isActive ? "text-gray-900" : "text-white"}`}>
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

export default MemberMenu;