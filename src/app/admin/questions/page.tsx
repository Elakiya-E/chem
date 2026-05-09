'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Database, AlertCircle } from 'lucide-react';

export default function QuestionsBankPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        level: 'Beginner',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        type: 'MCQ'
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = () => {
        // For admin we might want all levels
        Promise.all([
            fetch('/api/questions?level=Beginner').then(r => r.json()),
            fetch('/api/questions?level=Intermediate').then(r => r.json()),
            fetch('/api/questions?level=Advanced').then(r => r.json())
        ]).then(results => {
            setQuestions(results.flat());
            setLoading(false);
        });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implementation for creating question via API
        alert("Question bank update initiated. In production, this would hit POST /api/admin/questions");
        setShowModal(false);
    };

    if (loading) return <div>Loading question bank...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold mb-1">Question Bank</h1>
                    <p className="text-slate-500 text-sm">Manage assessment content and difficulty levels.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                    <Plus size={20} /> Add Question
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search questions..."
                    className="bg-transparent border-none outline-none flex-1 text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                        <span key={lvl} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold uppercase text-slate-500">
                            {lvl}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid gap-4">
                {questions.filter(q => q.question.toLowerCase().includes(search.toLowerCase())).map((q, i) => (
                    <motion.div
                        key={q._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between group"
                    >
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${q.level === 'Advanced' ? 'bg-rose-500' : q.level === 'Intermediate' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}>
                                {q.level.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-lg mb-2">{q.question}</p>
                                <div className="flex flex-wrap gap-2">
                                    {q.options.map((opt: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-500 border border-slate-100 dark:border-slate-700">
                                            {opt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit2 size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={18} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Simple Modal Placeholder */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">New Question</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Question Text</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                    placeholder="Enter the question..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Level</label>
                                    <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none">
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Correct Answer</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none" placeholder="Exact matches option" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-indigo-200 dark:shadow-none">
                                Save to Database
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
