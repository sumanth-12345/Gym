

// Header.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useNavHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const backStack = useRef([]);
    const fwdStack = useRef([]);
    const skipNext = useRef(false);
    const prevPath = useRef(location.pathname);
    const [, tick] = useState(0);

    useEffect(() => {
        const current = location.pathname;
        if (skipNext.current) {
            skipNext.current = false;
            prevPath.current = current;
            tick(n => n + 1);
            return;
        }
        if (current !== prevPath.current) {
            backStack.current.push(prevPath.current);
            fwdStack.current = [];
            prevPath.current = current;
            tick(n => n + 1);
        }
    }, [location.pathname]);

    const goBack = useCallback(() => {
        if (!backStack.current.length) return;
        fwdStack.current.push(location.pathname);
        const dest = backStack.current.pop();
        skipNext.current = true;
        navigate(dest);
    }, [location.pathname, navigate]);

    const goForward = useCallback(() => {
        if (!fwdStack.current.length) return;
        backStack.current.push(location.pathname);
        const dest = fwdStack.current.pop();
        skipNext.current = true;
        navigate(dest);
    }, [location.pathname, navigate]);

    return {
        goBack,
        goForward,
        canBack: backStack.current.length > 0,
        canFwd: fwdStack.current.length > 0,
    };
};

const IconBtn = ({ onClick, disabled, title, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg
            transition-colors text-gray-500
            ${disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}
    >
        {children}
    </button>
);

export default function Header({ user, onLogout, onMenuClick }) {
    const { goBack, goForward, canBack, canFwd } = useNavHistory();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => window.location.reload(), 350);
    };

    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0">

            {/* Hamburger */}
            <IconBtn onClick={onMenuClick} title="Menu">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </IconBtn>

            {/* Back */}
            <IconBtn onClick={goBack} disabled={!canBack} title="Go back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15,18 9,12 15,6" />
                </svg>
            </IconBtn>

            {/* Forward */}
            <IconBtn onClick={goForward} disabled={!canFwd} title="Go forward">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6" />
                </svg>
            </IconBtn>

            {/* Refresh */}
            <IconBtn onClick={handleRefresh} title="Refresh">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                        transition: "transform 0.35s",
                        transform: refreshing ? "rotate(360deg)" : "none"
                    }}>
                    <polyline points="23,4 23,10 17,10" />
                    <path d="M20.49,15a9,9,0,1,1-2.12-9.36L23,10" />
                </svg>
            </IconBtn>

            {/* Breadcrumb */}
            <span className="hidden sm:block text-sm text-gray-400 truncate">
                Home / <strong className="text-gray-800 font-medium">Dashboard</strong>
            </span>

            <div className="flex-1" />

            {/* Notification */}
            <button className="relative w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* Avatar / Logout */}
            <div
                onClick={onLogout}
                title={`${user?.name} · Logout`}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white text-xs font-medium cursor-pointer flex-shrink-0"
            >
                {user?.name?.slice(0, 2).toUpperCase()}
            </div>
        </header>
    );
}