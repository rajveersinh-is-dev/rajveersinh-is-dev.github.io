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
}

export const audioService = new AudioFeedbackService();
