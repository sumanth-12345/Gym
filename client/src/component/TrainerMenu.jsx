
// TrainerMenu.jsx

import { FaDumbbell, FaUsers } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";


const menu = [
    { title: "workout+deitfood", path: "/trainer/deitfood", icon: <FaDumbbell /> },
    { title: "Food", path: "/trainer/food", icon: <FaUsers /> },
    { title: "Trainer Member", path: "/trainer/member" }
];

const TrainerMenu = ({ open, onItemClick }) => {
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

export default TrainerMenu;