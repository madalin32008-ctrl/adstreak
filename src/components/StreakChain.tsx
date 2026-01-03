'use client';

import { motion } from 'framer-motion';
import { FireEffect } from './FireEffect';
import { getStreakLevel, getNextLevelThreshold } from '@/lib/streak-calculator';

interface StreakChainProps {
    streak: number;
    maxDailyAds: number;
    adsWatched: number;
}

export const StreakChain = ({ streak, maxDailyAds, adsWatched }: StreakChainProps) => {
    const level = getStreakLevel(streak);
    const nextLevelAt = getNextLevelThreshold(level);
    const progressToNextLevel = ((streak % 7) / 7) * 100;

    // Flame size scales with streak
    const flameSize = streak < 3 ? 'sm' : streak < 7 ? 'md' : streak < 30 ? 'lg' : 'xl';

    // Intensity scales with daily progress
    const dailyProgress = Math.min(1, adsWatched / (maxDailyAds || 1));
    const intensity = 0.5 + (dailyProgress * 1.5); // 0.5 to 2.0

    return (
        <div className="relative w-full p-6 bg-slate-900/50 rounded-2xl border border-slate-700 backdrop-blur-sm overflow-hidden">
            {/* Background Glow */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/5 pointer-events-none"
                style={{ opacity: 0.5 + (dailyProgress * 0.5) }}
            />

            <div className="relative z-10 flex flex-col items-center">
                {/* Streak Counter Header */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Current Streak</span>
                </div>

                {/* Main Number & Fire */}
                <div className="relative flex items-end justify-center h-32 w-full mb-4">
                    <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-80">
                        <FireEffect size={flameSize} intensity={intensity} />
                    </div>

                    <motion.div
                        className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 drop-shadow-2xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={streak} // Re-animate on change
                    >
                        {streak}
                    </motion.div>
                    <span className="text-2xl font-bold text-orange-500 mb-4 ml-1">DAYS</span>
                </div>

                {/* Progress Bar (to next x2 multiplier) */}
                <div className="w-full max-w-[200px] mb-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Lvl {level}</span>
                        <span>x2 Bonus in {nextLevelAt - streak} days</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNextLevel}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>

                {/* Daily Ad Progress */}
                <div className="mt-4 px-4 py-2 bg-black/40 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="text-sm font-medium text-slate-300">Daily Goal:</div>
                    <div className="flex items-center gap-1">
                        <span className={`text-xl font-bold ${adsWatched >= maxDailyAds ? 'text-green-400' : 'text-white'}`}>
                            {adsWatched}
                        </span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">{maxDailyAds}</span>
                    </div>
                    {adsWatched >= maxDailyAds && (
                        <span className="ml-2 text-green-400 text-xs font-bold px-2 py-0.5 bg-green-900/30 rounded">COMPLETED</span>
                    )}
                </div>
            </div>
        </div>
    );
};
