import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "../context/SidebarContext";

const StudentLayout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { isOpen } = useSidebar();

    return (
        <div className="font-sans bg-gray-50 min-h-screen flex">
            {/* Sidebar renders ONCE — never remounts on page change */}
            <Sidebar />

            {/* Main content shifts smoothly when sidebar opens/closes */}
            <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-16'}`}>
                <Header studentName={user?.name || 'Student'} />

                {/* Page content rendered here — changes on navigation */}
                <main className="flex-1 mt-16 p-4 md:p-8 overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
