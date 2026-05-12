'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, Maximize2 } from 'lucide-react';

const SAMPLE_QUESTIONS = [
    { _id: '1', question: 'What is the full form of HTML?', options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperText Marking Links', 'HyperLink Text Markup'], level: 'Beginner' },
    { _id: '2', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], level: 'Beginner' },
    { _id: '3', question: 'What is 15 * 6?', options: ['80', '90', '100', '75'], level: 'Beginner' }
];

export default function TestPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>(SAMPLE_QUESTIONS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(900); // Default 15 mins
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [cheatingAttempts, setCheatingAttempts] = useState(0);

    // Fetch questions
    useEffect(() => {
        const level = localStorage.getItem('difficultyLevel') || 'Beginner';

        // Set time based on level
        if (level === 'Intermediate') setTimeLeft(1500);
        if (level === 'Advanced') setTimeLeft(2400);

        fetch(`/api/questions?level=${level}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setQuestions(data);
                setLoading(false);
            })
            .catch(() => {
                console.log("Using sample questions for layout demo");
                setLoading(false);
            });
    }, [router]);

    // Anti-cheat: Tab Switch
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !submitted) {
                setCheatingAttempts(prev => prev + 1);
                alert("Warning: Switching tabs is not allowed during the assessment. Your activity is being monitored.");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [submitted]);

    // Timer Logic
    useEffect(() => {
        if (loading || submitted) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, submitted]);

    const handleSubmit = useCallback(async () => {
        if (submitted) return;
        setSubmitted(true);
        setLoading(true);

        try {
            const studentId = localStorage.getItem('studentId') || 'demo-id';
            const difficultyLevel = localStorage.getItem('difficultyLevel') || 'Beginner';
            const timeTaken = formatTime(timeLeft);

            const res = await fetch('/api/test/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    level: difficultyLevel,
                    answers: Object.entries(answers).map(([id, val]) => ({ questionId: id, selectedAnswer: val })),
                    timeTaken
                })
            });
            const data = await res.json();
            if (res.ok) {
                router.push('/success');
            } else {
                alert(`Test submission failed: ${data.error || 'Server error'}. Please try again.`);
                setSubmitted(false);
                setLoading(false);
            }
        } catch (error: any) {
            alert(`Network error during submission. Please try again.`);
            setSubmitted(false);
            setLoading(false);
        }
    }, [answers, router, submitted, timeLeft, questions]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (qId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    if (loading && !submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading Assessment Questions...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-100">
                        <Clock size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Time Remaining</span>
                        <p className={`text-xl font-mono font-black ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                            {formatTime(timeLeft)}
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-center gap-1 flex-1 max-w-xs mx-10">
                    <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-blue-600"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleFullScreen}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hidden sm:block"
                    >
                        <Maximize2 size={20} />
                    </button>
                    <button
                        onClick={() => { if (confirm("Submit all answers and finish test?")) handleSubmit() }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                    >
                        Finish Test <Send size={18} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col items-center">
                {cheatingAttempts > 0 && (
                    <div className="w-full mb-8 p-4 bg-rose-50 border-2 border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 animate-bounce">
                        <AlertTriangle size={20} />
                        <p className="text-sm font-bold">Activity Warning: Screen exit detected! Your teacher has been notified.</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative"
                    >
                        <div className="absolute top-8 left-8">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                                Question {currentIndex + 1} of {questions.length}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-12 mb-12 leading-snug">
                            {currentQuestion.question}
                        </h2>

                        <div className="grid gap-5">
                            {currentQuestion.options.map((option: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => handleOptionSelect(currentQuestion._id, option)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${answers[currentQuestion._id] === option ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-slate-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all border-2 ${answers[currentQuestion._id] === option
                                        ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-110'
                                        : 'bg-white text-slate-400 border-slate-200'
                                        }`}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className={`text-xl font-bold ${answers[currentQuestion._id] === option ? 'text-blue-900' : 'text-slate-600'
                                        }`}>
                                        {option}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation - IMPROVED FOR USER FRIENDLINESS */}
                <div className="w-full mt-12 flex items-center justify-between gap-6">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        className="flex-1 max-w-[240px] flex items-center justify-center gap-3 bg-white border-2 border-slate-200 p-5 rounded-2xl font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-0 shadow-lg shadow-slate-100"
                    >
                        <ChevronLeft size={24} /> Previous Question
                    </button>

                    <div className="hidden lg:flex gap-3">
                        {questions.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-4 h-4 rounded-full transition-all border-2 ${currentIndex === i ? 'w-12 bg-blue-600 border-blue-600' : answers[questions[i]._id] ? 'bg-blue-100 border-blue-200' : 'bg-slate-100 border-slate-200'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        disabled={currentIndex === questions.length - 1}
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="flex-1 max-w-[240px] flex items-center justify-center gap-3 bg-blue-600 p-5 rounded-2xl font-black text-white hover:bg-blue-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:border-transparent shadow-xl shadow-blue-100 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                    >
                        Next Question <ChevronRight size={24} />
                    </button>
                </div>
            </main>
        </div>
    );
}
