import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import testService from '../services/testService';
import submissionService from '../services/submissionService';

// --- ICONS ---
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
// --- NEW: Icon for the warning modal ---
const ExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


const MCQTestPage = () => {
    const navigate = useNavigate();
    const { testId } = useParams();
    
    // --- State Management ---
    const [testData, setTestData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [finalResult, setFinalResult] = useState(null);

    // --- NEW: State for Security Features ---
    const [fullscreenWarnings, setFullscreenWarnings] = useState(0);
    const [visibilityWarnings, setVisibilityWarnings] = useState(0);
    const [showWarningModal, setShowWarningModal] = useState(null); // Can be 'fullscreen' or 'visibility'

    // --- Test Submission Logic ---
    const handleSubmitTest = useCallback(async () => {
        if (finalResult) return; 

        setIsLoading(true);
        setShowSubmitModal(false);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
                questionId,
                selectedOption,
            }));
            const submissionData = { testId, answers: formattedAnswers };
            const user = JSON.parse(localStorage.getItem('user'));
            
            const resultData = await submissionService.submitTest(submissionData, user.token);
            setFinalResult(resultData); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit the test.');
        } finally {
            setIsLoading(false);
        }
    }, [answers, testId, finalResult]);

    // --- NEW: Fullscreen and Security Logic ---
    const enterFullscreen = useCallback(() => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(err => {
                // FIXED: Added backticks for template literal
                console.error(`Fullscreen request failed: ${err.message}`);
                alert("Please enable fullscreen mode to start the test.");
            });
        }
    }, []);

    useEffect(() => {
        if (finalResult) return;

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setFullscreenWarnings(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        alert("You have exited fullscreen mode 3 times. The test will now be submitted automatically.");
                        handleSubmitTest();
                    } else {
                        setShowWarningModal('fullscreen');
                    }
                    return newCount;
                });
            }
        };
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setVisibilityWarnings(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        alert("You have switched tabs 3 times. The test will now be submitted automatically.");
                        handleSubmitTest();
                    } else {
                        setShowWarningModal('visibility');
                    }
                    return newCount;
                });
            }
        };

        const preventAction = (e) => {
            e.preventDefault();
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', preventAction);
        document.addEventListener('copy', preventAction);
        document.addEventListener('paste', preventAction);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', preventAction);
            document.removeEventListener('copy', preventAction);
            document.removeEventListener('paste', preventAction);
        };
    }, [finalResult, handleSubmitTest]);


    // --- Fetch Test Data & Initial Fullscreen Request ---
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) throw new Error("Authentication required.");
                
                const data = await testService.getTestById(testId, user.token);
                setTestData(data);
                enterFullscreen();
                
                const [endHour, endMinute] = data.endTime.split(':').map(Number);
                const testDate = new Date(data.date);
                const endTime = new Date(testDate.getUTCFullYear(), testDate.getUTCMonth(), testDate.getUTCDate(), endHour, endMinute);
                const now = new Date();
                const remainingSeconds = Math.floor((endTime - now) / 1000);
                setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);

            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, [testId, enterFullscreen]);

    // --- Countdown Timer Logic ---
    useEffect(() => {
        if (finalResult || !testData || timeLeft <= 0) {
            if (testData && !finalResult) {
                alert("Time is up! Your test has been submitted automatically.");
                handleSubmitTest();
            }
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, testData, finalResult, handleSubmitTest]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        // FIXED: Added backticks for template literal
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (currentQuestionIndex < testData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSelectOption = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    if (isLoading) return <div className="p-8 text-center">Loading test...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    // --- Results View ---
    if (finalResult) {
        const { score, totalQuestions } = finalResult;
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans flex items-center justify-center">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl w-full">
                    <div className="rounded-2xl bg-white p-8 text-center shadow-2xl">
                        <h1 className="text-4xl font-extrabold text-gray-800">Test Completed!</h1>
                        <p className="mt-2 text-lg text-gray-600">Here's your performance for the {testData.name} test.</p>
                        <div className="mt-8">
                            <span className="text-6xl font-bold text-blue-600">{percentage}%</span>
                            <p className="mt-2 text-xl font-semibold text-gray-700">You scored {score} out of {totalQuestions}</p>
                        </div>
                    </div>
                    <div className="mt-10 text-center">
                        <button onClick={() => navigate('/dashboard')} className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105">Done</button>
                    </div>
                </motion.div>
            </div>
        );
    }
    
    if (!testData) return null;

    const progressPercentage = ((currentQuestionIndex + 1) / testData.questions.length) * 100;
    const currentQuestion = testData.questions[currentQuestionIndex];

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <header className="fixed top-0 left-0 right-0 flex items-center justify-between bg-white shadow-md px-8 py-4 z-50">
                <h1 className="text-2xl font-bold text-gray-800">{testData.name} Test</h1>
                <div className="flex items-center gap-3 bg-red-100 text-red-600 font-bold px-4 py-2 rounded-full">
                    <ClockIcon />
                    <span>Time Left: {formatTime(timeLeft)}</span>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-8 mt-20">
                <motion.div key={currentQuestion._id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
                    <h2 className="text-xl font-semibold text-gray-700">Question {currentQuestionIndex + 1} of {testData.questions.length}</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-6">
                        {/* FIXED: Added backticks for template literal */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-3xl font-medium text-gray-900 mb-8 min-h-[6rem]">{currentQuestion.questionText}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentQuestion.options.map((option, index) => (
                            // FIXED: Added backticks for template literal
                            <motion.button key={index} onClick={() => handleSelectOption(currentQuestion._id, option)} className={`p-5 rounded-lg border-2 text-left text-lg transition-all duration-200 ${answers[currentQuestion._id] === option ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' : 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                            </motion.button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-12 border-t pt-6">
                        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-8 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                        {currentQuestionIndex === testData.questions.length - 1 ? (
                            <button onClick={() => setShowSubmitModal(true)} className="px-10 py-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-lg transition-transform hover:scale-105">Submit Test</button>
                        ) : (
                            <button onClick={handleNext} className="px-10 py-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg transition-transform hover:scale-105">Next</button>
                        )}
                    </div>
                </motion.div>
            </main>

            <AnimatePresence>
                {showSubmitModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full mb-4 bg-green-100"><CheckCircleIcon /></div>
                            <h3 className="text-2xl font-bold text-gray-800">Ready to Submit?</h3>
                            <p className="text-gray-600 mt-2 mb-6">You have answered {Object.keys(answers).length} of {testData.questions.length} questions. You cannot change your answers after this.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowSubmitModal(false)} className="px-8 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button onClick={handleSubmitTest} className="px-8 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">Confirm & Submit</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {/* --- NEW: Fullscreen Warning Modal --- */}
                {showWarningModal === 'fullscreen' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full mb-4 bg-yellow-100"><ExclamationIcon /></div>
                            <h3 className="text-2xl font-bold text-gray-800">Warning!</h3>
                            <p className="text-gray-600 mt-2 mb-6">You have left fullscreen mode. Please re-enter to continue. You have {3 - fullscreenWarnings} warning(s) left.</p>
                            <button onClick={() => { setShowWarningModal(null); enterFullscreen(); }} className="w-full px-8 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600">Re-enter Fullscreen</button>
                        </motion.div>
                    </motion.div>
                )}
                 {/* --- NEW: Tab/Window Switch Warning Modal --- */}
                {showWarningModal === 'visibility' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full mb-4 bg-yellow-100"><ExclamationIcon /></div>
                            <h3 className="text-2xl font-bold text-gray-800">Warning!</h3>
                            <p className="text-gray-600 mt-2 mb-6">You have switched tabs. Please return to the test. You have {3 - visibilityWarnings} warning(s) left.</p>
                             <button onClick={() => { setShowWarningModal(null); }} className="w-full px-8 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600">I'm Back</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MCQTestPage;
