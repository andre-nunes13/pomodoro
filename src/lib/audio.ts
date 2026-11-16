// Web Audio API Synthesizer & Sound Effects Player for Focus98

class SoundManager {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;
  private currentPack: "win98" | "arcade" | "modern" | "mute" = "win98";

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSoundPack(pack: "win98" | "arcade" | "modern" | "mute") {
    this.currentPack = pack;
  }

  public getSoundPack(): "win98" | "arcade" | "modern" | "mute" {
    return this.currentPack;
  }

  // Plays a vintage mechanical / UI button click
  public playClick() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Timer complete alarm (fanfare / alert)
  public playAlarm() {
    if (this.isMuted || this.currentPack === "mute") return;
    // Try to play sound.mp3 if available, or fall back to synth
    try {
      const audio = new Audio("/sound.mp3");
      audio.volume = this.volume;
      audio.play().catch(() => {
        this.synthesizeAlarm();
      });
    } catch {
      this.synthesizeAlarm();
    }
  }

  // Synthesizes a nostalgic Windows 98 style multi-tone chime
  public synthesizeAlarm() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = this.currentPack === "arcade" ? "square" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        const startTime = ctx.currentTime + idx * 0.12;
        const endTime = startTime + 0.35;

        gain.gain.setValueAtTime(this.volume * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {}
  }

  // Plays a celebratory achievement unlock fanfare
  public playAchievement() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const melody = [
        { freq: 440, duration: 0.1 },  // A4
        { freq: 554.37, duration: 0.1 }, // C#5
        { freq: 659.25, duration: 0.1 }, // E5
        { freq: 880, duration: 0.35 },  // A5
      ];

      let t = ctx.currentTime;
      melody.forEach(({ freq, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(this.volume * 0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + duration);

        t += duration * 0.85;
      });
    } catch {}
  }

  // Retro error / warning 'bonk'
  public playWarning() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }

  // Windows 98 style startup sound
  public playStartup() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const chords = [
        [261.63, 329.63, 392.00], // C chord
        [293.66, 369.99, 440.00], // D chord
        [329.63, 415.30, 493.88], // E chord
        [523.25, 659.25, 783.99], // C high
      ];

      chords.forEach((chord, i) => {
        const startTime = ctx.currentTime + i * 0.28;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(this.volume * 0.15, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.6);
        });
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();
