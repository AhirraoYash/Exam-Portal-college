import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, ChevronDown, ChevronUp, Mail, BookOpen, Calendar } from 'lucide-react';
import Loader from '../../components/Loader';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AllTeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedTeacher, setExpandedTeacher] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.token) throw new Error('Not authenticated');

                const res = await fetch(`${API_BASE_URL}/api/teachers/teachers-with-tests`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch teachers');
                setTeachers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    if (isLoading) return <Loader message="Loading teachers..." />;
    if (error) return (
        <div className="flex items-center justify-center h-64 text-red-500 font-medium">
            Error: {error}
        </div>
    );

    return (
        <div className="p-6 md:p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">All Teachers</h1>
                        <p className="text-gray-500 text-sm">{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} registered</p>
                    </div>
                </div>

                {/* Teachers List */}
                {teachers.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-16 text-center">
                        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-indigo-300" />
                        </div>
                        <p className="text-lg font-semibold text-gray-500">No teachers found</p>
                        <p className="text-sm text-gray-400 mt-1">Add teachers to see them listed here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {teachers.map((teacher, idx) => (
                            <motion.div
                                key={teacher._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                            >
                                {/* Teacher row */}
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedTeacher(expandedTeacher === teacher._id ? null : teacher._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow"
                                            style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)' }}>
                                            {teacher.name?.charAt(0).toUpperCase() || 'T'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-base leading-tight">{teacher.name}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Mail className="w-3.5 h-3.5" /> {teacher.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Test count badge */}
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                                            style={{ background: teacher.testCount > 0 ? '#ede9fe' : '#f3f4f6', color: teacher.testCount > 0 ? '#6d28d9' : '#9ca3af' }}>
                                            <FileText className="w-4 h-4" />
                                            {teacher.testCount} test{teacher.testCount !== 1 ? 's' : ''}
                                        </div>
                                        <span className="text-gray-400">
                                            {expandedTeacher === teacher._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded: Tests list */}
                                {expandedTeacher === teacher._id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-gray-100 bg-gray-50 px-5 py-4"
                                    >
                                        {teacher.tests.length === 0 ? (
                                            <p className="text-sm text-gray-400 text-center py-4">This teacher hasn't created any tests yet.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {teacher.tests.map((test) => (
                                                    <div key={test._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                                                        <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                                            style={{ background: '#ede9fe' }}>
                                                            <BookOpen className="w-4 h-4 text-violet-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-800 text-sm truncate">{test.name}</p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                <Calendar className="w-3 h-3" />
                                                                {test.date ? new Date(test.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No date'}
                                                            </p>
                                                            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                                                                {test.totalMarks} marks
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AllTeachersPage;
