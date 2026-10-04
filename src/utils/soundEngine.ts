/**
 * Web Audio API synthesizer for cinematic cyber drone, bass pulses, typing clicks,
 * alerts, and dramatic pauses.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private isDroneActive = false;
  private isMuted = false;
  private streamDestination: MediaStreamAudioDestinationNode | null = null;
  private speechSynth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private lastTypingTime = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynth = window.speechSynthesis;
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      if (this.ctx.createMediaStreamDestination) {
        this.streamDestination = this.ctx.createMediaStreamDestination();
        this.masterGain.connect(this.streamDestination);
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMediaStreamDestination(): MediaStreamAudioDestinationNode | null {
    this.initContext();
    if (this.ctx && !this.streamDestination && this.ctx.createMediaStreamDestination) {
      this.streamDestination = this.ctx.createMediaStreamDestination();
      this.masterGain?.connect(this.streamDestination);
    }
    return this.streamDestination;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05);
    }
    if (muted && this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Starts a rich multi-oscillator cinematic deep synth drone
   * Detuned Saw + Triangle with a resonant lowpass filter modulated by a slow LFO
   */
  public startDrone() {
    if (this.isDroneActive) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.45, this.ctx.currentTime + 1.5);

      // Lowpass ladder filter
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(3.8, this.ctx.currentTime);

      // Osc 1: Sub Bass 55Hz (A1) Sawtooth
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Osc 2: Sub-octave 110Hz detuned Triangle
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(109.2, this.ctx.currentTime);

      // LFO for breathing drone modulation
      this.lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // 0.18 Hz slow cycle
      lfoGain.gain.setValueAtTime(70, this.ctx.currentTime); // sweeps filter ±70Hz
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.droneFilter.frequency);

      // Route
      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.lfo.start();
      this.isDroneActive = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopDrone() {
    if (!this.isDroneActive || !this.ctx || !this.droneGain) return;
    try {
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.lfo?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.droneFilter?.disconnect();
          this.droneGain?.disconnect();
        } catch {
          // ignore disconnect errors
        }
        this.isDroneActive = false;
      }, 550);
    } catch {
      this.isDroneActive = false;
    }
  }

  /**
   * Deep bass pulse / boom for dramatic impact
   * 85Hz down to 32Hz pitch drop with saturation
   */
  public playBassPulse(intensity = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(85 * intensity, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.85);

      gain.gain.setValueAtTime(0.7 * intensity, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      // Sub distortion
      const waveshaper = this.ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; ++i) {
        const x = (i * 2) / 256 - 1;
        curve[i] = ((Math.PI + 4) * x) / (Math.PI + 4 * Math.abs(x));
      }
      waveshaper.curve = curve;

      osc.connect(waveshaper);
      waveshaper.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // Audio context error
    }
  }

  /**
   * Procedural digital typing / hacker terminal clack
   */
  public playTypingClick(frequency = 1800) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Debounce micro rapid spam
    if (now - this.lastTypingTime < 0.04) return;
    this.lastTypingTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      // Slightly randomize frequency
      const randFreq = frequency + (Math.random() - 0.5) * 400;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(randFreq, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(randFreq, now);
      filter.Q.setValueAtTime(6.0, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio context error
    }
  }

  /**
   * Cyber alarm staccato beep ("ACCOUNT UNLOCKED")
   */
  public playAlarmBeep(high = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(high ? 920 : 660, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio context error
    }
  }

  /**
   * Cash / store credit drain sound (descending glissando)
   */
  public playCashDrain() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.9);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.1);
    } catch {
      // Audio context error
    }
  }

  /**
   * Digital static glitch burst
   */
  public playGlitchBurst() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.12; // 120ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
    } catch {
      // Audio context error
    }
  }

  /**
   * Dramatic audio pause (silences drone briefly for punchy silence)
   */
  public dramaticPause(durationSeconds = 1.2) {
    if (!this.isDroneActive || !this.ctx || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      this.droneGain.gain.setValueAtTime(0.0001, now + durationSeconds - 0.2);
      this.droneGain.gain.exponentialRampToValueAtTime(0.45, now + durationSeconds + 0.4);
    } catch {
      // Audio context error
    }
  }

  /**
   * Returns instantaneous audio volume 0.0 - 1.0 for the HUD VU meter
   */
  public getAudioLevel(): number {
    if (!this.analyser) return 0;
    const array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    const avg = sum / array.length;
    return Math.min(1.0, avg / 128);
  }

  /**
   * Speech Synthesis voiceover narrator
   */
  public speakScriptLine(text: string, playbackRate = 1.0) {
    if (!this.speechSynth || this.isMuted) return;
    this.speechSynth.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05 * playbackRate;
      utterance.pitch = 0.92; // Slightly deeper, documentary tone

      // Try selecting an English voice
      const voices = this.speechSynth.getVoices();
      const preferredVoice = voices.find(
        v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Guy'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.currentUtterance = utterance;
      this.speechSynth.speak(utterance);
    } catch {
      // Speech synth failed
    }
  }

  public stopSpeech() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }
}

export const soundEngine = new SoundEngine();
