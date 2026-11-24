/**
 * Native Browser Web Audio API Synthesizer
 * 
 * Generates subtle, non-intrusive mechanical/editorial acoustic feedback
 * purely via native AudioContext oscillators and biquad filters.
 * 
 * 100% offline-ready with zero external audio assets, sound files, or font CDNs.
 */

class AudioFeedbackService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized lazily on first user interaction
    // to comply with browser autoplay policies.
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (this.ctx) return this.ctx;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      // AudioContext unavailable or restricted in this environment
      this.ctx = null;
    }
    return this.ctx;
  }

  /**
   * Resumes AudioContext if suspended (browser gesture requirement).
   */
  private resumeContext(ctx: AudioContext) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Play a brief, subtle tactile click (~18ms) using a filtered sine burst.
   */
  public playClick(pitch: number = 850) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    this.resumeContext(ctx);

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Bandpass shaping for an editorial fountain-pen / switch tick
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(pitch, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.45, now + 0.018);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Graceful silence on any audio dispatch error
    }
  }

  /**
   * Subtle two-tone toggle sound for switch controls.
   */
  public playToggle(active: boolean) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    this.resumeContext(ctx);

    try {
      const now = ctx.currentTime;
      const startFreq = active ? 520 : 740;
      const endFreq = active ? 740 : 520;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.035);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  /**
   * Terminal command feedback chirp (~24ms).
   */
  public playTerminalBeep(success: boolean = true) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    this.resumeContext(ctx);

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = success ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(success ? 1046.5 : 329.6, now); // C6 or E4
      if (success) {
        osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.025); // E6
      }

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  /**
   * Resonant Letter Pop & Harmonic Chime (~75ms).
   * Distinct, crisp, resonant acoustic bell / mechanical pop sound
   * synthesized natively via dual oscillators and exponential gain envelope.
   * Modulates frequency across a pentatonic overtone scale based on letter index.
   */
  public playLetterClick(index: number = 0, isOrange: boolean = true) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    this.resumeContext(ctx);

    try {
      const now = ctx.currentTime;
      // Pentatonic overtone scale frequencies: C5, D5, E5, G5, A5, C6, D6, E6, G6, A6, C7...
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00];
      const baseFreq = scale[Math.abs(index) % scale.length];
      const freq = isOrange ? baseFreq : baseFreq * 0.75;

      // Primary tone oscillator (warm triangle with exponential decay)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.frequency.exponentialRampToValueAtTime(freq * 0.96, now + 0.07);

      gain1.gain.setValueAtTime(0.065, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Distinct mechanical transient 'pop' (crisp high sine burst, 14ms)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.5, now);
      osc2.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.015);

      gain2.gain.setValueAtTime(0.05, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.02);
    } catch {}
  }
}

export const audioService = new AudioFeedbackService();
