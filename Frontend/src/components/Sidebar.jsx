import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

// --- ICONS ---
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const TestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const ResultsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const { isOpen, toggle, open } = useSidebar();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/'); // Redirect to login
  };

  const activeClass =
    "flex items-center gap-4 px-4 py-3 mx-2 text-blue-600 bg-blue-50 border-r-4 md:border-r-0 md:border-l-4 border-blue-500 font-semibold rounded-lg shadow-sm";
  const inactiveClass =
    "flex items-center gap-4 px-4 py-3 mx-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-lg";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggle}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen bg-white shadow-xl border-r border-gray-200 z-50 transform transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Logo */}
          <div className={`flex items-center h-20 bg-blue-600 text-white border-b border-blue-700 px-4 flex-shrink-0 transition-all ${isOpen ? 'justify-between' : 'justify-center'}`}>
            <h1 className={`text-xl font-bold tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 md:hidden'}`}>
              MCQ Master
            </h1>

            {/* Collapse toggle (Desktop) */}
            <button
              onClick={toggle}
              className="hidden md:flex p-1 bg-blue-700 hover:bg-blue-800 rounded-lg transition text-white items-center justify-center flex-shrink-0"
            >
              {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={toggle}
              className="md:hidden p-1 hover:bg-blue-700 rounded transition flex-shrink-0"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow pt-6 space-y-2 overflow-y-auto overflow-x-hidden">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              title={!isOpen ? "Dashboard" : ""}
            >
              <DashboardIcon />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>Dashboard</span>
            </NavLink>

            <NavLink
              to="/results"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              title={!isOpen ? "Results" : ""}
            >
              <ResultsIcon />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>Results</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              title={!isOpen ? "My Profile" : ""}
            >
              <ProfileIcon />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>My Profile</span>
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex w-full items-center gap-3 rounded-lg bg-red-500 py-3 text-white hover:bg-red-600 transition-all ${isOpen ? 'justify-center px-4' : 'justify-center px-0'}`}
              title={!isOpen ? "Logout" : ""}
            >
              <LogoutIcon />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
