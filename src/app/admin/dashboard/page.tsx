'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileCheck, BrainCircuit, Target, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const MOCK_STATS = {
    totalStudents: 124,
    averageMarks: "78.50",
    difficultyStats: [
        { _id: 'Beginner', count: 45 },
        { _id: 'Intermediate', count: 56 },
        { _id: 'Advanced', count: 23 }
    ],
    performanceLevels: {
        Beginner: { avg: 85, count: 45 },
        Intermediate: { avg: 72, count: 56 },
        Advanced: { avg: 65, count: 23 }
    }
};

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(MOCK_STATS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                if (data.totalStudents !== undefined) setStats(data);
            })
            .catch(() => console.log("Using mock stats for layout demo"));
    }, []);

    if (loading) return <div>Loading dashboard stats...</div>;

    const chartData = [
        { name: 'Beginner', students: stats.difficultyStats.find((s: any) => s._id === 'Beginner')?.count || 0, performance: stats.performanceLevels.Beginner.avg },
        { name: 'Intermediate', students: stats.difficultyStats.find((s: any) => s._id === 'Intermediate')?.count || 0, performance: stats.performanceLevels.Intermediate.avg },
        { name: 'Advanced', students: stats.difficultyStats.find((s: any) => s._id === 'Advanced')?.count || 0, performance: stats.performanceLevels.Advanced.avg },
    ];

    const cards = [
        { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '+12%', up: true },
        { title: 'Avg. Accuracy', value: `${stats.averageMarks}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+5.4%', up: true },
        { title: 'Test Difficulty', value: 'Dynamic', icon: BrainCircuit, color: 'text-amber-600', bg: 'bg-amber-100', trend: 'Stable', up: true },
        { title: 'Submissions', value: stats.totalStudents, icon: FileCheck, color: 'text-rose-600', bg: 'bg-rose-100', trend: '-2%', up: false },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold mb-2">System Analytics</h1>
                <p className="text-slate-500">Real-time performance metrics and student engagement data.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${card.bg} dark:bg-slate-800 p-3 rounded-xl ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {card.trend} {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{card.title}</p>
                            <h3 className="text-2xl font-bold">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-8">Performance by Level</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="performance" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-8">Student Participation</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="students" stroke="#10b981" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
