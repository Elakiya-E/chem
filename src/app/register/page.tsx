'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Book, Users, ClipboardCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        rollNumber: '',
        teacherName: '',
        date: new Date().toLocaleDateString()
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.section) {
            alert("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            console.log("Registering student:", formData);
            const res = await fetch('/api/students/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('studentId', data.studentId);
                localStorage.setItem('studentName', formData.name);
                router.push('/difficulty');
            } else {
                alert(`Registration failed: ${data.error || 'Server error'}. Please try again.`);
            }
        } catch (error: any) {
            alert(`Network error: ${error.message}. Please check your connection.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-8 left-8"
            >
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors">
                    <ArrowLeft size={20} /> Back to Start
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100"
            >
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Student Profile</h2>
                    <p className="text-slate-400 font-medium text-sm">Welcome! Tell us who is taking the test.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                required
                                type="text"
                                placeholder="Ex. John Doe"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Section *</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Ex. A"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                    value={formData.section}
                                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Roll No</label>
                            <div className="relative">
                                <ClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="101"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                    value={formData.rollNumber}
                                    onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Current Date</label>
                        <input
                            readOnly
                            type="text"
                            className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-400 font-bold cursor-not-allowed"
                            value={formData.date}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-100 transition-all border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 mt-4 disabled:bg-slate-200 disabled:border-transparent"
                    >
                        {loading ? 'Entering Portal...' : 'Continue to Difficulty'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
