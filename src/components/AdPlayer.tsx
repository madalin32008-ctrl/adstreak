'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { APP_CONFIG } from '@/lib/constants';
import { MockAd } from '@/lib/ad-provider';
import { Howl } from 'howler';

interface AdPlayerProps {
    ad: MockAd;
    onComplete: (watchedDuration: number) => void;
    onCancel: () => void;
}

export const AdPlayer = ({ ad, onComplete }: AdPlayerProps) => {
    const [timeLeft, setTimeLeft] = useState(ad.duration);
    const [canSkip, setCanSkip] = useState(false);
    const [charge, setCharge] = useState(0); // Minigame charge
    const clickSound = useRef<Howl | null>(null);

    useEffect(() => {
        // Sound init
        clickSound.current = new Howl({ src: ['/sounds/click.mp3'], volume: 0.2 });

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Enable skip after X seconds
        const skipTimer = setTimeout(() => {
            setCanSkip(true);
        }, APP_CONFIG.AD_SKIP_AVAILABLE_AFTER * 1000);

        return () => {
            clearInterval(timer);
            clearTimeout(skipTimer);
        };
    }, [ad.duration]);


    // Auto-complete when time hits 0
    useEffect(() => {
        if (timeLeft === 0) {
            onComplete(ad.duration);
        }
    }, [timeLeft, onComplete, ad.duration]);

    const handleSkip = () => {
        if (canSkip) {
            // Penalty handling is done by parent reward calculator
            // We just report actual watched time
            onComplete(ad.duration - timeLeft);
        }
    };

    // Mini-game interaction
    const handleInteraction = () => {
        if (ad.minigame === 'tap') {
            clickSound.current?.play();
            setCharge(prev => Math.min(100, prev + 5));
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
            {/* Brand Header */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-black">Ad</div>
                <span className="text-white font-bold">{ad.brand}</span>
            </div>

            {/* Countdown Timer */}
            <div className="absolute top-6 right-6">
                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-mono font-bold text-white">
                    {timeLeft}
                </div>
            </div>

            {/* Main Content Area (Simulation) */}
            <div className="w-full max-w-md aspect-square bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden flex items-center justify-center mb-12">
                {/* Animated Background */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-50"
                    animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />

                {/* Orbiting Elements */}
                <motion.div
                    className="w-16 h-16 bg-blue-500 rounded-full blur-xl absolute"
                    animate={{ x: [0, 100, 0, -100, 0], y: [-100, 0, 100, 0, -100] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Minigame Overlay */}
                {ad.minigame === 'tap' && timeLeft > 0 && (
                    <div className="z-10 flex flex-col items-center cursor-pointer" onClick={handleInteraction}>
                        <motion.div
                            className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/50"
                            whileTap={{ scale: 0.9 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        >
                            TAP ME!
                        </motion.div>
                        <div className="mt-4 w-48 h-4 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${charge}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-400 mt-2">Charge bonus rewards!</p>
                    </div>
                )}

                {timeLeft === 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="z-20 text-4xl font-black text-white drop-shadow-lg"
                    >
                        COMPLETE!
                    </motion.div>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 w-full max-w-md">
                {canSkip ? (
                    <Button onClick={handleSkip} variant="ghost" className="flex-1 text-slate-400 hover:text-white border border-slate-700">
                        Skip Ad (Half Reward)
                    </Button>
                ) : (
                    <div className="flex-1 flex justify-center text-slate-500 text-sm items-center h-12">
                        Reward guaranteed in {timeLeft}s
                    </div>
                )}
            </div>
        </div>
    );
};
