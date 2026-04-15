

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Header from "./Header";
import Sidebar from "./sidebar";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            const decoded = jwt_decode(token);
            setRole(decoded.role);
            setUser(JSON.parse(sessionStorage.getItem("user")));
        }
    }, []);

    return (
        // Layout.jsx
        <div className="flex h-screen bg-gray-100">

            {/* ── SIDEBAR ── */}
            <aside
                className={`flex flex-col flex-shrink-0 transition-all duration-300 bg-[#1A1D2E] border-r border-white/[0.08] ${sidebarOpen ? 'w-[220px]' : 'w-16'
                    }`}
            >
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} role={role} />
            </aside>

            {/* ── MAIN ── */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header
                    user={user}
                    role={role}
                    onLogout={() => { sessionStorage.clear(); window.location.href = '/login'; }}
                    onMenuClick={() => setSidebarOpen(prev => !prev)}
                />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>

    );
};

export default Layout;