"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, FileText, Ban } from 'lucide-react';
import { VisaStatus } from '@/lib/data';
import clsx from 'clsx';

interface ResultCardProps {
    status: VisaStatus | null;
    isLoading: boolean;
    originCountry: string;
    destinationCountry: string;
}

const statusConfig = {
    visa_free: {
        color: 'bg-sage-100 text-sage-800 border-sage-200',
        icon: CheckCircle2,
        label: 'Visa Free',
        description: 'You can travel here without a visa.',
        accent: 'bg-sage-500'
    },
    evisa: {
        color: 'bg-warm-100 text-warm-800 border-warm-200',
        icon: FileText,
        label: 'E-Visa',
        description: 'An electronic visa is required before travel.',
        accent: 'bg-warm-500'
    },
    visa_on_arrival: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: AlertCircle,
        label: 'Visa on Arrival',
        description: 'You can obtain a visa upon entering the country.',
        accent: 'bg-blue-500'
    },
    required: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: Ban, // Using generic icon or Ban
        label: 'Visa Required',
        description: 'You must apply for a visa at an embassy.',
        accent: 'bg-red-500'
    },
};

export function ResultCard({ status, isLoading, originCountry, destinationCountry }: ResultCardProps) {
    if (isLoading) {
        return (
            <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-3xl shadow-xl border border-charcoal-50">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-charcoal-100 rounded-full"></div>
                    <div className="h-6 w-32 bg-charcoal-100 rounded-full"></div>
                    <div className="h-4 w-48 bg-charcoal-100 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!status) return null;

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-full max-w-md mx-auto mt-8 relative overflow-hidden"
        >
            <div className={clsx("relative p-8 rounded-3xl shadow-2xl border", "bg-white border-charcoal-50")}>
                {/* Decorative Top Accent */}
                <div className={clsx("absolute top-0 left-0 right-0 h-2", config.accent)} />

                <div className="flex flex-col items-center text-center">
                    <div className={clsx("p-4 rounded-2xl mb-4", config.color)}>
                        <Icon className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-charcoal-900 mb-2">{config.label}</h2>
                    <p className="text-charcoal-500 leading-relaxed max-w-xs">
                        Traveling from <span className="font-semibold text-charcoal-800">{originCountry}</span> to <span className="font-semibold text-charcoal-800">{destinationCountry}</span>
                    </p>

                    <div className="mt-6 pt-6 border-t border-charcoal-100 w-full">
                        <p className="text-sm font-medium text-charcoal-600">{config.description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
