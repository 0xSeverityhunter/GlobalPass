"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { CreditCard, Clock, MapPin, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { user } = useUser();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto"
            >
                {/* Welcome Header */}
                <motion.div variants={item} className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-white mb-2">
                        Welcome back, {user?.firstName || "Traveler"} 👋
                    </h1>
                    <p className="text-charcoal-500 dark:text-charcoal-400">
                        Manage your visas and travel documents
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-brand-gray/50 backdrop-blur-md border border-charcoal-200 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Saved Visas</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-900 dark:text-white">0</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-brand-gray/50 backdrop-blur-md border border-charcoal-200 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Expiring Soon</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-900 dark:text-white">0</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-brand-gray/50 backdrop-blur-md border border-charcoal-200 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Countries Visited</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-900 dark:text-white">0</p>
                    </div>
                </motion.div>

                {/* My Visas Section */}
                <motion.div variants={item} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">My Visas</h2>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-orange rounded-full hover:bg-brand-orange-hover transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Scan New Visa
                        </Link>
                    </div>

                    {/* Empty State */}
                    <div className="p-12 rounded-3xl bg-white/80 dark:bg-brand-gray/50 backdrop-blur-md border border-charcoal-200 dark:border-white/5 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-charcoal-100 dark:bg-white/5 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-charcoal-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-2">
                            No visas saved yet
                        </h3>
                        <p className="text-charcoal-500 dark:text-charcoal-400 mb-6 max-w-md mx-auto">
                            Scan your first visa document to start tracking your travel documents and get expiry reminders.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-orange rounded-full hover:bg-brand-orange-hover transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Scan Your First Visa
                        </Link>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item}>
                    <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/"
                            className="p-6 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 border border-brand-orange/20 hover:border-brand-orange/40 transition-colors group"
                        >
                            <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1 group-hover:text-brand-orange transition-colors">
                                Check Visa Requirements
                            </h3>
                            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                                See what you need to travel to any country
                            </p>
                        </Link>

                        <Link
                            href="/"
                            className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors group"
                        >
                            <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                                Scan Visa Document
                            </h3>
                            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                                Upload and extract visa details with AI
                            </p>
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
