import React from 'react';
import { SCENES } from '../data/scriptData';
import { DirectorSettings } from '../types';

interface TimelineControlsProps {
  settings: DirectorSettings;
  onUpdateSettings: (partial: Partial<DirectorSettings>) => void;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onOpenBreachChecker: () => void;
  onOpenScriptDrawer: () => void;
  onOpenExportModal: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  settings,
  onUpdateSettings,
  onSeek,
  onTogglePlay,
  onOpenBreachChecker,
  onOpenScriptDrawer,
  onOpenExportModal
}) => {
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPercent = (settings.currentTime / settings.duration) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950/95 border border-white/15 rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 font-mono select-none">
      {/* 1. SCRUBBER TIMELINE */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tabular-nums">
              {formatTime(settings.currentTime)}
            </span>
            <span className="text-white/40">/</span>
            <span className="text-white/50 tabular-nums">
              {formatTime(settings.duration)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-white/50">
            <span>SCENE:</span>
            <span className="text-red-400 font-bold">
              {SCENES.find(s => settings.currentTime >= s.startTime && settings.currentTime < s.endTime)?.title || 'CLIMAX'}
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div
          className="relative h-3 bg-white/10 rounded-full cursor-pointer group flex items-center"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            onSeek(clickPos * settings.duration);
          }}
        >
          {/* Chapter Segment Dividers */}
          {SCENES.map(scene => (
            <div
              key={scene.id}
              className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10 pointer-events-none"
              style={{ left: `${(scene.startTime / settings.duration) * 100}%` }}
              title={`${scene.title} (${scene.timeRange})`}
            />
          ))}

          {/* Filled Progress */}
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-75 relative"
            style={{ width: `${currentPercent}%` }}
          >
            {/* Scrubber Knob */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg group-hover:scale-125 transition-transform" />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTROLS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={() => onSeek(0)}
            title="Restart from beginning"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors text-xs"
          >
            ⏮
          </button>

          {/* Skip -5s */}
          <button
            onClick={() => onSeek(Math.max(0, settings.currentTime - 5))}
            title="Back 5 seconds"
            className="px-2.5 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors text-xs font-bold"
          >
            -5s
          </button>

          {/* Main Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="px-5 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] text-xs"
          >
            <span>{settings.isPlaying ? '❚❚' : '▶'}</span>
            <span>{settings.isPlaying ? 'PAUSE' : 'PLAY SHORT'}</span>
          </button>

          {/* Skip +5s */}
          <button
            onClick={() => onSeek(Math.min(settings.duration, settings.currentTime + 5))}
            title="Forward 5 seconds"
            className="px-2.5 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors text-xs font-bold"
          >
            +5s
          </button>

          {/* Playback Speed selector */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-[10px]">
            {[0.75, 1.0, 1.25].map(rate => (
              <button
                key={rate}
                onClick={() => onUpdateSettings({ playbackRate: rate })}
                className={`px-2 py-1 rounded transition-colors ${
                  settings.playbackRate === rate
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => onUpdateSettings({ viewMode: 'shorts' })}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              settings.viewMode === 'shorts'
                ? 'bg-red-600 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>📱</span> 9:16 Shorts
          </button>
          <button
            onClick={() => onUpdateSettings({ viewMode: 'landscape' })}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              settings.viewMode === 'landscape'
                ? 'bg-red-600 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>🖥️</span> 16:9 Cinema
          </button>
          <button
            onClick={() => onUpdateSettings({ viewMode: 'fullscreen' })}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              settings.viewMode === 'fullscreen'
                ? 'bg-red-600 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>⛶</span> Studio
          </button>
        </div>

        {/* Secondary Action Modals */}
        <div className="flex items-center gap-2">
          {/* Export to MP4 Button */}
          <button
            onClick={onOpenExportModal}
            className="px-3.5 h-9 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
          >
            <span>🎬</span> Export MP4
          </button>

          {/* Teleprompter / Script */}
          <button
            onClick={onOpenScriptDrawer}
            className="px-3 h-9 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs flex items-center gap-1.5 transition-colors border border-white/15"
          >
            <span>📜</span> Script Cues
          </button>

          {/* Breach Simulator */}
          <button
            onClick={onOpenBreachChecker}
            className="px-3 h-9 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-400 text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] font-bold"
          >
            <span>🛡️</span> Test Breach
          </button>
        </div>
      </div>

      {/* 3. SCENE QUICK-JUMP TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px]">
        {SCENES.map(scene => {
          const isActive =
            settings.currentTime >= scene.startTime && settings.currentTime < scene.endTime;
          return (
            <button
              key={scene.id}
              onClick={() => onSeek(scene.startTime)}
              className={`p-2 rounded-lg border text-left transition-all truncate ${
                isActive
                  ? 'border-red-500 bg-red-950/40 text-white font-bold shadow-md'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] mb-0.5">
                <span className="uppercase">{scene.title}</span>
                <span className="text-white/40">{scene.timeRange}</span>
              </div>
              <div className="truncate text-white/90 font-mono text-[10px]">
                {scene.headline}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. SOUND & CAMERA HUD TOGGLES */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs text-white/70">
        {/* Audio Toggles */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mute */}
          <button
            onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${
              settings.isMuted
                ? 'bg-red-950/80 border-red-500 text-red-400 font-bold'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <span>{settings.isMuted ? '🔇' : '🔊'}</span>
            <span>{settings.isMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>

          {/* Synth Drone Toggle */}
          <button
            onClick={() => onUpdateSettings({ droneEnabled: !settings.droneEnabled })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
              settings.droneEnabled
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-400 font-semibold'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
            }`}
          >
            <span>🎛️</span> Synth Drone: {settings.droneEnabled ? 'ON' : 'OFF'}
          </button>

          {/* SFX Toggle */}
          <button
            onClick={() => onUpdateSettings({ sfxEnabled: !settings.sfxEnabled })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
              settings.sfxEnabled
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-400 font-semibold'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
            }`}
          >
            <span>⚡</span> SFX FX: {settings.sfxEnabled ? 'ON' : 'OFF'}
          </button>

          {/* Voiceover Narrator Toggle */}
          <button
            onClick={() => onUpdateSettings({ voiceoverEnabled: !settings.voiceoverEnabled })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
              settings.voiceoverEnabled
                ? 'bg-purple-950/70 border-purple-500/50 text-purple-400 font-semibold'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
            }`}
          >
            <span>🎙️</span> Voiceover: {settings.voiceoverEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Visual FX Toggles */}
        <div className="flex items-center gap-2">
          {/* Security HUD */}
          <button
            onClick={() => onUpdateSettings({ cameraHudEnabled: !settings.cameraHudEnabled })}
            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
              settings.cameraHudEnabled
                ? 'bg-white/15 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            HUD {settings.cameraHudEnabled ? '✓' : '✕'}
          </button>

          {/* Scanlines */}
          <button
            onClick={() => onUpdateSettings({ scanlinesEnabled: !settings.scanlinesEnabled })}
            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
              settings.scanlinesEnabled
                ? 'bg-white/15 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            CRT {settings.scanlinesEnabled ? '✓' : '✕'}
          </button>

          {/* Glitch */}
          <button
            onClick={() => onUpdateSettings({ glitchEnabled: !settings.glitchEnabled })}
            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
              settings.glitchEnabled
                ? 'bg-red-950 border-red-500/50 text-red-400'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            GLITCH {settings.glitchEnabled ? '✓' : '✕'}
          </button>
        </div>
      </div>
    </div>
  );
};
