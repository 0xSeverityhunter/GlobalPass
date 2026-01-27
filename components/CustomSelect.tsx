"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    icon: React.ReactNode;
}

export function CustomSelect({ options, value, onChange, placeholder, icon }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((o) => o.value === value)?.label;

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={clsx("relative w-full", isOpen && "z-[100]")} ref={containerRef}>
            {/* Trigger Button */}
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 group-hover:text-charcoal-700 dark:group-hover:text-white transition-colors pointer-events-none">
                    {icon}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "w-full h-20 pl-12 pr-10 text-left rounded-3xl font-medium transition-all outline-none border",
                        "focus:ring-2 focus:ring-brand-orange/50",
                        isOpen ? "border-brand-orange/50 bg-charcoal-100 dark:bg-brand-surface" : "border-charcoal-200 dark:border-transparent bg-charcoal-50 dark:bg-brand-surface hover:bg-charcoal-100 dark:hover:bg-charcoal-800",
                        value ? "text-charcoal-900 dark:text-white" : "text-charcoal-500"
                    )}
                >
                    <span className="block truncate">{selectedLabel || placeholder}</span>
                </button>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-500">
                    <ChevronDown className={clsx("w-5 h-5 transition-transform", isOpen && "rotate-180")} />
                </div>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-[100] w-full mt-2 overflow-hidden bg-white dark:bg-brand-surface/95 backdrop-blur-xl border border-charcoal-200 dark:border-white/10 rounded-2xl shadow-2xl max-h-80"
                    >
                        <div className="overflow-y-auto max-h-80 p-2 custom-scrollbar">
                            {/* Search/Filter could go here if list is long */}

                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={clsx(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors",
                                            isSelected
                                                ? "bg-brand-orange text-white"
                                                : "text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-white/5 hover:text-charcoal-900 dark:hover:text-white"
                                        )}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
