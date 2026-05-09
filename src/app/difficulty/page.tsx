'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Zap, Trophy, ArrowRight, Check } from 'lucide-react';

export default function DifficultyPage() {
    const router = useRouter();
    const [level, setLevel] = useState('Beginner');
    const [loading, setLoading] = useState(false);

    const startTest = async () => {
        setLoading(true);
        localStorage.setItem('difficultyLevel', level);

        try {
            const studentId = localStorage.getItem('studentId') || 'demo-id';
            await fetch('/api/students/update-level', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, level })
            });
            router.push('/test');
        } catch {
            router.push('/test'); // Proceed anyway for demo
        }
    };

    const levels = [
        { name: 'Beginner', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Fundamental concepts and easy questions.' },
        { name: 'Intermediate', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Core logic and analytical assessment.' },
        { name: 'Advanced', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', desc: 'Complex problem solving and critical thinking.' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full"
            >
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Select Difficulty</h2>
                    <p className="text-slate-500 font-bold text-lg">Choose the level that best matches your target goal.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {levels.map((l) => (
                        <button
                            key={l.name}
                            onClick={() => setLevel(l.name)}
                            className={`p-10 rounded-[3rem] border-4 transition-all text-left relative group bg-white ${level === l.name
                                    ? `shadow-2xl shadow-blue-100 border-blue-600`
                                    : 'border-transparent hover:border-slate-200'
                                }`}
                        >
                            <div className={`w-16 h-16 ${l.bg} ${l.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                                <l.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3">{l.name}</h3>
                            <p className="text-slate-500 text-sm font-bold leading-relaxed">{l.desc}</p>

                            {level === l.name && (
                                <motion.div
                                    layoutId="indicator"
                                    className="absolute -top-3 -right-3 bg-blue-600 text-white p-2 rounded-full shadow-lg"
                                >
                                    <Check size={20} />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6">
                    <button
                        disabled={loading}
                        onClick={startTest}
                        className="w-full max-w-md py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-2xl shadow-2xl shadow-blue-200 transition-all border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 flex items-center justify-center gap-4 group"
                    >
                        {loading ? 'Preparing System...' : 'Launch Assessment'}
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
                    </button>

                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
                        Secure Session Activated
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
