// Streak Calculation Logic - The CORE of AdStreak's addictive mechanics
// Duolingo-style streak system with exponential rewards

import { differenceInCalendarDays, formatISO, parseISO, startOfDay, subDays } from 'date-fns';
import type { UserData } from './storage';

// Calculate current streak from history
export function calculateCurrentStreak(streakHistory: { date: string; adsWatched: number }[]): number {
    if (streakHistory.length === 0) return 0;

    // Sort by date descending
    const sorted = [...streakHistory].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = startOfDay(new Date());
    let streak = 0;
    let checkDate = today;

    for (const entry of sorted) {
        const entryDate = startOfDay(parseISO(entry.date));
        const daysDiff = differenceInCalendarDays(checkDate, entryDate);

        if (daysDiff === 0 && entry.adsWatched > 0) {
            // Same day or yesterday with ads watched
            streak++;
            checkDate = subDays(checkDate, 1);
        } else if (daysDiff === 1) {
            // Yesterday - continue checking
            checkDate = entryDate;
            continue;
        } else {
            // Gap found - streak is broken
            break;
        }
    }

    return streak;
}

// Check if streak is broken (more than 24h since last ad)
export function isStreakBroken(lastAdDate: string | undefined, currentDate: Date = new Date()): boolean {
    if (!lastAdDate) return false; // No streak to break yet

    const lastAd = parseISO(lastAdDate);
    const daysSince = differenceInCalendarDays(currentDate, lastAd);

    // Streak is broken if more than 1 calendar day has passed
    return daysSince > 1;
}

// Check if user has watched an ad today
export function hasWatchedAdToday(lastAdDate: string | undefined): boolean {
    if (!lastAdDate) return false;

    const lastAd = startOfDay(parseISO(lastAdDate));
    const today = startOfDay(new Date());

    return lastAd.getTime() === today.getTime();
}

// Get streak level (every 7 days = new level)
export function getStreakLevel(streakDays: number): number {
    return Math.floor(streakDays / 7);
}

// Get next level threshold
export function getNextLevelThreshold(currentLevel: number): number {
    return (currentLevel + 1) * 7;
}

// Get days until next level
export function getDaysUntilNextLevel(streakDays: number): number {
    const nextThreshold = getNextLevelThreshold(getStreakLevel(streakDays));
    return nextThreshold - streakDays;
}

// Generate streak calendar for last N days
export function generateStreakCalendar(streakHistory: { date: string; adsWatched: number }[], days: number = 30): {
    date: string;
    adsWatched: number;
    hasStreak: boolean;
    isToday: boolean;
}[] {
    const calendar: ReturnType<typeof generateStreakCalendar> = [];
    const today = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = formatISO(date, { representation: 'date' });
        const entry = streakHistory.find(h => h.date === dateStr);

        calendar.push({
            date: dateStr,
            adsWatched: entry?.adsWatched || 0,
            hasStreak: (entry?.adsWatched || 0) > 0,
            isToday: i === 0,
        });
    }

    return calendar;
}

// Calculate streak progress percentage
export function getStreakProgress(streakDays: number): number {
    const level = getStreakLevel(streakDays);
    const levelStart = level * 7;
    const levelEnd = (level + 1) * 7;
    const progress = ((streakDays - levelStart) / (levelEnd - levelStart)) * 100;
    return Math.min(100, Math.max(0, progress));
}

// Reset streak (when broken)
export function resetStreak(userData: UserData): UserData {
    return {
        ...userData,
        currentStreak: 0,
        lastAdDate: undefined,
    };
}

// Update streak on ad watch
export function updateStreakOnAdWatch(userData: UserData): UserData {
    const newStreak = calculateCurrentStreak(userData.streakHistory);
    const longestStreak = Math.max(newStreak, userData.longestStreak);

    return {
        ...userData,
        currentStreak: newStreak,
        longestStreak,
    };
}

// Check if user needs streak warning (2h before end of day)
export function needsStreakWarning(lastAdDate: string | undefined): boolean {
    if (!lastAdDate) return false;

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const hoursUntilEndOfDay = (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Warn if less than 2 hours left and haven't watched today
    return hoursUntilEndOfDay < 2 && !hasWatchedAdToday(lastAdDate);
}

// Get streak status message
export function getStreakStatusMessage(streakDays: number, adsWatchedToday: number, availableAds: number): string {
    if (adsWatchedToday === 0) {
        return `¡Día ${streakDays + 1}! Mira tu primer ad ahora 🔥`;
    } else if (adsWatchedToday < availableAds) {
        return `¡${adsWatchedToday}/${availableAds} ads hoy! Sigue ganando 💰`;
    } else {
        return `¡Completado! Vuelve mañana para día ${streakDays + 1} 🎉`;
    }
}

// Calculate bonus for streak milestone
export function getStreakMilestoneBonus(streakDays: number): number {
    const milestones = [7, 14, 30, 60, 90, 180, 365];

    if (milestones.includes(streakDays)) {
        // Bonus points for reaching milestone
        switch (streakDays) {
            case 7: return 5000;
            case 14: return 10000;
            case 30: return 25000;
            case 60: return 50000;
            case 90: return 100000;
            case 180: return 250000;
            case 365: return 1000000; // MEGA bonus for 1 year!
            default: return 0;
        }
    }

    return 0;
}

// Check if today is a streak milestone
export function isStreakMilestone(streakDays: number): boolean {
    const milestones = [7, 14, 30, 60, 90, 180, 365];
    return milestones.includes(streakDays);
}
