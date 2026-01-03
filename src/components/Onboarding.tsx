'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { minikit } from '@/lib/minikit';
import { Button } from './Button';
import { FireEffect } from './FireEffect';
import Confetti from 'react-confetti';
import { walletAuth } from '@/auth/wallet'; // Using template's auth logic

interface OnboardingProps {
    onComplete: (isVerified: boolean) => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
    const { isInstalled } = useMiniKit();
    const [step, setStep] = useState<'welcome' | 'wallet' | 'verify' | 'completed'>('welcome');
    const [isVerifying, setIsVerifying] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Handle window size for confetti
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }

        // Auto-advance welcome to wallet after small delay
        if (step === 'welcome') {
            const timer = setTimeout(() => {
                setStep('wallet');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Auto-Login (Wallet Connect)
    useEffect(() => {
        const autoLogin = async () => {
            if (step === 'wallet' && isInstalled) {
                try {
                    // Attempt auto-login using template's auth
                    await walletAuth();
                    // If successful (or silent), move to next step
                    // In real app, we'd check session status here
                    setStep('verify');
                } catch (e) {
                    console.error("Auto login failed", e);
                    // If auto fails, stay on wallet step for manual retry
                }
            }
        };

        autoLogin();
    }, [step, isInstalled]);

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            // Trigger World ID verification
            const result = await minikit.verifyWorldID();

            // In development/mock or if command wraps async:
            // Real World App will redirect or callback.
            // For this simplified flow, we assume success or handle the callback elsewhere.
            // We'll simulate success for the UI flow if we get a result ref.

            if (result) {
                setShowConfetti(true);
                setStep('completed');
                setTimeout(() => {
                    onComplete(true);
                }, 4000); // Wait for confetti
            }
        } catch (error) {
            console.error('Verification failed', error);
            setIsVerifying(false);
        }
    };

    const handleSkip = () => {
        if (confirm("¿Estás seguro? Perderás el bono 20x y el modo 'Verified God'.")) {
            onComplete(false); // Not verified
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden">
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={500} recycle={false} />}

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[100px]" />
            </div>

            <AnimatePresence mode="wait">

                {step === 'welcome' && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mb-8 flex justify-center"
                        >
                            <FireEffect size="xl" intensity={1.5} />
                        </motion.div>
                        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
                            AdStreak
                        </h1>
                        <p className="text-xl text-neutral-300">
                            Watch. Earn. <span className="text-orange-500 font-bold">Burn.</span>
                        </p>
                    </motion.div>
                )}

                {step === 'wallet' && (
                    <motion.div
                        key="wallet"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="text-center w-full max-w-md"
                    >
                        <h2 className="text-2xl font-bold mb-6">Conectando Wallet...</h2>
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-slate-400 mb-8">Secure login via World App</p>
                        <Button onClick={() => walletAuth()} variant="ghost">
                            Reintentar Manualmente
                        </Button>

                        {/* Dev / Guest Bypass */}
                        <div className="mt-4">
                            <button
                                onClick={() => setStep('verify')}
                                className="text-xs text-slate-500 hover:text-white underline"
                            >
                                [DEV] Enter as Guest
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'verify' && (
                    <motion.div
                        key="verify"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center w-full max-w-md"
                    >
                        <div className="mb-4 inline-block px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-300 font-bold text-sm border border-yellow-500/50 animate-pulse">
                            🚀 20x EARNINGS MULTIPLIER
                        </div>

                        <h2 className="text-3xl font-bold mb-4">Verifica que eres Humano</h2>
                        <p className="text-slate-300 mb-8 leading-relaxed">
                            Evitamos bots para pagarte más. <br />
                            <span className="text-white font-bold">Verificados ganan 20x más puntos.</span>
                        </p>

                        <div className="flex justify-center mb-10 relative">
                            <motion.div
                                className="absolute inset-0 bg-blue-500 blur-xl opacity-20"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            {/* Fallback visual */}
                            <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center relative z-10 bg-black">
                                <span className="text-4xl">🆔</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleVerify}
                            variant="primary"
                            size="lg"
                            className="w-full mb-4 text-lg py-4"
                            pulsing={true}
                            isLoading={isVerifying}
                        >
                            Verify with World ID
                        </Button>

                        <Button onClick={handleSkip} variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                            No thanks, I hate money (1x rewards)
                        </Button>
                    </motion.div>
                )}

                {step === 'completed' && (
                    <motion.div
                        key="completed"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500">
                            VERIFIED GOD MODE
                        </h2>
                        <p className="text-2xl font-bold text-white mb-8">x20 Multiplier Active!</p>
                        <FireEffect size="xl" intensity={2} />
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};
