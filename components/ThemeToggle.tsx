"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-white/10 dark:bg-brand-black/20 backdrop-blur-md border border-brand-gray/20 hover:bg-white/20 dark:hover:bg-brand-gray/30 transition-all group"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5">
                <motion.div
                    initial={false}
                    animate={{
                        content: theme === "dark" ? "none" : "block",
                        scale: theme === "dark" ? 0 : 1,
                        rotate: theme === "dark" ? 90 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 text-brand-orange-500"
                >
                    <Sun className="w-5 h-5" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        content: theme === "light" ? "none" : "block",
                        scale: theme === "light" ? 0 : 1,
                        rotate: theme === "light" ? -90 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 text-brand-orange-400"
                >
                    <Moon className="w-5 h-5" />
                </motion.div>
            </div>
        </button>
    );
}
