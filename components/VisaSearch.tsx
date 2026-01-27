"use client";

import { useState } from 'react';
import { ArrowRight, Plane, MapPin, ScanLine, Search } from 'lucide-react';
import { countries, getTravelRequirements, TravelRequirements } from '@/lib/data';
import { ParsedVisaData } from '@/lib/gemini';
import { ResultDashboard } from './ResultDashboard';
import { CustomSelect } from './CustomSelect';
import { VisaUpload } from './VisaUpload';
import { ScannedVisaCard } from './ScannedVisaCard';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type Mode = 'search' | 'scan';

export function VisaSearch() {
    const [mode, setMode] = useState<Mode>('search');
    const [passport, setPassport] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [data, setData] = useState<TravelRequirements | null>(null);
    const [scannedVisa, setScannedVisa] = useState<ParsedVisaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!passport || !destination) return;

        setLoading(true);
        setData(null);
        setError(null);

        const result = await getTravelRequirements(passport, destination);

        setLoading(false);
        setData(result);
    };

    const handleScanComplete = (visaData: unknown) => {
        setScannedVisa(visaData as ParsedVisaData);
        setError(null);
    };

    const handleScanError = (errorMessage: string) => {
        setError(errorMessage);
        setScannedVisa(null);
    };

    const isReady = passport && destination;
    const passportName = countries.find(c => c.code === passport)?.name || '';
    const destinationName = countries.find(c => c.code === destination)?.name || '';

    const countryOptions = countries.map(c => ({ value: c.code, label: c.name }));

    return (
        <div className="w-full max-w-6xl mx-auto px-4 z-10 relative">
            {/* Mode Toggle Tabs */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex p-1.5 rounded-full bg-charcoal-100 dark:bg-brand-gray/50 backdrop-blur-md border border-charcoal-200 dark:border-white/5">
                    <button
                        onClick={() => {
                            setMode('search');
                            setScannedVisa(null);
                            setError(null);
                        }}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all",
                            mode === 'search'
                                ? "bg-brand-orange text-white shadow-lg"
                                : "text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white"
                        )}
                    >
                        <Search className="w-4 h-4" />
                        Check Requirements
                    </button>
                    <button
                        onClick={() => {
                            setMode('scan');
                            setData(null);
                            setError(null);
                        }}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all",
                            mode === 'scan'
                                ? "bg-brand-orange text-white shadow-lg"
                                : "text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white"
                        )}
                    >
                        <ScanLine className="w-4 h-4" />
                        Scan My Visa
                    </button>
                </div>
            </div>

            {/* Search Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-brand-gray/50 backdrop-blur-xl rounded-[2rem] border border-charcoal-200 dark:border-white/5 p-4 md:p-6 mb-12 shadow-xl dark:shadow-2xl"
            >
                <AnimatePresence mode="wait">
                    {mode === 'search' ? (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col md:flex-row items-center gap-4"
                        >
                            {/* Origin Input */}
                            <CustomSelect
                                icon={<MapPin className="w-5 h-5" />}
                                placeholder="I hold a passport from..."
                                options={countryOptions}
                                value={passport}
                                onChange={(val) => {
                                    setPassport(val);
                                    setData(null);
                                }}
                            />

                            <div className="hidden md:flex text-charcoal-500">
                                <ArrowRight className="w-6 h-6" />
                            </div>

                            {/* Destination Input */}
                            <CustomSelect
                                icon={<Plane className="w-5 h-5" />}
                                placeholder="I am traveling to..."
                                options={countryOptions}
                                value={destination}
                                onChange={(val) => {
                                    setDestination(val);
                                    setData(null);
                                }}
                            />

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                disabled={!isReady || loading}
                                className="w-full md:w-auto h-20 px-10 rounded-3xl bg-brand-orange text-white font-bold tracking-wide hover:bg-brand-orange-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
                            >
                                {loading ? 'Analyzing...' : 'EXPLORE'}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="scan"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <VisaUpload
                                onScanComplete={handleScanComplete}
                                onError={handleScanError}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Error Display */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center"
                >
                    {error}
                </motion.div>
            )}

            {/* Results Display */}
            {mode === 'search' ? (
                <ResultDashboard
                    data={data}
                    isLoading={loading}
                    originCountry={passportName}
                    destinationCountry={destinationName}
                />
            ) : (
                scannedVisa && <ScannedVisaCard data={scannedVisa} />
            )}
        </div>
    );
}
