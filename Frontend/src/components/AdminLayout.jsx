import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useSidebar } from "../context/SidebarContext";
import authService from "../services/authService";

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const AdminLayout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { isOpen, toggle } = useSidebar();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };

    return (
        <div className="bg-gray-50 font-sans flex min-h-screen">
            <AdminSidebar />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-16'}`}>
                {/* Header */}
                <header className={`fixed top-0 right-0 h-16 flex items-center justify-between border-b bg-white/95 backdrop-blur-sm px-4 md:px-6 z-40 shadow-sm transition-all duration-300 ${isOpen ? 'left-0 md:left-64' : 'left-0 md:left-16'}`}>
                    <div className="flex items-center gap-3">
                        {/* Mobile + collapsed toggle */}
                        <button onClick={toggle}
                            className={`h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors ${isOpen ? 'md:hidden' : 'flex'}`}
                            title="Toggle sidebar">
                            <MenuIcon />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #6d28d9, #4f46e5)' }} />
                            <h2 className="text-lg font-bold text-gray-800 hidden sm:block">EduTestify Admin</h2>
                            <h2 className="text-lg font-bold text-gray-800 sm:hidden">Admin</h2>
                        </div>
                    </div>

                    {/* Right: user info */}
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)' }}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="font-semibold text-gray-800 text-sm leading-tight">{user?.name || "Admin"}</p>
                                <p className="text-xs text-gray-500">Teacher</p>
                            </div>
                            <span className="text-gray-400 hidden md:block"><ChevronDown /></span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100">
                                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                    <p className="font-semibold text-gray-800 text-sm">{user?.name || "Admin"}</p>
                                    <p className="text-xs text-gray-500">Teacher Account</p>
                                </div>
                                <button onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 mt-16 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
