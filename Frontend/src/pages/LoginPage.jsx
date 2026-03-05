import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, GraduationCap, ShieldCheck, BarChart3 } from 'lucide-react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

import collegeLogo from '/assets/INDIRA LOGO.png';

const features = [
    { icon: ShieldCheck, text: 'Secure & Proctored Exams' },
    { icon: GraduationCap, text: 'Instant Result Publishing' },
    { icon: BarChart3, text: 'Detailed Performance Analytics' },
];

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email address is required.';
        if (!password) newErrors.password = 'Password is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                const user = await authService.login({ email, password });
                if (user.role === 'teacher') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'student') {
                    if (user.status === 'pending') {
                        toast.error('Your account is pending approval. Please wait for an administrator to review your request.');
                        setIsLoading(false);
                        return;
                    }
                    if (user.status === 'rejected') {
                        toast.error('Your account registration was rejected. Please contact an administrator.');
                        setIsLoading(false);
                        return;
                    }
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } catch (error) {
                const message = (error.response?.data?.message) || error.message || error.toString();
                setApiError(message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full font-sans">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-start gap-16 p-12"
                style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #6d28d9 100%)' }}>

                {/* Animated orbs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' }} />
                    <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', animation: 'pulse 6s ease-in-out infinite 2s' }} />
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)', animation: 'pulse 5s ease-in-out infinite 1s' }} />
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Top: Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <GraduationCap className="w-6 h-6 text-violet-300" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-wide">EduTestify</span>
                </div>

                {/* Middle: Hero text */}
                <div className="relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-5">
                            The Future of<br />
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(90deg, #a78bfa, #f0abfc)' }}>
                                Online Examinations
                            </span>
                        </h1>
                        <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
                            Seamless, secure, and smart — a complete examination platform built for modern education.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-10 space-y-4">
                        {features.map(({ icon: Icon, text }, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.4)' }}>
                                    <Icon className="w-4 h-4 text-violet-300" />
                                </div>
                                <span className="text-indigo-200 font-medium">{text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom: stripped — logo moved to right panel */}
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-6 sm:p-6 bg-gray-50 min-h-screen lg:min-h-0">
                {/* Mobile top gradient banner */}
                <div className="lg:hidden w-full rounded-2xl mb-6 p-6 text-center"
                    style={{ background: 'linear-gradient(135deg, #1e1b4b, #6d28d9)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="w-6 h-6 text-violet-300" />
                        <span className="text-white font-bold text-lg">EduTestify</span>
                    </div>
                    <p className="text-indigo-200 text-sm">Secure Online Examination Portal</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Logo — top right on desktop, centered on mobile */}
                    <div className="flex justify-center lg:justify-end mb-5">
                        <img src={collegeLogo} alt="College Logo" className="h-14 sm:h-16" />
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome back</h2>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">Sign in to access your dashboard</p>
                        </div>

                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2"
                            >
                                <span className="block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                {apiError}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`block w-full pl-11 pr-4 py-3 rounded-xl border text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all duration-200 ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'}`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`block w-full pl-11 pr-11 py-3 rounded-xl border text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all duration-200 ${errors.password ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'}`}
                                        placeholder="Enter your password"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-2 w-full py-3.5 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                                style={{ background: isLoading ? '#6d28d9' : 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 24px rgba(109,40,217,0.35)' }}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Sign In <ArrowRight className="w-5 h-5" /></>)}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-bold text-violet-600 hover:text-violet-700 transition-colors">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;