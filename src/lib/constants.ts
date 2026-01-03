// AdStreak Constants - Viral watch-to-earn configuration
// All values tuned for EXPLOSIVE DAU and addictive streaks

export const APP_CONFIG = {
    // App Metadata
    APP_NAME: 'AdStreak',
    APP_TAGLINE: '¡Mejor que MADS: Streaks infinitos = Gana 100x más real crypto diario!',
    APP_DESCRIPTION: '¡Supera MADS! Construye rachas infinitas viendo ads rápidos y gana WLD/USDC real todos los días',

    // Ads Scaling (EXPONENTIAL for addiction)
    BASE_ADS_DAY1: 3, // Start with 3 ads on day 1
    ADS_SCALING: {
        1: 3,
        3: 5,
        5: 8,
        7: 15,    // Week 1
        14: 25,   // Week 2
        21: 35,   // Week 3
        30: 50,   // Month 1 - INSANE
        60: 80,
        90: 100,  // Cap at 100 for extreme streaks
    },
    MAX_DAILY_ADS: 100,

    // Rewards (scales CRAZY with streak)
    REWARDS_PER_AD_BASE: 100, // Base points per ad
    STREAK_MULTIPLIER_INTERVAL: 7, // Every 7 days = permanent x2

    // MASSIVE verified bonus (20x vs non-verified)
    WORLD_ID_MULTIPLIER: 20, // Verified users get 20x points!
    NON_VERIFIED_DAILY_ADS: 1, // Non-verified teaser mode
    NON_VERIFIED_MULTIPLIER: 1, // No bonus for non-verified

    // Dev Fee
    DEV_FEE_PERCENTAGE: 0.015, // 1.5% dev fee on claims
    DEV_WALLET_ADDRESS: process.env.NEXT_PUBLIC_DEV_WALLET || '0x0000000000000000000000000000000000000000',

    // Claims
    MIN_CLAIM_AMOUNT_WLD: 0.01, // Minimum 0.01 WLD to claim
    POINTS_TO_WLD_RATE: 10000, // 10,000 points = 0.01 WLD

    // Ad Duration
    AD_DURATION_MIN: 15, // seconds
    AD_DURATION_MAX: 30, // seconds
    AD_SKIP_PENALTY: 0.5, // Skip reduces reward by 50%
    AD_SKIP_AVAILABLE_AFTER: 5, // Can skip after 5 seconds

    // OP Referrals (VIRAL)
    REFERRAL_BONUS_ADS_PERMANENT: 10, // +10 ads/day forever for both users!
    REFERRAL_STREAK_PROTECTION: true, // Free streak protection
    REFERRAL_AIRDROP_POINTS: 5000, // Bonus points on successful referral

    // Streak Protection
    STREAK_PROTECTION_FREE_PER_WEEK: 1, // 1 free save per week
    STREAK_PROTECTION_COST_POINTS: 1000, // Cost to buy extra protection

    // Daily Challenges
    DAILY_CHALLENGE_REFERRAL_REWARD: 20, // +20 ads for referring 1 friend

    // Achievements
    ACHIEVEMENTS: {
        FIRST_AD: { id: 'first_ad', name: 'First Steps', reward: 500, requirement: 1 },
        WEEK_STREAK: { id: 'week_streak', name: 'Dedicated', reward: 2000, requirement: 7 },
        MONTH_STREAK: { id: 'month_streak', name: 'Streak God', reward: 10000, requirement: 30 },
        HUNDRED_ADS: { id: 'hundred_ads', name: 'Centurion', reward: 5000, requirement: 100 },
        VERIFIED: { id: 'verified', name: 'Verified God Mode', reward: 3000, requirement: 1 },
        FIRST_REFERRAL: { id: 'first_referral', name: 'Influencer', reward: 1000, requirement: 1 },
        TEN_REFERRALS: { id: 'ten_referrals', name: 'Viral King', reward: 20000, requirement: 10 },
    },

    // Notifications
    STREAK_WARNING_HOURS: 2, // Warn 2h before streak ends

    // Leaderboard
    LEADERBOARD_TOP_COUNT: 100,
    LEADERBOARD_ANONYMIZE: true,

    // UI/UX
    CONFETTI_DURATION: 3000, // 3 seconds of confetti
    THEME_COLORS: {
        primary: '#3B82F6', // Blue (Orb color)
        fire: '#FF6B35', // Fire orange
        success: '#10B981', // Green
        warning: '#F59E0B', // Yellow
        danger: '#EF4444', // Red
    },
} as const;

// Calculate available ads based on streak
export function getAvailableAds(streakDays: number, isVerified: boolean): number {
    if (!isVerified) return APP_CONFIG.NON_VERIFIED_DAILY_ADS;

    // Find the appropriate tier
    const sortedDays = Object.keys(APP_CONFIG.ADS_SCALING)
        .map(Number)
        .sort((a, b) => b - a); // Descending order

    for (const day of sortedDays) {
        if (streakDays >= day) {
            return APP_CONFIG.ADS_SCALING[day as keyof typeof APP_CONFIG.ADS_SCALING];
        }
    }

    return APP_CONFIG.BASE_ADS_DAY1;
}

// Calculate reward multiplier based on streak and verification
export function getRewardMultiplier(streakDays: number, isVerified: boolean): number {
    const baseMultiplier = isVerified ? APP_CONFIG.WORLD_ID_MULTIPLIER : APP_CONFIG.NON_VERIFIED_MULTIPLIER;

    // Permanent multiplier: x2 every 7 days
    const streakBonus = Math.floor(streakDays / APP_CONFIG.STREAK_MULTIPLIER_INTERVAL);
    const streakMultiplier = Math.pow(2, streakBonus);

    return baseMultiplier * streakMultiplier;
}

// Calculate points for an ad view
export function calculateAdReward(streakDays: number, isVerified: boolean, completed: boolean): number {
    const baseReward = APP_CONFIG.REWARDS_PER_AD_BASE;
    const multiplier = getRewardMultiplier(streakDays, isVerified);
    const penalty = completed ? 1 : APP_CONFIG.AD_SKIP_PENALTY;

    return Math.floor(baseReward * multiplier * penalty);
}

// Calculate claimable WLD from points
export function pointsToWLD(points: number): number {
    return points / APP_CONFIG.POINTS_TO_WLD_RATE;
}

// Calculate dev fee
export function calculateDevFee(amount: number): number {
    return amount * APP_CONFIG.DEV_FEE_PERCENTAGE;
}

// Get random ad duration
export function getRandomAdDuration(): number {
    const min = APP_CONFIG.AD_DURATION_MIN;
    const max = APP_CONFIG.AD_DURATION_MAX;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
