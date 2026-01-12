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

  // Mechanical click sound - short, percussive tick
  playClick() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Short impulse oscillator for the "tick"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Add filter for more punch
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    osc.type = 'square';
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Fixed frequency - no sweep for a sharper click
    osc.frequency.setValueAtTime(1800, now);

    // Very fast attack and decay for crisp click
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.025);

    osc.start(now);
    osc.stop(now + 0.03);

    // Prominent noise burst for mechanical click character
    this.addNoiseBurst(0.12, 0.02);
  }

  // Hover tick - subtle, soft click for hover feedback
  playHover() {
    if (!this.enabled || !this.audioContext) return;

    // Throttle hover sounds
    const now = Date.now();
    if (now - this.lastHoverTime < this.hoverThrottle) return;
    this.lastHoverTime = now;

    this.resume();

    const ctx = this.audioContext;
    const time = ctx.currentTime;

    // Just a subtle noise tick, no tonal element
    this.addNoiseBurst(0.06, 0.012);
  }

  // Toggle switch sound - mechanical snap
  playToggle() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Single sharp click with low thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 2;

    osc.type = 'square';
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Quick pitch drop for mechanical snap
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    osc.start(now);
    osc.stop(now + 0.035);

    // Noise for that physical switch character
    this.addNoiseBurst(0.1, 0.025);
  }

  // Sound when enabling audio - crisp double-click activation
  playToggleOn() {
    if (!this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // First click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    filter1.type = 'highpass';
    filter1.frequency.value = 1200;

    osc1.type = 'square';
    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.frequency.setValueAtTime(2200, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

    osc1.start(now);
    osc1.stop(now + 0.025);

    // Second click (slightly delayed, slightly higher)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const filter2 = ctx.createBiquadFilter();

    filter2.type = 'highpass';
    filter2.frequency.value = 1200;

    osc2.type = 'square';
    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.frequency.setValueAtTime(2600, now + 0.04);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.15, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.065);

    osc2.start(now + 0.04);
    osc2.stop(now + 0.07);

    // Noise bursts for both clicks
    this.addNoiseBurst(0.1, 0.015);
    setTimeout(() => this.addNoiseBurst(0.12, 0.018), 40);
  }

  // Card expand sound - soft mechanical open
  playExpand() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 1;

    osc.type = 'square';
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Quick drop for mechanical feel
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.025);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    osc.start(now);
    osc.stop(now + 0.045);

    this.addNoiseBurst(0.08, 0.02);
  }

  // Card collapse sound - soft mechanical close
  playCollapse() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1;

    osc.type = 'square';
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Quick rise for close feel
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.02);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.035);

    osc.start(now);
    osc.stop(now + 0.04);

    this.addNoiseBurst(0.06, 0.015);
  }

  // Select/filter sound - crisp selection click
  playSelect() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.value = 1000;

    osc.type = 'square';
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Single sharp click
    osc.frequency.setValueAtTime(2000, now);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.025);

    osc.start(now);
    osc.stop(now + 0.03);

    this.addNoiseBurst(0.1, 0.018);
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
