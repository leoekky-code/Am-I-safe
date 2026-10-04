import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import mirrorImage from '../../assets/images/smartphone_mirror_dark_1791131663164.jpg';
import { soundEngine } from '../../utils/soundEngine';

interface SceneClimaxProps {
  currentTime: number;
}

export const SceneClimax: React.FC<SceneClimaxProps> = ({ currentTime }) => {
  const localTime = Math.max(0, currentTime - 49); // 0 to 11 seconds
  const bgRef = useRef<HTMLImageElement>(null);

  // Cinematic pull back into darkness
  useEffect(() => {
    if (!bgRef.current) return;
    const progress = Math.min(1, localTime / 11);
    // Camera pulls back
    gsap.to(bgRef.current, {
      scale: 1.18 - progress * 0.18, // 1.18 down to 1.0
      duration: 0.1,
      ease: 'none'
    });
  }, [localTime]);

  // Audio pause and sub boom at the beginning of the climax
  useEffect(() => {
    if (localTime >= 0.1 && localTime <= 0.5) {
      soundEngine.dramaticPause(1.0);
      soundEngine.playBassPulse(1.2);
    }
  }, [Math.floor(localTime)]);

  const showProtocols = localTime >= 5.2;
  const showPunchline = localTime >= 9.0;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      {/* Mirror Reflection Background with Camera Pull Back */}
      <img
        ref={bgRef}
        src={mirrorImage}
        alt="Mirror Reflection in Dark"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover filter brightness-65 contrast-125 transition-transform will-change-transform"
      />

      {/* Deep Shadow Scrim Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/85 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-5 pt-14 pb-28">
        {/* Top Tag */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            FINAL DIRECTIVE
          </div>
          <span className="text-[10px] font-mono text-white/50">ASSUME BREACHED</span>
        </div>

        {/* Center Content */}
        <div className="my-auto flex flex-col items-center gap-3.5 w-full max-w-sm mx-auto">
          {/* Core Insight Banner */}
          <div className="text-center">
            <p className="text-xs font-mono text-white/60 uppercase tracking-widest mb-1">
              THE REALITY SHIFT
            </p>
            <h2 className="text-lg sm:text-xl font-black font-display text-white leading-tight">
              Assume Your Information Is <span className="text-red-500 glow-red">Already Leaked</span>
            </h2>
          </div>

          {/* 3 Golden Rules HUD (Materializes at 5.2s) */}
          <div className={`w-full flex flex-col gap-2 transition-all duration-500 ${
            showProtocols ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}>
            {/* Rule 1 */}
            <div className="bg-slate-900/90 border border-emerald-500/40 p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                ✓
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Enable Two-Factor Auth (2FA)</span>
                <span className="text-[10px] text-white/50">Use Authenticator app or Passkeys, not SMS</span>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="bg-slate-900/90 border border-cyan-500/40 p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                ✓
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Stop Reusing Passwords</span>
                <span className="text-[10px] text-white/50">Generate unique 16+ characters per service</span>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="bg-slate-900/90 border border-purple-500/40 p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg">
              <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-400 font-bold text-xs shrink-0">
                ✓
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Check Account Breach Exposure</span>
                <span className="text-[10px] text-white/50">Audit compromised databases routinely</span>
              </div>
            </div>
          </div>

          {/* Punchline Reveal at 9.0s */}
          {showPunchline && (
            <div className="text-center font-display font-black text-xl sm:text-2xl text-red-500 uppercase tracking-widest glow-red animate-glitch mt-2">
              ...TO REACH INTO YOUR WALLET.
            </div>
          )}
        </div>

        {/* Bottom Callout */}
        <div className="text-center font-mono text-[10px] text-white/40 tracking-wider">
          CYBER SURVIVAL DIRECTIVE · STAY SECURE
        </div>
      </div>
    </div>
  );
};
