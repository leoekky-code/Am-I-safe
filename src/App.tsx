/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { TimelineControls } from './components/TimelineControls';
import { BreachCheckerModal } from './components/BreachCheckerModal';
import { ScriptDrawer } from './components/ScriptDrawer';
import { ExportModal } from './components/ExportModal';
import { soundEngine } from './utils/soundEngine';
import { SCRIPT_SEGMENTS } from './data/scriptData';
import { DirectorSettings } from './types';

export default function App() {
  const [settings, setSettings] = useState<DirectorSettings>({
    isPlaying: false,
    currentTime: 0,
    duration: 60,
    playbackRate: 1.0,
    isMuted: false,
    volume: 0.8,
    droneEnabled: true,
    sfxEnabled: true,
    voiceoverEnabled: false, // Default off so user enjoys pure synth drone, can toggle ON anytime
    cameraHudEnabled: true,
    scanlinesEnabled: true,
    glitchEnabled: true,
    viewMode: 'shorts'
  });

  const [isBreachModalOpen, setIsBreachModalOpen] = useState(false);
  const [isScriptDrawerOpen, setIsScriptDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const lastFrameTimeRef = useRef<number>(performance.now());
  const lastSpokenSegIdRef = useRef<string | null>(null);
  const lastTriggeredCueRef = useRef<number>(-1);

  // Sync mute and volume with SoundEngine
  useEffect(() => {
    soundEngine.setMuted(settings.isMuted);
    soundEngine.setVolume(settings.volume);
  }, [settings.isMuted, settings.volume]);

  // Handle Drone on/off based on isPlaying and droneEnabled
  useEffect(() => {
    if (settings.isPlaying && settings.droneEnabled && !settings.isMuted) {
      soundEngine.startDrone();
    } else {
      soundEngine.stopDrone();
    }
  }, [settings.isPlaying, settings.droneEnabled, settings.isMuted]);

  // Main Animation / Playback Loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const delta = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      if (settings.isPlaying) {
        setSettings(prev => {
          const nextTime = prev.currentTime + delta * prev.playbackRate;

          // Loop or stop at 60s
          if (nextTime >= prev.duration) {
            return { ...prev, currentTime: 0 };
          }
          return { ...prev, currentTime: nextTime };
        });
      }

      animId = requestAnimationFrame(tick);
    };

    lastFrameTimeRef.current = performance.now();
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [settings.isPlaying, settings.playbackRate, settings.duration]);

  // Trigger SFX & Voiceover based on time
  useEffect(() => {
    if (!settings.isPlaying) return;

    const curTime = settings.currentTime;

    // SFX Triggers
    if (settings.sfxEnabled && !settings.isMuted) {
      const currentSecond = Math.floor(curTime);
      if (currentSecond !== lastTriggeredCueRef.current) {
        lastTriggeredCueRef.current = currentSecond;

        // 0:00 Hook Bass Pulse
        if (currentSecond === 0) {
          soundEngine.playBassPulse(1.1);
        }
        // 0:07 Vault Glitch
        else if (currentSecond === 7) {
          soundEngine.playGlitchBurst();
        }
        // 0:20 Conflict Split Whoosh
        else if (currentSecond === 20) {
          soundEngine.playGlitchBurst();
          soundEngine.playBassPulse(0.7);
        }
        // 0:35 Account Unlocked Alert
        else if (currentSecond === 35) {
          soundEngine.playAlarmBeep(true);
        }
        // 0:49 Climax Dramatic Pause & Sub Boom
        else if (currentSecond === 49) {
          soundEngine.dramaticPause(1.2);
          soundEngine.playBassPulse(1.3);
        }
      }
    }

    // Voiceover Narration via Speech Synthesis
    if (settings.voiceoverEnabled && !settings.isMuted) {
      const activeSeg = SCRIPT_SEGMENTS.find(
        seg => curTime >= seg.startTime && curTime < seg.endTime
      );
      if (activeSeg && activeSeg.id !== lastSpokenSegIdRef.current) {
        lastSpokenSegIdRef.current = activeSeg.id;
        soundEngine.speakScriptLine(activeSeg.text, settings.playbackRate);
      }
    } else {
      soundEngine.stopSpeech();
    }
  }, [
    settings.currentTime,
    settings.isPlaying,
    settings.sfxEnabled,
    settings.voiceoverEnabled,
    settings.isMuted,
    settings.playbackRate
  ]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setSettings(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setSettings(prev => ({ ...prev, currentTime: Math.max(0, prev.currentTime - 5) }));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setSettings(prev => ({ ...prev, currentTime: Math.min(prev.duration, prev.currentTime + 5) }));
      } else if (e.key === 'm' || e.key === 'M') {
        setSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTogglePlay = () => {
    setSettings(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSeek = (time: number) => {
    setSettings(prev => ({ ...prev, currentTime: time }));
  };

  const handleUpdateSettings = (partial: Partial<DirectorSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* 1. TOP BAR CONTRACT */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-white font-tech flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          DARK WEB EXPOSED
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-white/60">
          <button
            onClick={() => handleSeek(0)}
            className="hover:text-white transition-colors"
          >
            01. The Hook
          </button>
          <button
            onClick={() => handleSeek(7)}
            className="hover:text-white transition-colors"
          >
            02. The Vault
          </button>
          <button
            onClick={() => handleSeek(20)}
            className="hover:text-white transition-colors"
          >
            03. AI Attack
          </button>
          <button
            onClick={() => handleSeek(35)}
            className="hover:text-white transition-colors"
          >
            04. Account Drain
          </button>
          <button
            onClick={() => handleSeek(49)}
            className="hover:text-white transition-colors"
          >
            05. Defense Protocol
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold font-mono text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] whitespace-nowrap flex items-center gap-1.5"
          >
            <span>🎬</span> Export MP4
          </button>
          <button
            onClick={() => setIsBreachModalOpen(true)}
            className="hidden sm:flex px-3 py-1.5 text-xs font-mono text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-colors whitespace-nowrap"
          >
            Check Breach Exposure
          </button>
        </div>
      </header>

      {/* 2. MAIN PRODUCTION STAGE */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Video Stage Frame */}
        <div className="w-full flex justify-center mb-4">
          <VideoPlayer
            currentTime={settings.currentTime}
            settings={settings}
            onTogglePlay={handleTogglePlay}
          />
        </div>

        {/* Timeline & Director Control Center */}
        <TimelineControls
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onSeek={handleSeek}
          onTogglePlay={handleTogglePlay}
          onOpenBreachChecker={() => setIsBreachModalOpen(true)}
          onOpenScriptDrawer={() => setIsScriptDrawerOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />
      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-white/10 px-6 py-4 bg-black/90 text-xs font-mono text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span>GSAP Cinematic Short Engine</span>
          <span>·</span>
          <span>Web Audio Dual-Synth Drone</span>
          <span>·</span>
          <span>Security Camera HUD</span>
          <span>·</span>
          <span className="text-red-400 font-bold">MP4 Exporter Enabled</span>
        </div>
        <div className="text-white/30 text-[11px]">
          Press [Space] to Play/Pause · [← / →] Seek ±5s · [M] Mute
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <BreachCheckerModal
        isOpen={isBreachModalOpen}
        onClose={() => setIsBreachModalOpen(false)}
      />

      <ScriptDrawer
        isOpen={isScriptDrawerOpen}
        onClose={() => setIsScriptDrawerOpen(false)}
        currentTime={settings.currentTime}
        onJumpToTime={time => {
          handleSeek(time);
          if (!settings.isPlaying) {
            setSettings(prev => ({ ...prev, isPlaying: true }));
          }
        }}
      />
    </div>
  );
}
