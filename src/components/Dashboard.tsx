'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StreakChain } from './StreakChain';
import { AdPlayer } from './AdPlayer';
import { Button } from './Button';
import { APP_CONFIG, getAvailableAds, calculateAdReward, pointsToWLD } from '@/lib/constants';
import { UserData, recordAdWatch, recordClaim, getAvailablePoints } from '@/lib/storage';
import { generateMockAd, MockAd } from '@/lib/ad-provider';
import Confetti from 'react-confetti';
import { playRewardSound } from '@/lib/sounds';

interface DashboardProps {
    userData: UserData;
    onUpdate: (newData: UserData) => void;
}

export const Dashboard = ({ userData, onUpdate }: DashboardProps) => {
    const [isPlayingAd, setIsPlayingAd] = useState(false);
    const [currentAd, setCurrentAd] = useState<MockAd | null>(null);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [lastReward, setLastReward] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);

    // Derived state
    const availableAds = getAvailableAds(userData.currentStreak, userData.isWorldIDVerified);
    const adsRemaining = Math.max(0, availableAds - userData.adsWatchedToday);
    const claimableWLD = pointsToWLD(getAvailablePoints(userData));
    const nextAdBonus = calculateAdReward(userData.currentStreak, userData.isWorldIDVerified, true);

    const handleWatchAd = () => {
        if (adsRemaining <= 0) return;
        const ad = generateMockAd(); // Or use IMA adapter
        setCurrentAd(ad);
        setIsPlayingAd(true);
    };

    const handleAdComplete = async (watchedDuration: number) => {
        setIsPlayingAd(false);

        // Reward calculation
        const isFullWatch = watchedDuration >= (currentAd?.duration || 15);
        const points = calculateAdReward(userData.currentStreak, userData.isWorldIDVerified, isFullWatch);

        // Update storage
        const newData = recordAdWatch(userData.walletAddress, points);
        onUpdate(newData); // Optimistic update

        // Show visual feedback
        setLastReward(points);
        setShowRewardModal(true);
        playRewardSound();

        setTimeout(() => {
            setShowRewardModal(false);
        }, 3000);
    };

    const handleClaim = async () => {
        if (claimableWLD < APP_CONFIG.MIN_CLAIM_AMOUNT_WLD) return;
        setIsClaiming(true);

        try {
            // Simulate claim for now or trigger payment
            // In real flow: await minikit.initiatePayment(...) if User -> App
            // Or backend transfer if App -> User.

            // SImulate success
            setTimeout(() => {
                const newData = recordClaim(userData.walletAddress, getAvailablePoints(userData), claimableWLD, 'mock_tx_hash');
                onUpdate(newData);
                setIsClaiming(false);
                alert(`Successfully claimed ${claimableWLD.toFixed(4)} WLD! (Simulation)`);
            }, 2000);

        } catch (e) {
            console.error(e);
            setIsClaiming(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto pb-24 px-4 pt-6">
            {/* Reward Modal Overlay */}
            {showRewardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <Confetti numberOfPieces={200} recycle={false} />
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-slate-900 border border-yellow-500/50 p-8 rounded-2xl shadow-2xl flex flex-col items-center"
                    >
                        <div className="text-4xl mb-2">🔥</div>
                        <div className="text-5xl font-black text-yellow-400">+{lastReward}</div>
                        <div className="text-sm font-bold text-yellow-600 uppercase tracking-widest mt-2">Points Earned</div>
                    </motion.div>
                </div>
            )}

            {/* Ad Player */}
            {isPlayingAd && currentAd && (
                <AdPlayer
                    ad={currentAd}
                    onComplete={handleAdComplete}
                    onCancel={() => setIsPlayingAd(false)}
                />
            )}

            {/* Header Stats */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase">Balance</span>
                    <div className="text-2xl font-black text-white">{getAvailablePoints(userData).toLocaleString()} <span className="text-base font-normal text-slate-500">pts</span></div>
                    <span className="text-green-400 text-xs font-bold">≈ {claimableWLD.toFixed(4)} WLD</span>
                </div>
                <div className={`px-3 py-1 rounded-full border ${userData.isWorldIDVerified ? 'bg-blue-900/30 border-blue-500/50 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'} text-xs font-bold flex items-center gap-1`}>
                    {userData.isWorldIDVerified ? (
                        <><span>Verified God</span> ✨</>
                    ) : (
                        <><span>Peasant (1x)</span> 💀</>
                    )}
                </div>
            </div>

            {/* Streak Visualization */}
            <div className="mb-8">
                <StreakChain
                    streak={userData.currentStreak}
                    maxDailyAds={availableAds}
                    adsWatched={userData.adsWatchedToday}
                />
            </div>

            {/* Main Action */}
            <div className="mb-8">
                <Button
                    variant="premium"
                    size="lg"
                    className="w-full h-20 text-2xl shadow-orange-500/20"
                    pulsing={adsRemaining > 0}
                    onClick={handleWatchAd}
                    disabled={adsRemaining <= 0}
                >
                    {adsRemaining > 0 ? (
                        <div className="flex flex-col items-center leading-none">
                            <span className="drop-shadow-md">WATCH AD</span>
                            <span className="text-xs font-normal opacity-90 mt-1">Earn +{nextAdBonus} pts</span>
                        </div>
                    ) : (
                        <span className="text-slate-400">Limit Reached (Come back tmrw)</span>
                    )}
                </Button>
                <p className="text-center text-slate-500 text-xs mt-3">
                    {adsRemaining} ads remaining today • Boosts enabled
                </p>
            </div>

            {/* Claim Section */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-300">Wallet Claim</span>
                    <span className="text-xs text-slate-500">Min: {APP_CONFIG.MIN_CLAIM_AMOUNT_WLD} WLD</span>
                </div>
                <Button
                    variant="primary"
                    className="w-full bg-slate-800 hover:bg-slate-700 border-slate-900"
                    disabled={claimableWLD < APP_CONFIG.MIN_CLAIM_AMOUNT_WLD || isClaiming}
                    onClick={handleClaim}
                    isLoading={isClaiming}
                >
                    {claimableWLD < APP_CONFIG.MIN_CLAIM_AMOUNT_WLD
                        ? `Need ${(APP_CONFIG.MIN_CLAIM_AMOUNT_WLD - claimableWLD).toFixed(4)} more WLD`
                        : 'CLAIM TO WALLET NOW 💸'}
                </Button>
            </div>
        </div>
    );
};
