// Retro Terminal Sound Manager - Pip-Boy/Fallout style interface sounds
// Uses Web Audio API for synthesized CRT-like clicks and blips

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = false; // Default OFF - opt-in only
    this.lastHoverTime = 0;
    this.hoverThrottle = 100; // ms between hover sounds
    this.initialized = false;
  }

  // Initialize audio context (must be called after user interaction)
  init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;

      // Load preference from localStorage
      const savedPref = localStorage.getItem('soundEnabled');
      this.enabled = savedPref === 'true';

      // Resume context if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  // Resume audio context after user gesture
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled.toString());

    // Play a confirmation sound when enabling
    if (this.enabled) {
      this.init();
      this.playToggleOn();
    }

    return this.enabled;
  }

  // Get current state
  isEnabled() {
    return this.enabled;
  }

  // CRT Click sound - crisp, short click for buttons/links
  // Frequency sweep from 800Hz to 200Hz over 50ms
  playClick() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Main oscillator - square wave for that digital crunch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Add slight distortion for CRT character
    const distortion = ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(20);

    osc.type = 'square';
    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(ctx.destination);

    // Frequency sweep down (descending blip)
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    // Volume envelope - quick attack, medium decay
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.start(now);
    osc.stop(now + 0.07);

    // Add subtle noise burst for that mechanical click feel
    this.addNoiseBurst(0.08, 0.03);
  }

  // Hover blip - softer, higher pitched, shorter
  playHover() {
    if (!this.enabled || !this.audioContext) return;

    // Throttle hover sounds
    const now = Date.now();
    if (now - this.lastHoverTime < this.hoverThrottle) return;
    this.lastHoverTime = now;

    this.resume();

    const ctx = this.audioContext;
    const time = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine'; // Softer tone for hover
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Higher pitched, short sweep
    osc.frequency.setValueAtTime(1200, time);
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.02);

    // Quieter than click
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.025);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  // Toggle switch sound - mechanical switch with satisfying clunk
  playToggle() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Two-tone for mechanical feel
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'triangle';

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    // First tone - low thunk
    osc1.frequency.setValueAtTime(400, now);
    osc1.frequency.exponentialRampToValueAtTime(150, now + 0.04);

    // Second tone - higher click
    osc2.frequency.setValueAtTime(600, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc1.start(now);
    osc1.stop(now + 0.05);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.06);

    this.addNoiseBurst(0.05, 0.04);
  }

  // Sound when enabling audio - cheerful ascending beep
  playToggleOn() {
    if (!this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Ascending chirp
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    osc.frequency.setValueAtTime(1000, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Card expand sound - descending whoosh
  playExpand() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';

    osc.type = 'sawtooth';
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Descending sweep for expand
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    // Filter sweep for whoosh effect
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Card collapse sound - ascending whoosh
  playCollapse() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';

    osc.type = 'sawtooth';
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Ascending sweep for collapse
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);

    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Select/filter sound - crisp selection beep
  playSelect() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Quick double-beep
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.setValueAtTime(900, now + 0.03);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.06);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.setValueAtTime(0.15, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Add noise burst for that CRT/mechanical character
  addNoiseBurst(volume = 0.05, duration = 0.02) {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    noise.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseGain.gain.setValueAtTime(volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.start(now);
    noise.stop(now + duration);
  }

  // Distortion curve for that CRT crunch
  makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    return curve;
  }
}

// Singleton instance
const soundManager = new SoundManager();

// Export for use in components
export default soundManager;

// Also export individual functions for convenience
export const initSound = () => soundManager.init();
export const toggleSound = () => soundManager.toggle();
export const isEnabled = () => soundManager.isEnabled();
export const playClick = () => soundManager.playClick();
export const playHover = () => soundManager.playHover();
export const playToggle = () => soundManager.playToggle();
export const playSelect = () => soundManager.playSelect();
export const playExpand = () => soundManager.playExpand();
export const playCollapse = () => soundManager.playCollapse();
