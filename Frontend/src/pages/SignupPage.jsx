import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, FileText, Lock, Eye, EyeOff, ArrowRight, Loader2, GraduationCap, CheckCircle2 } from 'lucide-react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

import collegeLogo from '/assets/INDIRA LOGO.png';

const steps = ['Personal Info', 'Credentials'];

const SignupPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        prn: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [step, setStep] = useState(0);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        if (errors[id]) {
            setErrors({ ...errors, [id]: '' });
        }
    };

    const validateStep0 = () => {
        const newErrors = {};
        const { name, prn, email } = formData;
        if (!name) newErrors.name = 'Full name is required.';
        if (!prn) newErrors.prn = 'PRN / Student ID is required.';
        if (!email) { newErrors.email = 'Email address is required.'; } else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Email address is invalid.'; }
        return newErrors;
    };

    const validateStep1 = () => {
        const newErrors = {};
        const { password, confirmPassword } = formData;
        if (!password) { newErrors.password = 'Password is required.'; } else if (password.length < 8) { newErrors.password = 'Password must be at least 8 characters.'; }
        if (!confirmPassword) { newErrors.confirmPassword = 'Please confirm your password.'; } else if (password !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match.'; }
        return newErrors;
    };

    const handleNext = () => {
        const errs = validateStep0();
        setErrors(errs);
        if (Object.keys(errs).length === 0) setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        const validationErrors = validateStep1();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                const { name, email, prn, password } = formData;
                await authService.register({ name, email, prn, password });
                toast.success('Registration successful! Please sign in.');
                navigate('/');
            } catch (error) {
                const message = (error.response?.data?.message) || error.message || error.toString();
                setApiError(message);
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full font-sans">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-start gap-16 p-12"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 35%, #312e81 70%, #4c1d95 100%)' }}>

                {/* Animated orbs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-15%] right-[-5%] w-96 h-96 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)', animation: 'pulse 5s ease-in-out infinite' }} />
                    <div className="absolute bottom-[-15%] left-[-5%] w-80 h-80 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', animation: 'pulse 7s ease-in-out infinite 2s' }} />
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
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-5">
                            Join our<br />
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(90deg, #c4b5fd, #f0abfc)' }}>
                                Academic Community
                            </span>
                        </h1>
                        <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
                            Register today to unlock access to secure online exams, instant results, and personalized performance tracking.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-10 space-y-4">
                        {['Create your student account in minutes', 'Await admin approval & start taking tests', 'Track your progress with detailed analytics'].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-violet-500/30 border border-violet-400/40 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-300" />
                                </div>
                                <span className="text-indigo-200 font-medium">{text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom: stripped — logo moved to right panel */}
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-6 sm:p-6 bg-gray-50 overflow-y-auto min-h-screen lg:min-h-0">
                {/* Mobile top gradient banner */}
                <div className="lg:hidden w-full rounded-2xl mb-6 p-6 text-center"
                    style={{ background: 'linear-gradient(135deg, #0f172a, #4c1d95)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="w-6 h-6 text-violet-300" />
                        <span className="text-white font-bold text-lg">EduTestify</span>
                    </div>
                    <p className="text-indigo-200 text-sm">Create your student account</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md my-4 sm:my-8"
                >
                    {/* Logo — top right on desktop, centered on mobile */}
                    <div className="flex justify-center lg:justify-end mb-5">
                        <img src={collegeLogo} alt="College Logo" className="h-14 sm:h-16" />
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                        <div className="mb-5 sm:mb-7">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Create Account</h2>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">Register as a new student</p>
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center gap-2 mb-7">
                            {steps.map((label, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                                            style={i <= step ? { background: 'linear-gradient(135deg, #6d28d9, #4f46e5)' } : {}}>
                                            {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                        </div>
                                        <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-violet-700' : 'text-gray-400'}`}>{label}</span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? 'bg-violet-500' : 'bg-gray-200'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {apiError && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                                <span className="block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                {apiError}
                            </motion.div>
                        )}

                        {/* Step 0: Personal Info */}
                        {step === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors"><User className="w-5 h-5" /></div>
                                        <input id="name" type="text" value={formData.name} onChange={handleInputChange}
                                            className={`block w-full pl-11 pr-4 py-3 rounded-xl border text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all ${errors.name ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-violet-100 focus:border-violet-400'}`}
                                            placeholder="First      Middle      Last" />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">PRN / Student ID</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors"><FileText className="w-5 h-5" /></div>
                                        <input id="prn" type="text" value={formData.prn} onChange={handleInputChange}
                                            className={`block w-full pl-11 pr-4 py-3 rounded-xl border text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all ${errors.prn ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-violet-100 focus:border-violet-400'}`}
                                            placeholder="Enter your PRN" />
                                    </div>
                                    {errors.prn && <p className="text-xs text-red-500 font-medium">{errors.prn}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors"><Mail className="w-5 h-5" /></div>
                                        <input id="email" type="email" value={formData.email} onChange={handleInputChange}
                                            className={`block w-full pl-11 pr-4 py-3 rounded-xl border text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all ${errors.email ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-violet-100 focus:border-violet-400'}`}
                                            placeholder="student@example.com" />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                                </div>

                                <button type="button" onClick={handleNext}
                                    className="mt-2 w-full py-3.5 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 24px rgba(109,40,217,0.35)' }}>
                                    Continue <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 1: Credentials */}
                        {step === 1 && (
                            <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-4" noValidate>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors"><Lock className="w-5 h-5" /></div>
                                        <input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange}
                                            className={`block w-full pl-11 pr-11 py-3 rounded-xl border text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all ${errors.password ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-violet-100 focus:border-violet-400'}`}
                                            placeholder="Min 8 characters" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors"><Lock className="w-5 h-5" /></div>
                                        <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange}
                                            className={`block w-full pl-11 pr-4 py-3 rounded-xl border text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all ${errors.confirmPassword ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-violet-100 focus:border-violet-400'}`}
                                            placeholder="Retype password" />
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
                                </div>

                                <div className="flex gap-3 mt-2">
                                    <button type="button" onClick={() => setStep(0)}
                                        className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
                                        Back
                                    </button>
                                    <button type="submit" disabled={isLoading}
                                        className="flex-1 py-3.5 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 24px rgba(109,40,217,0.35)' }}>
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Register <ArrowRight className="w-5 h-5" /></>)}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                Already have an account?{' '}
                                <Link to="/" className="font-bold text-violet-600 hover:text-violet-700 transition-colors">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignupPage;