// Web Audio API Synthesizer & Sound Effects Player for Focus98

class SoundManager {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;
  private currentPack: "win98" | "arcade" | "xp" | "modern" | "mute" = "win98";

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

  public setSoundPack(pack: "win98" | "arcade" | "xp" | "modern" | "mute") {
    this.currentPack = pack;
  }

  public getSoundPack(): "win98" | "arcade" | "xp" | "modern" | "mute" {
    return this.currentPack;
  }

  // Plays a UI button click, flavored by the active pack
  public playClick() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (this.currentPack === "xp") {
        // XP-flavored two-part tick: soft wooden body + bright cap
        const body = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        body.type = "triangle";
        body.frequency.setValueAtTime(520, ctx.currentTime);
        body.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.06);
        bodyGain.gain.setValueAtTime(this.volume * 0.14, ctx.currentTime);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        body.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        body.start();
        body.stop(ctx.currentTime + 0.07);

        const cap = ctx.createOscillator();
        const capGain = ctx.createGain();
        cap.type = "square";
        cap.frequency.setValueAtTime(1500, ctx.currentTime);
        cap.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.02);
        capGain.gain.setValueAtTime(this.volume * 0.05, ctx.currentTime);
        capGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        cap.connect(capGain);
        capGain.connect(ctx.destination);
        cap.start();
        cap.stop(ctx.currentTime + 0.03);
      } else if (this.currentPack === "modern") {
        // Soft sine blip with a gentle attack
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.1, ctx.currentTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        // win98 / arcade: vintage mechanical click
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
      }
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Timer complete alarm (fanfare / alert)
  public playAlarm() {
    if (this.isMuted || this.currentPack === "mute") return;
    // xp / modern packs use their own synth voices so pack choice is audible;
    // win98 / arcade keep the recorded alarm with synth fallback
    if (this.currentPack === "xp" || this.currentPack === "modern") {
      this.synthesizeAlarm();
      return;
    }
    // Try to play alarm.mp3 if available, or fall back to synth
    try {
      const audio = new Audio("/sounds/alarm.mp3");
      audio.volume = this.volume;
      audio.play().catch(() => {
        this.synthesizeAlarm();
      });
    } catch {
      this.synthesizeAlarm();
    }
  }

  // Synthesizes the timer-complete chime for the active sound pack
  public synthesizeAlarm() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (this.currentPack === "xp") {
        // Warm XP-style bell arpeggio with slightly detuned layers
        const notes = [392.0, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
        notes.forEach((freq, idx) => {
          const startTime = ctx.currentTime + idx * 0.14;
          const endTime = startTime + 0.75;

          [freq, freq * 1.005].forEach((layerFreq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(layerFreq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(this.volume * 0.13, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, endTime);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(endTime);
          });
        });
      } else if (this.currentPack === "modern") {
        // Soft sine tones with a gentle attack and lower level
        const notes = [349.23, 440.0, 523.25, 698.46]; // F4, A4, C5, F5
        notes.forEach((freq, idx) => {
          const startTime = ctx.currentTime + idx * 0.14;
          const endTime = startTime + 0.55;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, endTime);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(endTime);
        });
      } else {
        // win98 / arcade: nostalgic multi-tone chime
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
      }
    } catch {}
  }

  // Plays a celebratory achievement unlock fanfare
  public playAchievement() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (this.currentPack === "xp") {
        // Warm XP-style ascending fanfare on sine voices with a shimmering tail
        const melody = [
          { freq: 392.0, duration: 0.12 },    // G4
          { freq: 523.25, duration: 0.12 },   // C5
          { freq: 659.25, duration: 0.14 },   // E5
          { freq: 1046.5, duration: 0.55 },   // C6
        ];

        let t = ctx.currentTime;
        melody.forEach(({ freq, duration }, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(this.volume * 0.3, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + duration);

          // Octave shimmer on the held final note
          if (idx === melody.length - 1) {
            const shimmer = ctx.createOscillator();
            const shimmerGain = ctx.createGain();

            shimmer.type = "triangle";
            shimmer.frequency.setValueAtTime(freq * 2, t);

            shimmerGain.gain.setValueAtTime(0.001, t);
            shimmerGain.gain.linearRampToValueAtTime(this.volume * 0.1, t + 0.03);
            shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

            shimmer.connect(shimmerGain);
            shimmerGain.connect(ctx.destination);

            shimmer.start(t);
            shimmer.stop(t + duration);
          }

          t += duration * 0.85;
        });
      } else if (this.currentPack === "modern") {
        // Gentle sine arpeggio with soft attacks and a lower level
        const melody = [
          { freq: 659.25, duration: 0.14 },   // E5
          { freq: 783.99, duration: 0.14 },   // G5
          { freq: 987.77, duration: 0.14 },   // B5
          { freq: 1318.51, duration: 0.45 },  // E6
        ];

        let t = ctx.currentTime;
        melody.forEach(({ freq, duration }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(this.volume * 0.22, t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + duration);

          t += duration * 0.85;
        });
      } else {
        // win98 / arcade: original triangle fanfare
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
      }
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

      if (this.currentPack === "xp") {
        // Rounder, horn-like denial tone with a gentle attack
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.22, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (this.currentPack === "modern") {
        // Soft sine dip with a slow attack and low level
        osc.type = "sine";
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.12, ctx.currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else {
        // win98 / arcade: original sawtooth bonk
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
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

  // Builds warm pad/chime voice helpers bound to a destination node (XP jingles)
  private createJingleVoices(ctx: AudioContext, destination: AudioNode) {
    // Layered pad chord: two slightly detuned oscillators per note
    const playPadChord = (notes: number[], start: number, attack: number, holdEnd: number, release: number) => {
      notes.forEach((freq) => {
        [1, 1.005].forEach((detune) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.value = freq * detune;

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.05, start + attack);
          gain.gain.setValueAtTime(0.05, holdEnd);
          gain.gain.exponentialRampToValueAtTime(0.001, holdEnd + release);

          osc.connect(gain);
          gain.connect(destination);

          osc.start(start);
          osc.stop(holdEnd + release + 0.05);
        });
      });
    };

    // Bright bell note with a gentle attack and long decay
    const playBell = (freq: number, start: number, decay: number, level: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(level, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + decay);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(start);
      osc.stop(start + decay + 0.05);
    };

    return { playPadChord, playBell };
  }

  // Windows XP style startup motif: warm layered chords under a bright chime (~5.5 s)
  public playStartupXp() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const t0 = ctx.currentTime;

      // Gentle lowpass "bloom" over a constant volume master bus
      const master = ctx.createGain();
      master.gain.value = this.volume;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 0.7;
      filter.frequency.setValueAtTime(1200, t0);
      filter.frequency.exponentialRampToValueAtTime(4500, t0 + 1.2);
      filter.connect(master);
      master.connect(ctx.destination);

      const { playPadChord, playBell } = this.createJingleVoices(ctx, filter);

      // Rising, resolving progression: F -> Bb -> C
      playPadChord([174.61, 220.0, 261.63], t0, 0.5, t0 + 1.6, 1.4); // F major
      playPadChord([233.08, 293.66, 349.23], t0 + 1.5, 0.4, t0 + 3.0, 1.5); // Bb major
      playPadChord([261.63, 329.63, 392.0, 523.25], t0 + 3.0, 0.4, t0 + 3.6, 2.0); // C major

      // Bright chime figure on top of the pad
      playBell(523.25, t0 + 0.35, 0.9, 0.14); // C5
      playBell(659.25, t0 + 0.8, 0.9, 0.14); // E5
      playBell(783.99, t0 + 1.25, 1.1, 0.14); // G5
      playBell(1046.5, t0 + 1.7, 1.4, 0.13); // C6
      playBell(1318.51, t0 + 3.05, 2.4, 0.1); // E6 shimmer on the final chord
    } catch {}
  }

  // Windows XP style shutdown motif: descending, resolving chords (~3 s)
  public playShutdownXp() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const t0 = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.value = this.volume;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 3500;
      filter.Q.value = 0.7;
      filter.connect(master);
      master.connect(ctx.destination);

      const { playPadChord, playBell } = this.createJingleVoices(ctx, filter);

      // Descending resolve: C -> G/B -> F -> C
      playPadChord([261.63, 329.63, 392.0], t0, 0.15, t0 + 0.7, 1.0); // C major
      playPadChord([246.94, 293.66, 392.0], t0 + 0.55, 0.15, t0 + 1.25, 1.0); // G/B
      playPadChord([220.0, 261.63, 349.23], t0 + 1.1, 0.15, t0 + 1.7, 1.0); // F major
      playPadChord([196.0, 261.63, 329.63], t0 + 1.65, 0.15, t0 + 2.0, 0.9); // C/G

      // Soft bells stepping down with the chords
      playBell(523.25, t0, 0.7, 0.12); // C5
      playBell(440.0, t0 + 0.55, 0.7, 0.12); // A4
      playBell(349.23, t0 + 1.1, 0.8, 0.12); // F4
      playBell(261.63, t0 + 1.65, 1.3, 0.13); // C4
    } catch {}
  }

  // XP "critical stop": short, slightly dissonant two-tone dun-dun
  public playError() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const tones: { freq: number; start: number; duration: number; level: number }[] = [
        { freq: 207.65, start: 0, duration: 0.1, level: 0.2 }, // Ab3
        { freq: 155.56, start: 0.14, duration: 0.18, level: 0.22 }, // Eb3
      ];

      tones.forEach(({ freq, start, duration, level }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const toneStart = ctx.currentTime + start;

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, toneStart);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.92, toneStart + duration);

        gain.gain.setValueAtTime(this.volume * level, toneStart);
        gain.gain.exponentialRampToValueAtTime(0.001, toneStart + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(toneStart);
        osc.stop(toneStart + duration);
      });

      // Dissonant tritone clang layered on the second tone
      const clangStart = ctx.currentTime + 0.14;
      const clang = ctx.createOscillator();
      const clangGain = ctx.createGain();
      clang.type = "square";
      clang.frequency.setValueAtTime(164.81, clangStart); // A3 against Eb3
      clangGain.gain.setValueAtTime(this.volume * 0.08, clangStart);
      clangGain.gain.exponentialRampToValueAtTime(0.001, clangStart + 0.18);
      clang.connect(clangGain);
      clangGain.connect(ctx.destination);
      clang.start(clangStart);
      clang.stop(clangStart + 0.2);
    } catch {}
  }

  // Soft balloon / notification blip
  public playNotification() {
    if (this.isMuted || this.currentPack === "mute") return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.13, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }
}

export const soundManager = new SoundManager();
