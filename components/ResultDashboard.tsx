"use client";

import { motion } from 'framer-motion';
import {
    CheckCircle2, AlertCircle, FileText, Ban,
    Wine, Wallet, Zap, Scale, Gavel, AlertTriangle
} from 'lucide-react';
import { TravelRequirements, VisaStatus } from '@/lib/data';
import clsx from 'clsx';

interface DashboardProps {
    data: TravelRequirements | null;
    isLoading: boolean;
    originCountry: string;
    destinationCountry: string;
}

const visaConfig = {
    visa_free: {
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: CheckCircle2,
        label: 'Visa Free',
        accent: 'bg-emerald-500'
    },
    evisa: {
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: FileText,
        label: 'E-Visa Required',
        accent: 'bg-amber-500'
    },
    visa_on_arrival: {
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        icon: AlertCircle,
        label: 'Visa on Arrival',
        accent: 'bg-blue-500'
    },
    required: {
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        icon: Ban,
        label: 'Visa Required',
        accent: 'bg-rose-500'
    },
};

export function ResultDashboard({ data, isLoading, originCountry, destinationCountry }: DashboardProps) {
    if (isLoading) {
        return (
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                <div className="md:col-span-2 h-64 bg-charcoal-200 dark:bg-white/5 rounded-[2rem]"></div>
                <div className="h-64 bg-charcoal-200 dark:bg-white/5 rounded-[2rem]"></div>
                <div className="h-48 bg-charcoal-200 dark:bg-white/5 rounded-[2rem]"></div>
                <div className="h-48 bg-charcoal-200 dark:bg-white/5 rounded-[2rem]"></div>
                <div className="h-48 bg-charcoal-200 dark:bg-white/5 rounded-[2rem]"></div>
            </div>
        );
    }

    if (!data) return null;

    const vConfig = visaConfig[data.visa.status];
    const VisaIcon = vConfig.icon;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 text-charcoal-900 dark:text-white"
        >
            {/* 1. Main Visa Status Card (Span 2) */}
            <motion.div variants={item} className={clsx(
                "md:col-span-2 p-8 rounded-[2.5rem] border relative overflow-hidden group",
                vConfig.color, "bg-white/80 dark:bg-brand-gray/60 backdrop-blur-md border-charcoal-200 dark:border-white/5"
            )}>
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">Entry Requirement</p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal-900 dark:text-white">{vConfig.label}</h2>
                        </div>
                        <div className={clsx("p-4 rounded-2xl bg-charcoal-100 dark:bg-white/5 backdrop-blur-md")}>
                            <VisaIcon className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2 text-lg font-medium text-charcoal-600 dark:text-charcoal-200">
                            <span className="opacity-60">{originCountry}</span>
                            <span className="opacity-40">→</span>
                            <span>{destinationCountry}</span>
                        </div>
                        <p className="opacity-80 max-w-md text-charcoal-600 dark:text-charcoal-300">{data.visa.details}</p>
                    </div>

                    <div className="mt-8 inline-block px-4 py-2 bg-charcoal-100 dark:bg-white/10 backdrop-blur-md rounded-xl text-sm font-semibold text-charcoal-900 dark:text-white">
                        Max Stay: {data.visa.max_stay}
                    </div>
                </div>

                {/* Ambient Glow */}
                <div className={clsx("absolute -right-20 -bottom-20 w-96 h-96 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity", vConfig.accent)} />
            </motion.div>

            {/* 2. Local Info Card (Compact) */}
            <motion.div variants={item} className="bg-white/80 dark:bg-brand-gray/60 backdrop-blur-md border border-charcoal-200 dark:border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:bg-charcoal-50 dark:hover:bg-brand-gray/80 transition-colors">
                <div>
                    <div className="flex items-center gap-3 mb-4 text-charcoal-400">
                        <Wallet className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Currency</span>
                    </div>
                    <div className="text-3xl font-bold text-charcoal-900 dark:text-white mb-1">{data.local.currency}</div>
                    <div className="text-charcoal-500 dark:text-charcoal-500">1 {data.local.currency_symbol} ≈ ...</div>
                </div>

                <div className="mt-8 pt-6 border-t border-charcoal-200 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-2 text-charcoal-400">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-medium">Power Grid</span>
                    </div>
                    <div className="font-semibold text-charcoal-900 dark:text-white flex items-center gap-2">
                        {data.local.voltage} • Type {data.local.socket_type}
                    </div>
                </div>
            </motion.div>

            {/* 3. Customs Allowances */}
            <motion.div variants={item} className="bg-white/80 dark:bg-brand-gray/60 backdrop-blur-md border border-charcoal-200 dark:border-white/5 p-8 rounded-[2.5rem] md:col-span-1 group hover:bg-charcoal-50 dark:hover:bg-brand-gray/80 transition-colors">
                <div className="flex items-center gap-3 mb-6 text-charcoal-400">
                    <Wine className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Duty Free Limits</span>
                </div>

                <ul className="space-y-4">
                    <li className="flex flex-col">
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Alcohol</span>
                        <span className="text-lg font-medium text-charcoal-700 dark:text-charcoal-200">{data.customs.allowance.alcohol}</span>
                    </li>
                    <li className="flex flex-col">
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Tobacco</span>
                        <span className="text-lg font-medium text-charcoal-700 dark:text-charcoal-200">{data.customs.allowance.tobacco}</span>
                    </li>
                    <li className="flex flex-col">
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Cash</span>
                        <span className="text-lg font-medium text-charcoal-700 dark:text-charcoal-200">{data.customs.allowance.cash}</span>
                    </li>
                </ul>
            </motion.div>

            {/* 4. Legal & Safety */}
            <motion.div variants={item} className="md:col-span-2 bg-white/80 dark:bg-brand-surface border border-charcoal-200 dark:border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="relative z-10 grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-6 text-charcoal-400">
                            <Scale className="w-5 h-5" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Local Laws</span>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex-1">
                                <span className="block text-xs font-medium text-charcoal-500 mb-1">Alcohol Policy</span>
                                <p className="font-medium text-charcoal-700 dark:text-charcoal-200">{data.legal.alcohol_policy}</p>
                            </li>
                            <li className="flex-1">
                                <span className="block text-xs font-medium text-charcoal-500 mb-1">Drones</span>
                                <p className="font-medium text-charcoal-700 dark:text-charcoal-200">{data.legal.drone_laws}</p>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-6 text-charcoal-400">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Crucial Info</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-charcoal-100 dark:bg-brand-black p-4 rounded-2xl border border-charcoal-200 dark:border-white/5">
                                <span className="block text-xs text-charcoal-500 mb-1">Driving Side</span>
                                <span className="text-xl font-bold capitalize text-charcoal-900 dark:text-white">{data.legal.driving_side}</span>
                            </div>
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
                                <span className="block text-xs text-rose-400 mb-1">Emergency</span>
                                <span className="text-xl font-bold text-rose-200">{data.local.emergency_number}</span>
                            </div>
                        </div>

                        {data.legal.special_laws && (
                            <div className="mt-4 p-4 rounded-2xl bg-charcoal-100 dark:bg-brand-black border border-charcoal-200 dark:border-white/5">
                                <div className="flex items-center gap-2 text-brand-orange mb-2">
                                    <Gavel className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">Strictly Prohibited</span>
                                </div>
                                <ul className="list-disc list-inside text-sm text-charcoal-600 dark:text-charcoal-300 space-y-1">
                                    {data.legal.special_laws.map((law, i) => (
                                        <li key={i}>{law}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

        </motion.div>
    );
}
