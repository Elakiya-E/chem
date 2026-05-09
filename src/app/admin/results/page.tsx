'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Filter, Eye, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const MOCK_RESULTS = [
    { _id: '1', studentId: { name: 'Kala', section: '12', difficultyLevel: 'Intermediate', rollNumber: '101' }, totalMarks: 12, totalQuestions: 15, percentage: 80, timeTaken: '12:45', submittedAt: new Date() },
    { _id: '2', studentId: { name: 'John Doe', section: '10', difficultyLevel: 'Beginner', rollNumber: '102' }, totalMarks: 8, totalQuestions: 10, percentage: 80, timeTaken: '08:30', submittedAt: new Date() },
    { _id: '3', studentId: { name: 'Jane Smith', section: '12', difficultyLevel: 'Advanced', rollNumber: '103' }, totalMarks: 18, totalQuestions: 20, percentage: 90, timeTaken: '22:10', submittedAt: new Date() },
];

export default function ResultsPage() {
    const [results, setResults] = useState<any[]>(MOCK_RESULTS);
    const [filteredResults, setFilteredResults] = useState<any[]>(MOCK_RESULTS);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');

    useEffect(() => {
        fetch('/api/admin/results')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setResults(data);
                    setFilteredResults(data);
                }
            })
            .catch(() => console.log("Using mock results for layout demo"));
    }, []);

    useEffect(() => {
        let filtered = results.filter(res =>
            res.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
            res.studentId?.section.toLowerCase().includes(search.toLowerCase())
        );

        if (levelFilter !== 'All') {
            filtered = filtered.filter(res => res.studentId?.difficultyLevel === levelFilter);
        }

        setFilteredResults(filtered);
    }, [search, levelFilter, results]);

    const exportPDF = () => {
        const doc = new jsPDF() as any;
        doc.text("Student Performance Report", 14, 15);
        const tableData = filteredResults.map(res => [
            res.studentId?.name,
            res.studentId?.section,
            res.studentId?.difficultyLevel,
            `${res.totalMarks}/${res.totalQuestions}`,
            `${res.percentage.toFixed(2)}%`,
            res.timeTaken,
            new Date(res.submittedAt).toLocaleDateString()
        ]);

        doc.autoTable({
            head: [['Name', 'Section', 'Level', 'Marks', 'Percentage', 'Time', 'Date']],
            body: tableData,
            startY: 20
        });
        doc.save("Student_Results.pdf");
    };

    const exportExcel = () => {
        const data = filteredResults.map(res => ({
            Name: res.studentId?.name,
            Section: res.studentId?.section,
            Level: res.studentId?.difficultyLevel,
            Marks: `${res.totalMarks}/${res.totalQuestions}`,
            Percentage: `${res.percentage.toFixed(2)}%`,
            Time: res.timeTaken,
            Date: new Date(res.submittedAt).toLocaleDateString()
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Results");
        XLSX.writeFile(wb, "Student_Results.xlsx");
    };

    if (loading) return <div>Loading results...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold mb-1">Student Results</h1>
                    <p className="text-slate-500 text-sm">View and export academic performance data.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportExcel}
                        className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <Download size={18} /> Excel
                    </button>
                    <button
                        onClick={exportPDF}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        <Download size={18} /> PDF Report
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or section..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]"
                        value={levelFilter}
                        onChange={e => setLevelFilter(e.target.value)}
                    >
                        <option value="All">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Student</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Level</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Marks</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Accuracy</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Time</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredResults.map((res, i) => (
                            <motion.tr
                                key={res._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-bold">{res.studentId?.name}</p>
                                        <p className="text-xs text-slate-500">{res.studentId?.section} | {res.studentId?.rollNumber || 'N/A'}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${res.studentId?.difficultyLevel === 'Advanced' ? 'bg-rose-100 text-rose-600' :
                                        res.studentId?.difficultyLevel === 'Intermediate' ? 'bg-amber-100 text-amber-600' :
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {res.studentId?.difficultyLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold">{res.totalMarks} / {res.totalQuestions}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${res.percentage > 70 ? 'bg-emerald-500' : res.percentage > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${res.percentage}%` }} />
                                        </div>
                                        <span className="text-xs font-bold">{res.percentage.toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-slate-500 font-mono text-sm">{res.timeTaken}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{new Date(res.submittedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1">
                                        <Eye size={16} /> Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredResults.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No results found for your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
