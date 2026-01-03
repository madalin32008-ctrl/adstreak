# 🚀 World App Submission Guide - Viral Edition

AdStreak is designed for **explosive growth**. Follow this guide to submit your Mini App and maximize your chances of getting featured.

## 1. Developer Portal Setup

1. Go to [https://developer.worldcoin.org](https://developer.worldcoin.org)
2. Log in with your World ID.
3. Click **"New App"** -> **"Mini App"**.

## 2. Basic Information (Viral Optimization)

- **Name**: `AdStreak`
- **Display Name**: `AdStreak – Watch & Earn Daily`
- **Category**: `Earn` (This is crucial for visibility)
- **Short Description**: `Watch ads, build streaks, earn crypto.`
- **Detailed Description** (Copy-paste this optimized Spanish copy):
  > ¡Supera MADS! 🔥 Construye rachas infinitas.
  >
  > AdStreak es la mejor app para ganar WLD/USDC real viendo anuncios rápidos.
  >
  > ✨ **Características Épicas:**
  > - **Fire Streaks**: Gana más cada día que vuelves. ¡Llega al día 30 para x50 rewards!
  > - **Verified God Mode**: Usuarios verificados con Orb ganan **20x MÁS**.
  > - **Referrals OP**: Invita amigos y ambos ganan +10 ads diarios PERMANENTES.
  > - **Pagos Reales**: Retira tus ganancias directo a tu wallet.
  >
  > Únete a la racha más caliente de World App. ¿Cuánto durarás sin romper el fuego? 🚀

## 3. Graphics & Assets

- **App Icon**: Upload the generated `icon.svg` (or convert to PNG 512x512).
  - *Tip: The blue orb + fire contrast grabs attention in the store.*
- **Screenshots**: take screenshots of:
  1. **Onboarding**: The "Verified God Mode" screen (high FOMO).
  2. **Dashboard**: Show a high streak (e.g., 7+ days) with big fire animation.
  3. **Ad Player**: The "Tap to Charge" interactive screen.
  4. **Rewards**: The confetti explosion screen with "+2000 Points".

## 4. Technical Configuration

- **App URL**: `https://adstreak-1-git-main-madalins-projects-132d4713.vercel.app`
- **Verification Status**: `Production`
- **Supported Countries**: `All` (Maximize DAU)

## 5. Review Process - "Viral Hooks" Checklist

Ensure these features are working before submission, as reviewers verify them:

- [ ] **World ID Verification**: Must trigger properly. "God Mode" badge must appear.
- [ ] **Ad Playback**: Ads must be watchable (simulation/IMA). No broken links.
- [ ] **Claim Flow**: "Claim" button must simulate a payment command (even if mock for now/devnet).
- [ ] **Performance**: App must load in <2s.

## 6. Launch Strategy (Day 1)

1. **Share to World Chat**: Use the in-app share button.
   > "¡Llevo 5 días en AdStreak! Gana 20x rewards si tienes Orb. Úsalo aquí: [LINK]"
2. **Twitter/X**: Post your streak screenshot with `#WorldApp #WLD`.
3. **Reddit**: Share in r/worldcoin.

## 7. Monetization Note

- Currently configured with **Mock Ads** / **Advanced Simulation**.
- To earn real revenue:
  1. Apply for **Google AdMob** or **AdSense**.
  2. Get a **Rewarded Video Ad Unit ID**.
  3. Update your `.env.local` variable `NEXT_PUBLIC_IMA_AD_TAG_URL`.
  4. The app will automatically switch from simulation to real ads.

---
**GOAL: 10,000 DAU IN WEEK 1. GOOD LUCK!** 🔥
