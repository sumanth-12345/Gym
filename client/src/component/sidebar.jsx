import MemberMenu from "./MemberMenu ";
import OwnerMenu from "./OwnerMenu ";
import TrainerMenu from "./TrainerMenu";

const Sidebar = ({ open, setOpen, role }) => {
    const handleClick = () => {
        if (window.innerWidth < 768) setOpen(false);
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed md:static top-0 left-0 h-full z-40 flex flex-col
                    bg-[#1A1D2E] transition-all duration-300
                    ${open ? "w-56" : "w-0 md:w-16"} overflow-hidden`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                        <span className="text-[#1A1D2E] text-sm font-bold">G</span>
                    </div>
                    {open && (
                        <span className="text-white text-sm font-semibold whitespace-nowrap">
                            GymPro
                        </span>
                    )}
                </div>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* {role === "owner"
                        ? <OwnerMenu open={open} onItemClick={handleClick} />
                        : <MemberMenu open={open} onItemClick={handleClick} />
                    } */}

                    {role === "owner" ? (
                        <OwnerMenu open={open} onItemClick={handleClick} />
                    ) : role === "trainer" ? (
                        <TrainerMenu open={open} onItemClick={handleClick} />
                    ) : (
                        <MemberMenu open={open} onItemClick={handleClick} />
                    )}
                </div>
            </aside>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
