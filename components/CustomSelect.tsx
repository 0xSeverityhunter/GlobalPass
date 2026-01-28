"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
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
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedLabel = options.find((o) => o.value === value)?.label;

    // Filter options based on search query
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            setSearchQuery("");
        } else if (e.key === "Enter" && filteredOptions.length === 1) {
            onChange(filteredOptions[0].value);
            setIsOpen(false);
            setSearchQuery("");
        }
    };

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
                        className="absolute z-[100] w-full mt-2 overflow-hidden bg-white dark:bg-brand-surface/95 backdrop-blur-xl border border-charcoal-200 dark:border-white/10 rounded-2xl shadow-2xl"
                    >
                        {/* Search Input */}
                        <div className="p-3 border-b border-charcoal-100 dark:border-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type to search..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-50 dark:bg-white/5 border border-charcoal-200 dark:border-white/10 text-sm text-charcoal-900 dark:text-white placeholder:text-charcoal-400 outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto max-h-64 p-2 custom-scrollbar">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-charcoal-400">
                                    No countries found for "{searchQuery}"
                                </div>
                            ) : (
                                filteredOptions.map((option) => {
                                    const isSelected = option.value === value;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                onChange(option.value);
                                                setIsOpen(false);
                                                setSearchQuery("");
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
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
