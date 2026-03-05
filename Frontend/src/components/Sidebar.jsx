import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import authService from '../services/authService';

// --- ICONS ---
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const ResultsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const navItems = [
  { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { to: '/results', icon: <ResultsIcon />, label: 'Results' },
  { to: '/profile', icon: <ProfileIcon />, label: 'My Profile' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { isOpen, toggle } = useSidebar();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-white shadow-xl border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'}`}>

        {/* Brand Header */}
        <div className={`flex items-center h-16 bg-indigo-600 text-white border-b border-indigo-700 flex-shrink-0 px-3 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-sm whitespace-nowrap">Student Portal</span>
            </div>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={toggle}
            className="hidden md:flex h-8 w-8 rounded-lg bg-indigo-700 hover:bg-indigo-800 items-center justify-center text-white transition-colors flex-shrink-0"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
          {/* Mobile close */}
          <button onClick={toggle} className="md:hidden h-8 w-8 rounded-lg hover:bg-indigo-700 flex items-center justify-center text-white transition-colors flex-shrink-0">
            <ChevronLeftIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow pt-4 space-y-1 overflow-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={!isOpen ? item.label : ''}
              className={({ isActive }) =>
                `flex items-center mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${isOpen ? 'gap-3' : 'justify-center'} ${isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border-r-0'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : ''}`}>{item.icon}</span>
                  <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 w-0'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            title={!isOpen ? 'Logout' : ''}
            className={`flex w-full items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all py-2.5 px-3 ${isOpen ? 'gap-3' : 'justify-center'}`}
          >
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

export default Sidebar;
