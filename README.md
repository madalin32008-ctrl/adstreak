# AdStreak - Viral World Mini App

## 🚀 Setup & Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.sample` to `.env.local`
   - Set `NEXT_PUBLIC_APP_ID` from World App Developer Portal
   - Set `AUTH_SECRET` (run `npx auth secret` to generate)

3. **Viral Assets Setup**
   - Place your epic app icon in `public/`
   - Add sound effects to `public/sounds/`:
     - `reward.mp3` (Coin/Success sound)
     - `streak.mp3` (Fire/Level up sound)
     - `click.mp3` (UI interaction)
     - `fire.mp3` (Ambient fire crackle)
     - `confetti.mp3` (Celebration pop)

4. **Run Development Server**

   ```bash
   npm run dev
   ```

## 🧪 Testing Viral Features

### 1. Explosive Onboarding

- **Scenario**: First time user wallet connection.
- **Test**: Reset localStorage (clear site data). Refresh.
- **Expected**:
  - "AdStreak" branding splash.
  - Wallet auto-connect attempt.
  - "Verify God Mode" screen with pulsating 20x badge.
  - Confetti explosion on "Verify" click (simulated).

### 2. Addictive Streak System

- **Scenario**: Watching ads to build streak.
- **Test**: Click "WATCH AD" in dashboard.
- **Expected**:
  - Ad Player overlay opens with countdown.
  - Tap "TAP ME" circle to charge multiplier.
  - "COMPLETE" screen with massively satisfying sound/visuals.
  - Dashboard updates: Streak +1, Fire grows, Points increase.

### 3. Streak Protection & Scaling

- **Scenario**: Exponential scaling logic.
- **Test**: Edit `src/lib/constants.ts` to set `BASE_ADS_DAY1: 100` for testing.
- **Expected**: available ads should skyrocket.

### 4. Google IMA Integration

- **Status**: Currently in "Advanced Simulation" mode.
- **To Enable Real Ads**:
  - Update `.env.local` with `NEXT_PUBLIC_IMA_AD_TAG_URL`.
  - The `AdPlayer` will automatically switch to using the IMA SDK wrapper.

## 📱 Deployment

1. **Build**

   ```bash
   npm run build
   ```

2. **Vercel**
   - Import project to Vercel.
   - Set Environment Variables.
   - Deploy!

3. **World App Submission**
   - Use the generated assets.
   - Submit for review with category "Earn".
