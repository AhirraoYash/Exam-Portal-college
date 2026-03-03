import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useSidebar } from "../context/SidebarContext";

const AdminLayout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { isOpen } = useSidebar();

    return (
        <div className="bg-gray-50 font-sans flex min-h-screen">
            {/* Sidebar renders ONCE — never remounts on page change */}
            <AdminSidebar />

            {/* Main content shifts smoothly when sidebar opens/closes */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>

                {/* Header */}
                <header className={`fixed top-0 h-16 flex items-center justify-between border-b bg-white px-8 z-40 transition-all duration-300 ${isOpen ? "left-64 w-[calc(100%-16rem)]" : "left-16 w-[calc(100%-4rem)]"}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-indigo-600 rounded-full" />
                        <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">
                            Welcome, <span className="font-semibold text-gray-800">{user?.name || "Admin"}</span>
                        </span>
                        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                    </div>
                </header>

                {/* Page content rendered here — changes on navigation */}
                <main className="flex-1 mt-16 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
