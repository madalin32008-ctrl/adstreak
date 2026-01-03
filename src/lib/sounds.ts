// Sound Effects Management with Howler.js
// Epic audio for addictive UX

import { Howl } from 'howler';

// Sound effect URLs (will use generated sounds or public domain)
const SOUNDS = {
    reward: '/sounds/reward.mp3',
    streak: '/sounds/streak.mp3',
    achievement: '/sounds/achievement.mp3',
    click: '/sounds/click.mp3',
    fire: '/sounds/fire.mp3',
    confetti: '/sounds/confetti.mp3',
};

// Sound instances
const soundInstances: Record<string, Howl> = {};
let soundsEnabled = true;

// Initialize sounds
export function initSounds() {
    if (typeof window === 'undefined') return;

    // Load sound enabled preference
    const stored = localStorage.getItem('adstreak_sounds_enabled');
    soundsEnabled = stored !== 'false';

    // Pre-load all sounds for instant playback
    Object.entries(SOUNDS).forEach(([key, src]) => {
        soundInstances[key] = new Howl({
            src: [src],
            volume: 0.5,
            preload: true,
        });
    });
}

// Play sound effect
export function playSound(sound: keyof typeof SOUNDS, volume: number = 0.5) {
    if (!soundsEnabled || typeof window === 'undefined') return;

    const soundInstance = soundInstances[sound];
    if (soundInstance) {
        soundInstance.volume(volume);
        soundInstance.play();
    }
}

// Play reward sound
export function playRewardSound() {
    playSound('reward', 0.7);
}

// Play streak sound (for milestones)
export function playStreakSound() {
    playSound('streak', 0.8);
}

// Play achievement unlock sound
export function playAchievementSound() {
    playSound('achievement', 0.8);
}

// Play click sound
export function playClickSound() {
    playSound('click', 0.3);
}

// Play fire crackle (for streak effects)
export function playFireSound() {
    playSound('fire', 0.4);
}

// Play confetti sound
export function playConfettiSound() {
    playSound('confetti', 0.6);
}

// Toggle sounds on/off
export function toggleSounds(): boolean {
    soundsEnabled = !soundsEnabled;
    localStorage.setItem('adstreak_sounds_enabled', soundsEnabled.toString());
    return soundsEnabled;
}

// Check if sounds are enabled
export function areSoundsEnabled(): boolean {
    return soundsEnabled;
}

// Set volume for all sounds
export function setGlobalVolume(volume: number) {
    Object.values(soundInstances).forEach(sound => {
        sound.volume(volume);
    });
}
