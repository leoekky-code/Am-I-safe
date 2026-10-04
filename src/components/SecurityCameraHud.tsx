import React, { useEffect, useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface SecurityCameraHudProps {
  currentTime: number;
  currentSceneTitle: string;
  enabled: boolean;
}

export const SecurityCameraHud: React.FC<SecurityCameraHudProps> = ({
  currentTime,
  currentSceneTitle,
  enabled
}) => {
  const [audioMeter, setAudioMeter] = useState(0.2);

  // Monitor audio levels for the VU meter
  useEffect(() => {
    let animId: number;
    const updateMeter = () => {
      const level = soundEngine.getAudioLevel();
      // Smooth falloff + minimum ambient flutter
      setAudioMeter(prev => prev * 0.7 + Math.max(0.12, level) * 0.3);
      animId = requestAnimationFrame(updateMeter);
    };
    animId = requestAnimationFrame(updateMeter);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!enabled) return null;

  // Format time into 00:MM:SS:FF
  const totalSeconds = Math.floor(currentTime);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const frames = Math.floor((currentTime % 1) * 30).toString().padStart(2, '0');
  const timecode = `00:${minutes}:${seconds}:${frames}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 text-[10px] md:text-xs font-mono text-white/80 select-none">
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        {/* REC indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-red-600/30 border border-red-500/50 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-fast inline-block shadow-[0_0_8px_#ef4444]" />
            REC
          </span>
          <span className="text-white/60 tracking-wider font-semibold">CAM-04 // VAULT-EU</span>
        </div>

        {/* Center scene badge */}
        <div className="hidden sm:flex items-center gap-2 text-white/50 text-[10px]">
          <span>FEED: ENCRYPTED</span>
          <span>·</span>
          <span className="text-emerald-400 font-semibold">{currentSceneTitle}</span>
        </div>

        {/* Timecode */}
        <div className="font-mono text-xs md:text-sm font-bold tracking-widest text-amber-300/90 bg-black/40 px-2 py-0.5 rounded border border-white/10 tabular-nums">
          {timecode}
        </div>
      </div>

      {/* Target Framing Reticles / Corner Brackets */}
      <div className="absolute inset-8 md:inset-12 pointer-events-none">
        {/* Top Left */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30" />
        {/* Top Right */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30" />
        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30" />
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30" />
        
        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none opacity-25">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="flex items-end justify-between border-t border-white/10 pt-2 text-[10px] text-white/50">
        <div className="flex flex-col gap-0.5">
          <span className="tracking-wider">GEO: 53.8930° N, 27.5674° E</span>
          <span className="text-white/40">NODE: TOR-EXIT-BELARUS-09</span>
        </div>

        {/* Real-time Decibel / VU Audio Level Bar */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] uppercase tracking-wider text-white/40">AUDIO VU</span>
          <div className="flex items-end gap-0.5 h-4 w-20 bg-black/40 p-0.5 border border-white/10 rounded">
            {Array.from({ length: 10 }).map((_, i) => {
              const active = audioMeter * 10 >= i;
              const isPeak = i >= 8;
              const isMid = i >= 5;
              const color = isPeak ? 'bg-red-500' : isMid ? 'bg-amber-400' : 'bg-emerald-400';
              return (
                <div
                  key={i}
                  className={`flex-1 transition-all duration-75 rounded-xs ${active ? color : 'bg-white/10'}`}
                  style={{ height: `${(i + 1) * 10}%` }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <span className="text-cyan-400">FPS: 30 · 8420 KBPS</span>
          <span className="text-white/40">BATTERY: 98% [AC]</span>
        </div>
      </div>
    </div>
  );
};
