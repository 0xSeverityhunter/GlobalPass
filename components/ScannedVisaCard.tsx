"use client";

import { motion } from "framer-motion";
import {
    CheckCircle2, XCircle, Calendar, Clock, Globe, Shield,
    FileText, AlertTriangle, Fingerprint
} from "lucide-react";
import { ParsedVisaData } from "@/lib/gemini";
import clsx from "clsx";

interface ScannedVisaCardProps {
    data: ParsedVisaData;
}

export function ScannedVisaCard({ data }: ScannedVisaCardProps) {
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
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-20"
        >
            {/* Main Status Card */}
            <motion.div
                variants={item}
                className={clsx(
                    "md:col-span-2 p-8 rounded-[2.5rem] relative overflow-hidden group",
                    "bg-white/80 dark:bg-brand-gray/60 backdrop-blur-md border",
                    data.isValid
                        ? "border-emerald-500/30"
                        : "border-rose-500/30"
                )}
            >
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2 text-charcoal-600 dark:text-charcoal-400">
                                Scanned Visa
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal-900 dark:text-white">
                                {data.visaType}
                            </h2>
                        </div>
                        <div className={clsx(
                            "p-4 rounded-2xl backdrop-blur-md",
                            data.isValid
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-rose-500/10 text-rose-500"
                        )}>
                            {data.isValid ? (
                                <CheckCircle2 className="w-8 h-8" />
                            ) : (
                                <XCircle className="w-8 h-8" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-medium text-charcoal-600 dark:text-charcoal-200">
                            <Globe className="w-5 h-5 opacity-60" />
                            <span className="opacity-60">{data.holderNationality}</span>
                            <span className="opacity-40">→</span>
                            <span>{data.issuingCountry}</span>
                        </div>

                        <div className={clsx(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
                            data.isValid
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        )}>
                            {data.isValid ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Valid • {data.daysRemaining} days remaining
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4" />
                                    Expired
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ambient Glow */}
                <div className={clsx(
                    "absolute -right-20 -bottom-20 w-96 h-96 rounded-full blur-[100px] opacity-20",
                    data.isValid ? "bg-emerald-500" : "bg-rose-500"
                )} />
            </motion.div>

            {/* Dates Card */}
            <motion.div
                variants={item}
                className="bg-white/80 dark:bg-brand-gray/60 backdrop-blur-md border border-charcoal-200 dark:border-white/5 p-8 rounded-[2.5rem]"
            >
                <div className="flex items-center gap-3 mb-6 text-charcoal-400">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Validity</span>
                </div>

                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Issue Date</span>
                        <p className="text-lg font-bold text-charcoal-900 dark:text-white">{data.issueDate}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Expiry Date</span>
                        <p className="text-lg font-bold text-charcoal-900 dark:text-white">{data.expiryDate}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Entry Type</span>
                        <p className="text-lg font-bold text-charcoal-900 dark:text-white capitalize">{data.entryType}</p>
                    </div>
                </div>
            </motion.div>

            {/* Details Card */}
            <motion.div
                variants={item}
                className="bg-white/80 dark:bg-brand-gray/60 backdrop-blur-md border border-charcoal-200 dark:border-white/5 p-8 rounded-[2.5rem]"
            >
                <div className="flex items-center gap-3 mb-6 text-charcoal-400">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Details</span>
                </div>

                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Visa Number</span>
                        <p className="text-lg font-bold text-charcoal-900 dark:text-white font-mono">{data.visaNumber}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-charcoal-500 uppercase">Max Stay</span>
                        <p className="text-lg font-bold text-charcoal-900 dark:text-white">{data.maxStay}</p>
                    </div>
                </div>
            </motion.div>

            {/* Restrictions Card */}
            {data.restrictions.length > 0 && (
                <motion.div
                    variants={item}
                    className="md:col-span-2 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2.5rem]"
                >
                    <div className="flex items-center gap-3 mb-6 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Restrictions</span>
                    </div>

                    <ul className="space-y-3">
                        {data.restrictions.map((restriction, i) => (
                            <li key={i} className="flex items-start gap-3 text-charcoal-700 dark:text-charcoal-300">
                                <Shield className="w-4 h-4 mt-1 text-amber-500" />
                                <span>{restriction}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Notes Card */}
            {data.rawNotes && (
                <motion.div
                    variants={item}
                    className={clsx(
                        "p-8 rounded-[2.5rem]",
                        "bg-white/80 dark:bg-brand-gray/60 backdrop-blur-md border border-charcoal-200 dark:border-white/5",
                        data.restrictions.length === 0 && "md:col-span-2"
                    )}
                >
                    <div className="flex items-center gap-3 mb-4 text-charcoal-400">
                        <Fingerprint className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Additional Notes</span>
                    </div>
                    <p className="text-charcoal-600 dark:text-charcoal-300">{data.rawNotes}</p>
                </motion.div>
            )}
        </motion.div>
    );
}
