// Local Storage Management for AdStreak
// Handles all user data persistence with wallet sync

import { formatISO } from 'date-fns';

export interface Achievement {
    id: string;
    unlockedAt: string;
    claimed: boolean;
}

export interface ReferralData {
    code: string;
    referredBy?: string;
    referrals: string[]; // Wallet addresses of referred users
    referralBonusApplied: boolean;
}

export interface StreakProtection {
    freeUsesThisWeek: number;
    lastResetDate: string;
    purchasedUses: number;
}

export interface TransactionHistory {
    id: string;
    date: string;
    type: 'claim' | 'referral' | 'achievement';
    amount: number; // Points or WLD
    description: string;
    txHash?: string;
}

export interface UserData {
    // Identity
    walletAddress: string;
    isWorldIDVerified: boolean;
    verifiedAt?: string;

    // Streak Data
    currentStreak: number;
    longestStreak: number;
    streakHistory: { date: string; adsWatched: number }[]; // Last 90 days
    lastAdDate?: string;

    // Progress
    adsWatchedToday: number;
    totalAdsWatched: number;
    totalPoints: number;
    claimedPoints: number; // Points already claimed

    // Referrals
    referral: ReferralData;

    // Achievements
    achievements: Achievement[];

    // Streak Protection
    streakProtection: StreakProtection;

    // Transaction History
    transactions: TransactionHistory[];

    // Metadata
    createdAt: string;
    lastLoginDate: string;
}

const STORAGE_KEY = 'adstreak_user_data';

// Initialize default user data
export function getDefaultUserData(walletAddress: string): UserData {
    const now = formatISO(new Date());

    return {
        walletAddress,
        isWorldIDVerified: false,
        currentStreak: 0,
        longestStreak: 0,
        streakHistory: [],
        adsWatchedToday: 0,
        totalAdsWatched: 0,
        totalPoints: 0,
        claimedPoints: 0,
        referral: {
            code: generateReferralCode(walletAddress),
            referrals: [],
            referralBonusApplied: false,
        },
        achievements: [],
        streakProtection: {
            freeUsesThisWeek: 1,
            lastResetDate: now,
            purchasedUses: 0,
        },
        transactions: [],
        createdAt: now,
        lastLoginDate: now,
    };
}

// Generate referral code from wallet address
function generateReferralCode(walletAddress: string): string {
    // Use last 8 characters of wallet address
    return walletAddress.slice(-8).toUpperCase();
}

// Get user data from localStorage
export function getUserData(walletAddress: string): UserData {
    if (typeof window === 'undefined') {
        return getDefaultUserData(walletAddress);
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            const defaultData = getDefaultUserData(walletAddress);
            saveUserData(defaultData);
            return defaultData;
        }

        const data: UserData = JSON.parse(stored);

        // Verify wallet matches
        if (data.walletAddress !== walletAddress) {
            const newData = getDefaultUserData(walletAddress);
            saveUserData(newData);
            return newData;
        }

        return data;
    } catch (error) {
        console.error('Error loading user data:', error);
        return getDefaultUserData(walletAddress);
    }
}

// Save user data to localStorage
export function saveUserData(data: UserData): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

// Update user data with partial updates
export function updateUserData(walletAddress: string, updates: Partial<UserData>): UserData {
    const currentData = getUserData(walletAddress);
    const newData = { ...currentData, ...updates, lastLoginDate: formatISO(new Date()) };
    saveUserData(newData);
    return newData;
}

// Record ad watch
export function recordAdWatch(walletAddress: string, pointsEarned: number): UserData {
    const data = getUserData(walletAddress);
    const today = formatISO(new Date(), { representation: 'date' });

    // Update streak history
    const existingEntry = data.streakHistory.find(h => h.date === today);
    if (existingEntry) {
        existingEntry.adsWatched += 1;
    } else {
        data.streakHistory.push({ date: today, adsWatched: 1 });
    }

    // Keep only last 90 days
    if (data.streakHistory.length > 90) {
        data.streakHistory = data.streakHistory.slice(-90);
    }

    const updates: Partial<UserData> = {
        adsWatchedToday: data.adsWatchedToday + 1,
        totalAdsWatched: data.totalAdsWatched + 1,
        totalPoints: data.totalPoints + pointsEarned,
        lastAdDate: formatISO(new Date()),
        streakHistory: data.streakHistory,
    };

    return updateUserData(walletAddress, updates);
}

// Record claim
export function recordClaim(walletAddress: string, pointsClaimed: number, wldAmount: number, txHash?: string): UserData {
    const data = getUserData(walletAddress);

    const transaction: TransactionHistory = {
        id: `claim_${Date.now()}`,
        date: formatISO(new Date()),
        type: 'claim',
        amount: wldAmount,
        description: `Claimed ${pointsClaimed} points → ${wldAmount.toFixed(4)} WLD`,
        txHash,
    };

    const updates: Partial<UserData> = {
        claimedPoints: data.claimedPoints + pointsClaimed,
        transactions: [...data.transactions, transaction],
    };

    return updateUserData(walletAddress, updates);
}

// Unlock achievement
export function unlockAchievement(walletAddress: string, achievementId: string): UserData {
    const data = getUserData(walletAddress);

    // Check if already unlocked
    if (data.achievements.some(a => a.id === achievementId)) {
        return data;
    }

    const achievement: Achievement = {
        id: achievementId,
        unlockedAt: formatISO(new Date()),
        claimed: false,
    };

    const updates: Partial<UserData> = {
        achievements: [...data.achievements, achievement],
    };

    return updateUserData(walletAddress, updates);
}

// Apply referral bonus
export function applyReferralBonus(walletAddress: string, referredByWallet: string): UserData {
    const data = getUserData(walletAddress);

    if (data.referral.referralBonusApplied) {
        return data; // Already applied
    }

    const updates: Partial<UserData> = {
        referral: {
            ...data.referral,
            referredBy: referredByWallet,
            referralBonusApplied: true,
        },
    };

    return updateUserData(walletAddress, updates);
}

// Add referral
export function addReferral(walletAddress: string, referredWallet: string): UserData {
    const data = getUserData(walletAddress);

    if (data.referral.referrals.includes(referredWallet)) {
        return data; // Already referred
    }

    const transaction: TransactionHistory = {
        id: `referral_${Date.now()}`,
        date: formatISO(new Date()),
        type: 'referral',
        amount: 5000, // Bonus points
        description: `Referral bonus: +10 ads/day + streak protection`,
    };

    const updates: Partial<UserData> = {
        referral: {
            ...data.referral,
            referrals: [...data.referral.referrals, referredWallet],
        },
        transactions: [...data.transactions, transaction],
    };

    return updateUserData(walletAddress, updates);
}

// Clear all data (for debugging)
export function clearUserData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

// Get available points for claiming (total - claimed)
export function getAvailablePoints(data: UserData): number {
    return data.totalPoints - data.claimedPoints;
}
