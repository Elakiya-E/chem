'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SuccessPage() {

    // Clear local storage on finish
    useEffect(() => {
        // We might want to keep it if we need to show ID, but the requirement says "submitted successfully" only
        // localStorage.clear();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-emerald-50 dark:from-indigo-950 dark:via-slate-950 dark:to-emerald-950">

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
                >
                    <CheckCircle size={48} />
                </motion.div>

                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Submission Successful!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                    Your assessment has been recorded. Your teacher will review your performance and provide feedback soon.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-bold hover:scale-[1.02] transition-transform"
                    >
                        <Home size={20} /> Return to Home
                    </Link>

                    <button
                        onClick={() => window.close()}
                        className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium"
                    >
                        Close Assessment Window
                    </button>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-slate-400 text-sm italic"
            >
                "Education is the passport to the future."
            </motion.p>
        </div>
    );
}
