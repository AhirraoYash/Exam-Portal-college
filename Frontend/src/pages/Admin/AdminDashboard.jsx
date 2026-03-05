import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, FileText, Clock, ArrowRight, TrendingUp, Activity, PlusCircle, Trash2, Image, BookOpen } from "lucide-react";
import teacherService from "../../services/teacherService";
import testService from "../../services/testService";
import Footer from "../../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const actionIconMap = {
    'Created Test': <PlusCircle className="w-4 h-4 text-green-500" />,
    'Deleted Test': <Trash2 className="w-4 h-4 text-red-500" />,
    'Updated Profile Photo': <Image className="w-4 h-4 text-blue-500" />,
    'default': <BookOpen className="w-4 h-4 text-gray-400" />,
};

const actionColorMap = {
    'Created Test': 'bg-green-50 border-green-100',
    'Deleted Test': 'bg-red-50 border-red-100',
    'Updated Profile Photo': 'bg-blue-50 border-blue-100',
    'default': 'bg-gray-50 border-gray-100',
};

function timeAgo(dateStr) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const StatCard = ({ title, value, icon: Icon, color, linkTo, trend }) => (
    <Link to={linkTo} className="block group">
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16 bg-${color}-500 transition-transform group-hover:scale-110`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" /> {trend}
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-4xl font-extrabold text-gray-800 tracking-tight">{value}</p>
            </div>
            <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                View Details <ArrowRight className="w-4 h-4 ml-1" />
            </div>
        </motion.div>
    </Link>
);

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [stats, setStats] = useState({ pendingApprovals: 0, totalStudents: 0, totalTests: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activityLoading, setActivityLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) throw new Error("You must be logged in as a teacher.");

                const [studentsData, testsData] = await Promise.all([
                    teacherService.getStudents(user.token),
                    testService.getTests(user.token)
                ]);

                const pendingCount = studentsData.filter(s => s.status === 'pending').length;
                setStats({
                    pendingApprovals: pendingCount,
                    totalStudents: studentsData.length,
                    totalTests: testsData.length,
                });
            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        const fetchActivity = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.token) return;
                const res = await fetch(`${API_BASE_URL}/api/audit/recent`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const data = await res.json();
                if (res.ok) setRecentActivity(data);
            } catch (_) {
                // Activity is non-critical — fail silently
            } finally {
                setActivityLoading(false);
            }
        };

        fetchDashboardData();
        fetchActivity();
    }, []);

    if (isLoading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading dashboard...</div>;
    if (error) return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={Clock} color="yellow"
                        linkTo="/admin/StudentApprovalsPage" trend={stats.pendingApprovals > 0 ? "Action Required" : "All Caught Up"} />
                    <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="green"
                        linkTo="/admin/all-students" trend="+Active" />
                    <StatCard title="Total Tests Created" value={stats.totalTests} icon={FileText} color="blue"
                        linkTo="/admin/manage-tests" trend="Active" />
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            Recent Activity
                        </h3>
                        {recentActivity.length > 0 && (
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                Last {recentActivity.length} actions
                            </span>
                        )}
                    </div>

                    {activityLoading ? (
                        <div className="p-10 text-center text-gray-400 text-sm">Loading activity...</div>
                    ) : recentActivity.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <div className="mx-auto w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Activity className="w-7 h-7 text-gray-300" />
                            </div>
                            <p className="text-base font-medium text-gray-500">No recent activity yet</p>
                            <p className="text-sm mt-1">Actions like creating or deleting tests will appear here.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {recentActivity.map((log, i) => {
                                const icon = actionIconMap[log.action] || actionIconMap['default'];
                                const colorClass = actionColorMap[log.action] || actionColorMap['default'];
                                return (
                                    <motion.li
                                        key={log._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className={`mt-0.5 h-8 w-8 rounded-full border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                            {icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">{log.action}
                                                {log.targetName && (
                                                    <span className="font-normal text-gray-600"> — <span className="font-medium text-indigo-700">{log.targetName}</span></span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">by <span className="font-medium text-gray-700">{log.actorName}</span></p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{timeAgo(log.createdAt)}</span>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </motion.div>

            <div className="mt-10">
                <Footer />
            </div>
        </div>
    );
};

export default AdminDashboard;