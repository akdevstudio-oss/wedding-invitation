import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

// Web Audio API synthesizer for romantic acoustic harp & warm strings chords
class WeddingAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private step: number = 0;

  // Gentle romantic chord sequence: Fmaj9 -> Dm9 -> Bbmaj7 -> Cadd9
  private chordFrequencies = [
    [174.61, 261.63, 329.63, 349.23, 440.0, 523.25, 659.25], // Fmaj9
    [146.83, 220.0, 261.63, 293.66, 349.23, 440.0, 587.33], // Dm9
    [116.54, 174.61, 233.08, 293.66, 349.23, 466.16, 587.33], // Bbmaj7
    [130.81, 196.0, 246.94, 261.63, 329.63, 392.0, 523.25], // C9
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Plucks an ethereal harp/celesta note
  private playHarpNote(freq: number, duration: number = 2.5) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Warm sine + subtle triangle blend for acoustic wooden warmth
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Filter to soften brightness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);

    // Envelope: quick gentle attack, long romantic release
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  public playWaxSealCrack() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Authentic crisp wax seal snap sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);

    // Subtle parchment paper rustle
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now + 0.05);
  }

  public playPaperSlide() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Silk parchment whisper
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08 * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(600, now + 0.45);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  public start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    let noteIndex = 0;
    const tempo = 480; // ms per harp pluck

    const scheduleNextNote = () => {
      if (!this.isPlaying) return;
      const chordIndex = Math.floor(this.step / 8) % this.chordFrequencies.length;
      const currentChord = this.chordFrequencies[chordIndex];

      // Arpeggiate through the chord patterns
      const notePattern = [0, 2, 4, 5, 4, 2, 3, 1];
      const freqIndex = notePattern[noteIndex % notePattern.length] % currentChord.length;
      const freq = currentChord[freqIndex];

      this.playHarpNote(freq, 2.8);

      noteIndex++;
      this.step++;
      this.timerId = window.setTimeout(scheduleNextNote, tempo);
    };

    scheduleNextNote();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const weddingAudio = new WeddingAudioEngine();

export const MusicControl: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleMusic = () => {
    setHasInteracted(true);
    if (isPlaying) {
      weddingAudio.stop();
      setIsPlaying(false);
    } else {
      weddingAudio.start();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      weddingAudio.stop();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Visualizer animation when playing */}
      {isPlaying && (
        <div className="hidden sm:flex items-center gap-1 bg-[#FDFBF7]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D8C7AA]/50 shadow-sm text-xs font-serif text-[#8D8174]">
          <span className="w-1 h-3 bg-[#B69A68] animate-pulse rounded-full" />
          <span className="w-1 h-4 bg-[#B69A68] animate-pulse delay-75 rounded-full" />
          <span className="w-1 h-2 bg-[#B69A68] animate-pulse delay-150 rounded-full" />
          <span className="ml-1.5 text-[#44382F] font-serif tracking-wider">Harp & Strings</span>
        </div>
      )}

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        type="button"
        aria-label={isPlaying ? 'Pause background wedding melody' : 'Play background wedding melody'}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 shadow-md ${
          isPlaying
            ? 'bg-[#B69A68] text-[#FDFBF7] border-[#8D8174] shadow-[#B69A68]/30 scale-105'
            : 'bg-[#FDFBF7]/90 text-[#44382F] border-[#D8C7AA] hover:border-[#B69A68] hover:bg-[#F8F5EE]'
        }`}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 transition-transform group-hover:scale-110" />
        ) : (
          <VolumeX className="w-5 h-5 transition-transform group-hover:scale-110 text-[#8D8174]" />
        )}

        {/* First time hint tooltip */}
        {!hasInteracted && (
          <span className="absolute -top-10 right-0 bg-[#44382F] text-[#FDFBF7] text-[11px] font-sans tracking-wide py-1 px-2.5 rounded shadow-lg whitespace-nowrap pointer-events-none opacity-90 animate-bounce">
            Play Wedding Melody
          </span>
        )}
      </button>
    </div>
  );
};
