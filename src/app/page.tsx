'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, ShieldCheck, Clock, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-slate-800">

      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex items-center gap-3"
      >
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          SmartPortal <span className="text-blue-600">Pro</span>
        </h1>
      </motion.div>

      {/* Main Content */}
      <main className="max-w-4xl w-full text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8"
        >
          Your Path to <br />
          <span className="gradient-heading">Academic Excellence</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-slate-500 mb-16 max-w-2xl mx-auto leading-relaxed"
        >
          A secure, student-first assessment environment.
          Designed for clarity, focus, and reliable academic evaluation.
        </motion.p>

        {/* Instructions Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: ShieldCheck, title: "Proctored & Secure", desc: "Advanced session protection enabled" },
            { icon: Clock, title: "Timed Performance", desc: "Custom durations for every assessment" },
            { icon: BookOpen, title: "Smart Curriculum", desc: "Questions tailored to your target level" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (i * 0.1) }}
              className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-left hover:border-blue-200 transition-all card-shadow"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <item.icon className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-blue-200 hover:scale-105 transition-all group"
          >
            Enter Portal
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="mt-20 pt-8 border-t border-slate-100 w-full max-w-4xl text-center">
        <p className="text-slate-400 text-sm">
          &copy; 2026 SmartPortal Education Systems. Built for students.
        </p>
      </footer>
    </div>
  );
}
