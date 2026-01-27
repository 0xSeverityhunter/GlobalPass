"use client";

import { useState } from 'react';
import { ArrowRight, Plane, MapPin } from 'lucide-react';
import { countries, getTravelRequirements, TravelRequirements } from '@/lib/data';
import { ResultDashboard } from './ResultDashboard';
import { CustomSelect } from './CustomSelect';
import { motion } from 'framer-motion';

export function VisaSearch() {
    const [passport, setPassport] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [data, setData] = useState<TravelRequirements | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!passport || !destination) return;

        setLoading(true);
        setData(null);

        // Fetch comprehensive data
        const result = await getTravelRequirements(passport, destination);

        setLoading(false);
        setData(result);
    };

    const isReady = passport && destination;
    const passportName = countries.find(c => c.code === passport)?.name || '';
    const destinationName = countries.find(c => c.code === destination)?.name || '';

    // Prepare options for custom select
    const countryOptions = countries.map(c => ({ value: c.code, label: c.name }));

    return (
        <div className="w-full max-w-6xl mx-auto px-4 z-10 relative">
            {/* Search Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-brand-gray/50 backdrop-blur-xl rounded-[2rem] border border-charcoal-200 dark:border-white/5 p-4 md:p-6 mb-12 shadow-xl dark:shadow-2xl"
            >
                <div className="flex flex-col md:flex-row items-center gap-4">

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
                </div>
            </motion.div>

            {/* Dashboard Display */}
            <ResultDashboard
                data={data}
                isLoading={loading}
                originCountry={passportName}
                destinationCountry={destinationName}
            />
        </div>
    );
}
