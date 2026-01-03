'use client';

import { useState, useEffect } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';
import { UserData, getUserData, saveUserData, updateUserData } from '@/lib/storage';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { minikit } from '@/lib/minikit';
import { initSounds } from '@/lib/sounds';

export default function Home() {
  const { isInstalled } = useMiniKit();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize
  useEffect(() => {
    // Init audio
    initSounds();

    // Load User Data
    const loadUser = async () => {
      // In a real app we might wait for wallet auth first
      // For this demo, we check minikit wallet or stored wallet
      const wallet = minikit.getWalletAddress() || '0x_guest'; // Fallback for dev

      const stored = getUserData(wallet);

      // Determine if new user (based on created date ~ now or flag)
      // Or just check if they have verified or completed tutorial
      // For simplicity: if currentStreak == 0 and totalAds == 0 -> Show onboarding
      if (stored.totalAdsWatched === 0 && !stored.isWorldIDVerified) {
        setShowOnboarding(true);
      }

      setUserData(stored);
      setLoading(false);
    };

    if (typeof window !== 'undefined') {
      // Short delay to allow MiniKit to inject
      setTimeout(loadUser, 500);
    }
  }, [isInstalled]);

  const handleOnboardingComplete = (isVerified: boolean) => {
    if (!userData) return;

    // Update user status
    const newData = updateUserData(userData.walletAddress, {
      isWorldIDVerified: isVerified,
    });

    setUserData(newData);
    setShowOnboarding(false);
  };

  const handleDataUpdate = (newData: UserData) => {
    setUserData(newData);
    saveUserData(newData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30">
      {/* Background Ambient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        userData && <Dashboard userData={userData} onUpdate={handleDataUpdate} />
      )}
    </main>
  );
}
