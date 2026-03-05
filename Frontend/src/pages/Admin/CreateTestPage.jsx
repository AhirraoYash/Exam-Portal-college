import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { Upload, FileSpreadsheet, Calendar, Clock, CheckCircle, Save, X, AlertCircle, Download } from 'lucide-react';
import testService from '../../services/testService';

const CreateTestPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    const [testDetails, setTestDetails] = useState({
        name: '',
        marksPerQuestion: '',
        date: '',
        startTime: '',
        endTime: '',
    });
    const [questionFile, setQuestionFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setTestDetails(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setQuestionFile(e.target.files[0]);
        }
    };

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setQuestionFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!questionFile) {
            setError('Please upload a question file.');
            setIsLoading(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonQuestions = XLSX.utils.sheet_to_json(worksheet);

                if (jsonQuestions.length === 0) {
                    throw new Error("The Excel file is empty or formatted incorrectly.");
                }

                // --- Column Validation ---
                // Excel must have exactly these 6 columns (header names):
                // questionText | optionA | optionB | optionC | optionD | correctAnswer
                const requiredColumns = ['questionText', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer'];
                const actualColumns = Object.keys(jsonQuestions[0]);
                const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

                if (missingColumns.length > 0) {
                    throw new Error(
                        `Missing columns in Excel: ${missingColumns.join(', ')}.\n` +
                        `Your Excel must have these 6 column headers: questionText, optionA, optionB, optionC, optionD, correctAnswer`
                    );
                }

                // --- Row Validation ---
                const formattedQuestions = jsonQuestions.map((q, rowIdx) => {
                    const rowNum = rowIdx + 2; // +2 because row 1 is header, data starts at row 2
                    const options = [q.optionA, q.optionB, q.optionC, q.optionD];

                    // Check for empty cells
                    if (!q.questionText || !q.questionText.toString().trim()) {
                        throw new Error(`Row ${rowNum}: Question text is empty.`);
                    }
                    options.forEach((opt, i) => {
                        if (opt === undefined || opt === null || opt.toString().trim() === '') {
                            throw new Error(`Row ${rowNum}: Option ${String.fromCharCode(65 + i)} is empty.`);
                        }
                    });
                    if (!q.correctAnswer || !q.correctAnswer.toString().trim()) {
                        throw new Error(`Row ${rowNum}: Correct answer is empty.`);
                    }

                    const answerText = q.correctAnswer.toString().trim();
                    const optionTexts = options.map(opt => opt.toString().trim());

                    // Validate that the answer matches one of the options
                    if (!optionTexts.includes(answerText)) {
                        throw new Error(
                            `Row ${rowNum}: Answer "${answerText}" does not match any of the 4 options.`
                        );
                    }

                    return {
                        questionText: q.questionText.toString().trim(),
                        options: optionTexts,
                        correctAnswer: answerText,
                    };
                });

                const totalMarks = formattedQuestions.length * parseInt(testDetails.marksPerQuestion, 10);

                const finalTestData = {
                    ...testDetails,
                    questions: formattedQuestions,
                    totalMarks: totalMarks,
                };

                const user = JSON.parse(localStorage.getItem('user'));
                await testService.createTest(finalTestData, user.token);

                toast.success('Test created successfully!');
                navigate('/admin/dashboard'); // Redirect after success

            } catch (err) {
                const message = (err.response?.data?.message) || err.message || err.toString();
                setError(message);
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsBinaryString(questionFile);
    };

    return (
        <div className="p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Create New Test</h2>
                        <p className="text-gray-500 mt-1">Configure test details and upload questions.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-8 space-y-8">
                            {/* Error Banner */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Section 1: Test Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <FileSpreadsheet className="w-4 h-4" />
                                    </div>
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Test Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={testDetails.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                            placeholder="e.g. Mid-Term Mathematics"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label htmlFor="marksPerQuestion" className="block text-sm font-semibold text-gray-700 mb-2">Marks per Question</label>
                                        <input
                                            type="number"
                                            id="marksPerQuestion"
                                            value={testDetails.marksPerQuestion}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                            placeholder="e.g. 1"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            {/* Section 2: Scheduling */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    Schedule & Timing
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                        <input
                                            type="date"
                                            id="date"
                                            value={testDetails.date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="time"
                                                id="startTime"
                                                value={testDetails.startTime}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="endTime" className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="time"
                                                id="endTime"
                                                value={testDetails.endTime}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            {/* Section 3: File Upload */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        Upload Questions
                                    </h3>
                                    <a
                                        href="/mcq_template_with_full_answers.xlsx"
                                        download="mcq_template.xlsx"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Template
                                    </a>
                                </div>
                                <div
                                    className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-2 text-center">
                                        <div className="mx-auto h-12 w-12 text-gray-400">
                                            {questionFile ? <FileSpreadsheet className="h-12 w-12 text-green-500" /> : <Upload className="h-12 w-12" />}
                                        </div>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">Excel (.xlsx) files only</p>
                                        {questionFile && (
                                            <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-lg inline-flex items-center gap-2 text-sm font-medium">
                                                <CheckCircle className="w-4 h-4" />
                                                {questionFile.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 20px rgba(109,40,217,0.3)' }}
                            >
                                <Save className="w-4 h-4" />
                                {isLoading ? 'Creating Test...' : 'Create Test'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateTestPage;