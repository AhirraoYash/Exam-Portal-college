import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from '../services/authService';
import { useSidebar } from "../context/SidebarContext";

// --- ICONS (using inline SVGs for zero-dep) ---
const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>);
const TestIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
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

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden" onClick={toggle} />
            )}

            <aside
                className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-gray-100 ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'}`}
                style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)' }}
            >
                {/* Sidebar Header */}
                <div className={`flex items-center h-16 border-b border-white/10 px-3 flex-shrink-0 ${isOpen ? 'justify-between' : 'justify-center'}`}>
                    {isOpen && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
                                <span className="text-white font-bold text-xs">E</span>
                            </div>
                            <span className="font-bold text-white text-sm whitespace-nowrap tracking-wide">EduTestify</span>
                        </div>
                    )}
                    {/* Desktop collapse */}
                    <button onClick={toggle}
                        className="hidden md:flex h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
                        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
                        {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </button>
                    {/* Mobile close */}
                    <button onClick={toggle} className="md:hidden h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0">
                        <ChevronLeftIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow pt-4 space-y-1 overflow-hidden">
                    {navItems.map((item) => {
                        const active = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                title={!isOpen ? item.label : ""}
                                className={`flex items-center mx-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${isOpen ? 'gap-3' : 'justify-center'} ${active
                                    ? 'bg-white/15 text-white font-semibold shadow-lg shadow-black/10'
                                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 w-0'}`}>
                                    {item.label}
                                </span>
                                {active && isOpen && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="border-t border-white/10 p-3 flex flex-col gap-2">
                    <Link to="/admin/add-teacher" title={!isOpen ? "Add Teacher" : ""}
                        className={`flex items-center rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-all py-2.5 px-3 shadow-lg shadow-violet-900/30 ${isOpen ? 'gap-3' : 'justify-center'}`}>
                        <AddUserIcon />
                        <span className={`text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 w-0'}`}>
                            Add Teacher
                        </span>
                    </Link>
                    <button onClick={handleLogout} title={!isOpen ? "Logout" : ""}
                        className={`flex w-full items-center rounded-xl bg-white/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all py-2.5 px-3 ${isOpen ? 'gap-3' : 'justify-center'}`}>
                        <LogoutIcon />
                        <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 w-0'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
