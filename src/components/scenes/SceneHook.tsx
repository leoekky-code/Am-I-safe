import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import serverImage from '../../assets/images/server_eastern_europe_1791131628573.jpg';

interface SceneHookProps {
  currentTime: number;
}

export const SceneHook: React.FC<SceneHookProps> = ({ currentTime }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const serverGlowRef = useRef<HTMLDivElement>(null);

  // Cinematic zoom on background
  useEffect(() => {
    if (!bgRef.current) return;
    // Animate zoom-in over the 7 second scene duration
    const progress = Math.min(1, Math.max(0, currentTime / 7));
    gsap.to(bgRef.current, {
      scale: 1 + progress * 0.18,
      y: -progress * 20,
      duration: 0.1,
      ease: 'none'
    });
  }, [currentTime]);

  // Rolling counter for 15,000,000,000
  useEffect(() => {
    if (!numberRef.current) return;
    const progress = Math.min(1, Math.max(0, currentTime / 3.2));
    const target = 15000000000;
    const currentVal = Math.floor(target * Math.pow(progress, 2.5));
    numberRef.current.innerText = currentVal.toLocaleString('en-US');
  }, [currentTime]);

  // Server credentials card trigger
  const showCredentials = currentTime >= 4.2;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      {/* Background with cinematic zoom */}
      <img
        ref={bgRef}
        src={serverImage}
        alt="Eastern Europe Server Room"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125 transition-transform will-change-transform"
      />

      {/* Dark Vignette & Atmospheric Fog */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-black/90 pointer-events-none" />

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 pt-16 pb-28">
        {/* Top Tag & Coordinates */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            CRITICAL DATA BREACH
          </div>
          <p className="text-[11px] font-mono text-cyan-400/80 tracking-wider">
            TARGET SERVER: [MINSK / KYIV RELAY #108]
          </p>
        </div>

        {/* Center Kinetic Typography: 15,000,000,000 EXPOSED */}
        <div className="flex flex-col items-center text-center my-auto">
          <div className="text-xs uppercase font-mono tracking-[0.25em] text-red-400 font-bold mb-1">
            GLOBAL CREDENTIAL DUMP
          </div>

          <div className="flex flex-col items-center">
            <span
              ref={numberRef}
              className="text-3xl sm:text-4xl md:text-5xl font-black font-tech tracking-tight text-white drop-shadow-[0_0_25px_rgba(239,68,68,0.7)]"
            >
              0
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display tracking-widest text-red-500 uppercase glow-red mt-1">
              PASSWORDS EXPOSED
            </span>
          </div>

          {/* Onion URL Fake Bar */}
          <div className="mt-5 w-full max-w-xs bg-black/80 border border-white/20 rounded-lg p-2.5 flex items-center justify-between font-mono text-xs shadow-xl">
            <div className="flex items-center gap-2 truncate">
              <span className="text-red-400 font-bold text-sm">🔒</span>
              <span className="text-white/60 truncate">http://pwned73kv...onion</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 uppercase">
              Dark Web
            </span>
          </div>
        </div>

        {/* Leaked Identity Server Card (Appears at 4.4s) */}
        <div
          ref={cardRef}
          className={`w-full max-w-sm mx-auto bg-slate-950/90 border border-red-500/40 p-3.5 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-500 transform ${
            showCredentials ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              IDENTIFIED VICTIM RECORD
            </span>
            <span className="text-[10px] font-mono text-white/50">SERVER: EASTERN EUROPE</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-white/50">Full Name:</span>
              <span className="text-white font-medium">Alex M. Johnson</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Home Address:</span>
              <span className="text-white font-medium">412 Maple Ave, Seattle WA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50">Plaintext Pass:</span>
              <span className="text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
                Summer2023!# [LEAKED]
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
