import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import authService from '../services/authService';

// --- ICONS ---
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const Header = ({ studentName }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { isOpen, toggle } = useSidebar();

    const handleProfile = () => {
        navigate('/profile');
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    // Get profile photo from localStorage if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <header className={`fixed top-0 right-0 h-16 flex items-center justify-between border-b bg-white/95 backdrop-blur-sm px-4 md:px-6 z-40 shadow-sm transition-all duration-300 ${isOpen ? 'left-64' : 'left-0 md:left-16'}`}>
            {/* Left: Menu toggle + page title */}
            <div className="flex items-center gap-3">
                {/* Always visible toggle on both mobile & collapsed desktop */}
                <button
                    onClick={toggle}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors ${isOpen ? 'md:hidden' : 'flex'}`}
                    title="Toggle sidebar"
                >
                    <MenuIcon />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #6d28d9, #4f46e5)' }} />
                    <h2 className="text-lg font-bold text-gray-800 hidden sm:block">EduTestify Student</h2>
                    <h2 className="text-lg font-bold text-gray-800 sm:hidden">Student</h2>
                </div>
            </div>

            {/* Right: Profile */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                            {studentName ? studentName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="font-semibold text-gray-800 text-sm leading-tight">{studentName}</p>
                            <p className="text-xs text-gray-500">Student</p>
                        </div>
                        <span className="text-gray-400 hidden md:block"><ChevronDownIcon /></span>
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100"
                            >
                                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                    <p className="font-semibold text-gray-800 text-sm">{studentName}</p>
                                    <p className="text-xs text-gray-500">Student Account</p>
                                </div>
                                <button
                                    onClick={handleProfile}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                >
                                    My Profile
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
