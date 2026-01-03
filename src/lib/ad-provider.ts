// Advanced Ad Simulation with Mini-Games
// Engaging ad playback with interactive elements

import { getRandomAdDuration } from './constants';

export interface MockAd {
    id: string;
    brand: string;
    duration: number; // seconds
    minigame?: 'tap' | 'swipe' | 'shake';
    thumbnail?: string;
}

// Generate a mock ad
export function generateMockAd(): MockAd {
    const brands = [
        'WorldCoin',
        'CryptoMart',
        'DeFi Exchange',
        'NFT Marketplace',
        'Web3 Gaming',
        'MetaStore',
    ];

    const minigames: ('tap' | 'swipe' | 'shake' | undefined)[] = [
        'tap',
        'swipe',
        undefined, // Some ads have no minigame
    ];

    return {
        id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        duration: getRandomAdDuration(),
        minigame: minigames[Math.floor(Math.random() * minigames.length)],
    };
}

// Track ad view (localStorage for stats)
export function trackAdView(adId: string) {
    if (typeof window === 'undefined') return;

    try {
        const key = 'adstreak_ad_stats';
        const stats = JSON.parse(localStorage.getItem(key) || '{}');
        stats[adId] = {
            viewedAt: new Date().toISOString(),
            completed: false,
        };
        localStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
        console.error('Error tracking ad view:', error);
    }
}

// Mark ad as completed
export function markAdCompleted(adId: string, watchTime: number) {
    if (typeof window === 'undefined') return;

    try {
        const key = 'adstreak_ad_stats';
        const stats = JSON.parse(localStorage.getItem(key) || '{}');
        if (stats[adId]) {
            stats[adId].completed = true;
            stats[adId].watchTime = watchTime;
            stats[adId].completedAt = new Date().toISOString();
        }
        localStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
        console.error('Error marking ad completed:', error);
    }
}

// Verify ad completion
export function verifyAdCompletion(adId: string, requiredDuration: number): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const key = 'adstreak_ad_stats';
        const stats = JSON.parse(localStorage.getItem(key) || '{}');
        const adStat = stats[adId];

        if (!adStat) return false;

        return adStat.completed && adStat.watchTime >= requiredDuration;
    } catch (error) {
        console.error('Error verifying ad completion:', error);
        return false;
    }
}

// Google IMA SDK Integration (Placeholder)
// This will be used when real ads are integrated

export interface IMAAdConfig {
    adTagUrl: string;
    adUnitId?: string;
    isTestMode: boolean;
}

export class GoogleIMAAdapter {
    private config: IMAAdConfig;
    private isInitialized = false;

    constructor(config: IMAAdConfig) {
        this.config = config;
    }

    async initialize() {
        // TODO: Load Google IMA SDK
        // For now, return success
        this.isInitialized = true;
        return true;
    }

    async requestAd(): Promise<MockAd | null> {
        if (!this.isInitialized) {
            console.warn('IMA not initialized, falling back to mock ad');
            return generateMockAd();
        }

        if (this.config.isTestMode) {
            // In test mode, return mock ad
            return generateMockAd();
        }

        // TODO: Request real rewarded video ad from Google IMA
        // For now, fallback to mock
        console.log('Real IMA integration pending, using mock ad');
        return generateMockAd();
    }

    async showAd(): Promise<{ completed: boolean; watchTime: number }> {
        // TODO: Display real ad in container
        // For now, return mock completion
        return {
            completed: true,
            watchTime: 30,
        };
    }
}

// Initialize IMA adapter (export for use in components)
export function createIMAAdapter(): GoogleIMAAdapter {
    const config: IMAAdConfig = {
        adTagUrl: process.env.NEXT_PUBLIC_IMA_AD_TAG_URL || '',
        adUnitId: process.env.NEXT_PUBLIC_IMA_AD_UNIT_ID,
        isTestMode: process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_IMA_AD_TAG_URL,
    };

    return new GoogleIMAAdapter(config);
}
