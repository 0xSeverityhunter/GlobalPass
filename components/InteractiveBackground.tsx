"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function InteractiveBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

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
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {/* Dot Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-30 dark:opacity-15"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(100 100 100 / 0.3) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Primary Spotlight (Follows Mouse) */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full bg-brand-orange/15 dark:bg-brand-orange/10 blur-[100px]"
                style={{
                    left: smoothX,
                    top: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-orange/10 dark:bg-brand-orange/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-indigo-500/5 rounded-full blur-[120px]" />
        </div>
    );
}
