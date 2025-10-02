/**
 * Plays a sound effect
 * @param soundPath - Path to the sound file in the public directory (e.g., '/call-connect.mp3')
 * @param volume - Volume level between 0 and 1 (default: 0.5)
 */
export function playSound(soundPath: string, volume: number = 0.5): void {
  try {
    const audio = new Audio(soundPath);
    audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    audio.play().catch((error) => {
      console.warn('Failed to play sound:', error);
    });
  } catch (error) {
    console.warn('Error creating audio:', error);
  }
}

/**
 * Creates and plays a looping sound effect
 * @param soundPath - Path to the sound file in the public directory (e.g., '/ringing.mp3')
 * @param volume - Volume level between 0 and 1 (default: 0.5)
 * @returns Audio object that can be controlled (e.g., stopped with .pause())
 */
export function playLoopingSound(soundPath: string, volume: number = 0.5): HTMLAudioElement | null {
  try {
    const audio = new Audio(soundPath);
    audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    audio.loop = true;
    audio.play().catch((error) => {
      console.warn('Failed to play looping sound:', error);
    });
    return audio;
  } catch (error) {
    console.warn('Error creating looping audio:', error);
    return null;
  }
}
