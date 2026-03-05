import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from '../services/authService';
import { useSidebar } from "../context/SidebarContext";

// --- ICONS ---
const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0 a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> </svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1 a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0 A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197M15 21a9 9 0 00-9-9" /> </svg>);
const TestIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7 a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3 m-6-4h.01M9 16h.01" /> </svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1 a3 3 0 01-3 3H6a3 3 0 01-3-3V7 a3 3 0 013-3h4a3 3 0 013 3v1" /> </svg>);
const AddUserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>);
const TeachersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const ChevronLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
const ChevronRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

const navItems = [
    { to: "/admin/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { to: "/admin/StudentApprovalsPage", icon: <UsersIcon />, label: "Student Approvals" },
    { to: "/admin/manage-tests", icon: <TestIcon />, label: "Manage Tests" },
    { to: "/admin/all-students", icon: <UsersIcon />, label: "All Students" },
    { to: "/admin/all-teachers", icon: <TeachersIcon />, label: "All Teachers" },
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isOpen, toggle, open } = useSidebar();

    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };

    const isActive = (path) =>
        location.pathname === path
            ? "bg-indigo-50 border-r-4 border-indigo-600 text-indigo-700 font-semibold"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800";

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-16"}`}
        >
            {/* Header */}
            <div className={`flex items-center border-b border-gray-100 h-16 px-3 ${isOpen ? "justify-between" : "justify-center"}`}>
                {isOpen && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="font-bold text-gray-800 text-sm whitespace-nowrap">Teacher Panel</span>
                    </div>
                )}
                <button
                    onClick={toggle}
                    className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0"
                    title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-grow pt-4 overflow-hidden">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => { if (!isOpen) open(); }}
                        title={!isOpen ? item.label : ""}
                        className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-all ${isActive(item.to)}`}
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span
                            className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
                        >
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className={`border-t border-gray-100 p-3 flex flex-col gap-2`}>
                <Link
                    to="/admin/add-teacher"
                    onClick={() => { if (!isOpen) open(); }}
                    title={!isOpen ? "Add Teacher" : ""}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <AddUserIcon />
                    <span
                        className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
                    >
                        Add Teacher
                    </span>
                </Link>

                <button
                    onClick={handleLogout}
                    title={!isOpen ? "Logout" : ""}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors w-full"
                >
                    <LogoutIcon />
                    <span
                        className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
