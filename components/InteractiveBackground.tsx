"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function InteractiveBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-transparent dark:bg-brand-black transition-colors duration-300">
            {/* Primary Spotlight (Follows Mouse) */}
            {/* Using a cool white/blueish tint for the high-tech feel */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full bg-brand-orange/5 dark:bg-white/5 blur-[120px]"
                style={{
                    left: smoothX,
                    top: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Ambient Glows - Light/Dark Themed */}
            <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-brand-orange/10 dark:bg-brand-orange/5 rounded-full blur-[180px]" />
            <div className="absolute top-[20%] left-[-20%] w-[900px] h-[900px] bg-blue-200/30 dark:bg-indigo-900/20 rounded-full blur-[200px]" />
            <div className="absolute bottom-[-20%] right-[10%] w-[800px] h-[800px] bg-purple-200/20 dark:bg-violet-900/10 rounded-full blur-[180px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-slate-300/20 dark:bg-charcoal-800/20 rounded-full blur-[180px]" />

        </div>
    );
}
