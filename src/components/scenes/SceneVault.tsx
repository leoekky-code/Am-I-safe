import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import vaultImage from '../../assets/images/dark_web_data_vault_1791131641566.jpg';

interface SceneVaultProps {
  currentTime: number;
}

export const SceneVault: React.FC<SceneVaultProps> = ({ currentTime }) => {
  const bgRef = useRef<HTMLImageElement>(null);
  const localTime = Math.max(0, currentTime - 7); // 0 to 13 seconds

  // Slow cinematic pan and scale
  useEffect(() => {
    if (!bgRef.current) return;
    const progress = Math.min(1, localTime / 13);
    gsap.to(bgRef.current, {
      scale: 1.05 + progress * 0.15,
      x: progress * -15,
      y: progress * 10,
      duration: 0.1,
      ease: 'none'
    });
  }, [localTime]);

  const showClearinghouse = localTime >= 4.2;
  const showVaultDump = localTime >= 7.8;

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background */}
      <img
        ref={bgRef}
        src={vaultImage}
        alt="Dark Web Data Vault"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover filter brightness-70 contrast-125 transition-transform will-change-transform"
      />

      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 pt-16 pb-28">
        {/* Header Tag */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            UNDERGROUND ARCHIVE
          </div>
          <span className="text-xs font-mono text-white/40">VAULT: 0x9F...4B</span>
        </div>

        {/* Center Dynamic Visuals */}
        <div className="flex flex-col items-center gap-4 my-auto w-full max-w-sm mx-auto">
          {/* Surface Story vs Reality Comparison */}
          <div className="w-full grid grid-cols-2 gap-2 text-xs font-mono">
            {/* The Surface Story */}
            <div className="bg-black/80 border border-white/10 p-3 rounded-lg flex flex-col justify-between opacity-60">
              <span className="text-[10px] text-white/50 uppercase tracking-wider">Surface Myth</span>
              <p className="text-white line-through font-semibold text-xs mt-1">
                Contraband & Dark Bazaars
              </p>
              <span className="text-[9px] text-red-400 mt-2 font-mono">10% OF DARK WEB</span>
            </div>

            {/* The Core Reality */}
            <div className={`p-3 rounded-lg flex flex-col justify-between transition-all duration-500 border ${
              showClearinghouse
                ? 'bg-cyan-950/70 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                : 'bg-black/60 border-white/10 opacity-70'
            }`}>
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">The Core Reality</span>
              <p className="text-white font-bold text-xs mt-1">
                Human Data Clearinghouse
              </p>
              <span className="text-[9px] text-cyan-300 mt-2 font-mono">90% OF CYBER TRAFFIC</span>
            </div>
          </div>

          {/* Corporate Breach News Headlines Slamming Down */}
          <div className="w-full flex flex-col gap-2">
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-widest text-center">
              RECENT CORPORATE BREACH VAULTS
            </div>

            {/* Card 1 */}
            <div className="bg-slate-900/90 border border-red-500/30 px-3 py-2 rounded-lg flex items-center justify-between text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold">⚠️</span>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">TICKETMASTER / LIVE NATION</span>
                  <span className="text-[10px] text-white/50">560,000,000 CUSTOMER RECORDS</span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-red-950/60 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                DUMPED
              </span>
            </div>

            {/* Card 2 */}
            <div className={`bg-slate-900/90 border border-amber-500/30 px-3 py-2 rounded-lg flex items-center justify-between text-xs backdrop-blur-md transition-all duration-300 ${
              localTime >= 2.5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">⚠️</span>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">AT&T TELECOM LEAK</span>
                  <span className="text-[10px] text-white/50">73,000,000 PASSCODES & SSN</span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-amber-950/60 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                EXPOSED
              </span>
            </div>

            {/* Card 3 (Appears when vault dump is mentioned) */}
            <div className={`bg-slate-900/90 border border-cyan-500/30 px-3 py-2 rounded-lg flex items-center justify-between text-xs backdrop-blur-md transition-all duration-300 ${
              showVaultDump ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">🔐</span>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">AES-256 DIGITAL VAULTS</span>
                  <span className="text-[10px] text-cyan-300">UNRESTRICTED BUYER ACCESS</span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                ARCHIVED
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Stat Ticker */}
        <div className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-white/60">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>ENCRYPTED VAULT SIZE:</span>
          </div>
          <span className="text-cyan-400 font-bold tabular-nums">4.82 TERABYTES (SQL DUMPS)</span>
        </div>
      </div>
    </div>
  );
};
