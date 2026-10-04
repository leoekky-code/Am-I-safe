import React, { useEffect, useState } from 'react';
import { soundEngine } from '../../utils/soundEngine';

interface SceneDrainProps {
  currentTime: number;
}

export const SceneDrain: React.FC<SceneDrainProps> = ({ currentTime }) => {
  const localTime = Math.max(0, currentTime - 35); // 0 to 14 seconds
  const [storeCredit, setStoreCredit] = useState(120);

  // Trigger alert and cash drain SFX at specific script beats
  useEffect(() => {
    // 0:36 (localTime ~ 1s): Red alert trigger
    if (localTime >= 0.8 && localTime <= 1.2) {
      soundEngine.playAlarmBeep(true);
      setTimeout(() => soundEngine.playAlarmBeep(false), 200);
    }
    // 0:40 (localTime ~ 5s): Funds drain
    if (localTime >= 4.8 && localTime <= 5.2) {
      soundEngine.playCashDrain();
    }
  }, [Math.floor(localTime)]);

  // Animate credit drain
  useEffect(() => {
    if (localTime >= 4.5 && localTime <= 7.5) {
      const progress = (localTime - 4.5) / 3;
      setStoreCredit(Math.max(0, Math.floor(120 * (1 - progress))));
    } else if (localTime > 7.5) {
      setStoreCredit(0);
    } else {
      setStoreCredit(120);
    }
  }, [localTime]);

  const isAlarmFlashing = localTime >= 0.8 && localTime <= 4.0;
  const isMorning = localTime >= 8.5;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      {/* Background Red / Dark Ambiance */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isAlarmFlashing
          ? 'bg-red-950/40 animate-pulse'
          : isMorning
          ? 'bg-gradient-to-t from-slate-950 via-slate-900 to-black'
          : 'bg-gradient-to-t from-red-950/20 via-black to-black'
      }`} />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-5 pt-14 pb-28">
        {/* Night / Time Clock Banner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-xl">🌙</span>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-wider">
                {isMorning ? '07:15 AM — WAKE UP' : '03:42 AM — VICTIM ASLEEP'}
              </span>
              <span className="text-[10px] text-white/50">
                {isMorning ? 'Email notification received' : 'Automated script active'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
            {isMorning ? 'TOO LATE' : 'SLEEP MODE'}
          </span>
        </div>

        {/* Center Visual: Red Flashing Alert or Retail Hijack */}
        <div className="my-auto flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
          {/* Red Flashing Notification: ACCOUNT UNLOCKED */}
          <div
            className={`w-full p-4 rounded-xl border-2 text-center transition-all duration-300 ${
              isAlarmFlashing
                ? 'bg-red-950/90 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.7)] scale-105 animate-glitch'
                : 'bg-slate-900/90 border-red-500/40 shadow-xl'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-mono text-xs font-black tracking-widest uppercase">
                SECURITY BREACH EVENT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-wider text-white glow-red uppercase">
              ACCOUNT UNLOCKED
            </h2>
            <p className="text-[11px] font-mono text-red-300/80 mt-1">
              Unauthorized Token Generated · IP: 194.26.29.112 (Proxy)
            </p>
          </div>

          {/* Hijacked Retail Checkout Card */}
          <div className="w-full bg-slate-950/95 border border-white/15 p-3.5 rounded-xl shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-1.5">
                <span>🛒</span> APEX RETAIL STORE
              </span>
              <span className="text-red-400 text-[10px] font-bold">DRAIN IN PROGRESS</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {/* Saved Card Auto-Charge */}
              <div className="flex justify-between items-center bg-black/50 p-2 rounded border border-white/5">
                <span className="text-white/60">Saved Card (Visa •••• 4819):</span>
                <span className="text-red-400 font-bold">$500.00 CHARGED</span>
              </div>

              {/* Store Credit Drain */}
              <div className="flex justify-between items-center bg-black/50 p-2 rounded border border-white/5">
                <span className="text-white/60">Store Credit Balance:</span>
                <span className={`font-bold tabular-nums transition-colors duration-200 ${
                  storeCredit === 0 ? 'text-red-500 line-through' : 'text-amber-400'
                }`}>
                  ${storeCredit}.00
                </span>
              </div>

              {/* Loot Item */}
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-white/50">Item Dispatched:</span>
                <span className="text-cyan-300 font-medium">5x $100 Digital Gift Cards</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-white/40">Receiver:</span>
                <span className="text-white/70 font-mono">drop_vault_99@tuta.io</span>
              </div>
            </div>
          </div>

          {/* Morning Wake-Up Notification Popup (localTime >= 8.5) */}
          <div
            className={`w-full bg-white text-slate-900 p-3 rounded-xl shadow-2xl transition-all duration-500 transform ${
              isMorning
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span className="flex items-center gap-1">
                <span>✉️</span> Mail · 03:44 AM (Read at 7:15 AM)
              </span>
              <span className="text-slate-400 text-[10px]">NOW</span>
            </div>
            <div className="font-bold text-xs text-slate-900">
              Your Apex Retail Order #49281 has been delivered!
            </div>
            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
              Thank you for purchasing $500.00 in gift cards. Funds non-refundable.
            </p>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="text-center font-mono text-[11px] text-red-400 bg-red-950/60 py-1.5 px-3 rounded-lg border border-red-500/30">
          ⚠️ FUNDS DISBURSED BEFORE VICTIM WOKE UP
        </div>
      </div>
    </div>
  );
};
