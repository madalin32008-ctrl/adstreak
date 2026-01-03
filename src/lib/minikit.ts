import {
    MiniKit,
    VerificationLevel,
    PayCommandInput,
    Tokens,
} from '@worldcoin/minikit-js';
import { APP_CONFIG } from './constants';

export type VerifyAction = 'login' | 'verify-human' | 'claim-reward';

export const minikit = {
    // Check if MiniKit is installed/available
    isInstalled: () => {
        return typeof window !== 'undefined' && MiniKit.isInstalled();
    },

    // Get current wallet address
    getWalletAddress: () => {
        if (typeof window === 'undefined') return null;
        // MiniKit.walletAddress not available on static type
        return null;
    },

    // Trigger wallet connection (signin)
    connectWallet: async () => {
        if (!MiniKit.isInstalled()) return null;
        // In Mini Apps, the wallet is usually already connected or accessible via MiniKit.walletAddress
        // This method is primarily for explicitly requesting permissions if needed or handling flow
        return null;
    },

    // Verify World ID
    verifyWorldID: async (action: VerifyAction = 'verify-human') => {
        if (!MiniKit.isInstalled()) {
            console.warn('MiniKit not installed');
            return null;
        }

        const uuid = crypto.randomUUID().replace(/-/g, '');

        const payload = {
            action,
            signal: '', // Optional
            verification_level: VerificationLevel.Orb, // Require Orb for 20x bonus (God Mode)
            ref: uuid, // Unique reference
        };

        // return MiniKit.commands.verify(payload);
        console.log('Mocking verify for development if needed, or calling actual command');

        // Note: The actual command returns immediately. The result comes via callback/useEffect hook.
        // For this helper, we might just initiate it.
        MiniKit.commands.verify(payload);
        return uuid;
    },

    // Initiate Payment (Claim Reward)
    initiatePayment: async (amount: number, label: string) => {
        if (!MiniKit.isInstalled()) return;

        const uuid = crypto.randomUUID().replace(/-/g, '');

        const payload: PayCommandInput = {
            reference: uuid,
            to: APP_CONFIG.DEV_WALLET_ADDRESS,
            tokens: [
                {
                    symbol: Tokens.WLD,
                    token_amount: amount.toString(),
                },
            ],
            description: label,
        };

        return MiniKit.commands.pay(payload);
    },
};
