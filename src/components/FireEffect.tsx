'use client';

import { motion } from 'framer-motion';

interface FireEffectProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    intensity?: number;
    className?: string;
}

export const FireEffect = ({ size = 'md', intensity = 1, className = '' }: FireEffectProps) => {
    const sizeMap = {
        sm: 24,
        md: 48,
        lg: 96,
        xl: 160,
    };

    const pxSize = sizeMap[size];

    // Particle generation
    const particles = Array.from({ length: 8 * intensity }).map((_, i) => ({
        id: i,
        x: Math.random() * 20 - 10, // Random start x offset
        delay: Math.random() * 0.5,
        duration: 0.5 + Math.random() * 0.5,
    }));

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: pxSize, height: pxSize }}>
            {/* Core Flame */}
            <motion.div
                className="absolute bottom-0 w-full h-full bg-gradient-to-t from-orange-600 via-orange-500 to-yellow-400 rounded-full blur-[2px]"
                style={{ originY: 1 }}
                animate={{
                    scale: [1, 1.1, 1],
                    y: [0, -5, 0],
                    filter: ['blur(2px)', 'blur(4px)', 'blur(2px)'],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: 'easeInOut',
                }}
            />

            {/* Inner White Hot Core */}
            <motion.div
                className="absolute bottom-1 w-[60%] h-[60%] bg-gradient-to-t from-yellow-300 to-white rounded-full blur-[1px] opacity-80"
                style={{ originY: 1 }}
                animate={{
                    scale: [1, 1.05, 0.95],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 0.4,
                    ease: 'easeInOut',
                }}
            />

            {/* Rising Particles/Sparks */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute bottom-4 w-1 h-3 bg-yellow-300 rounded-full"
                    initial={{ opacity: 0, scale: 0, x: p.x, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0],
                        y: -pxSize * 0.8, // Rise up
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: p.duration,
                        delay: p.delay,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Outer Glow */}
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-30 animate-pulse" />
        </div>
    );
};
