import React, { useEffect, useRef, useState } from 'react';
import terminalBg from '../../assets/images/hacker_terminal_code_1791131652509.jpg';
import { soundEngine } from '../../utils/soundEngine';

interface SceneConflictProps {
  currentTime: number;
}

export const SceneConflict: React.FC<SceneConflictProps> = ({ currentTime }) => {
  const localTime = Math.max(0, currentTime - 20); // 0 to 15 seconds
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Generate continuous rapid brute-force attack logs
  useEffect(() => {
    const services = [
      'target.com', 'bestbuy.com', 'walmart.com', 'steam.com', 'netflix.com',
      'paypal.com', 'uber.com', 'doordash.com', 'amazon.com', 'homedepot.com'
    ];

    const interval = setInterval(() => {
      const s = services[Math.floor(Math.random() * services.length)];
      const code = Math.random() > 0.85 ? '200 OK [MATCH]' : '401 UNAUTHORIZED';
      const thread = Math.floor(Math.random() * 64) + 1;
      const newLog = `[T#${thread}] POST https://${s}/auth -> ${code}`;
      
      setTerminalLogs(prev => [...prev.slice(-8), newLog]);
      soundEngine.playTypingClick(2200);
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const testedCount = Math.floor(3500 + localTime * 950);
  const showAiBadge = localTime >= 7.5;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      {/* Background terminal ambiance */}
      <img
        src={terminalBg}
        alt="Terminal Brute Force"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125 opacity-30 pointer-events-none"
      />

      {/* Atmospheric darkness */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/90 pointer-events-none" />

      {/* Screen Split Layout */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 pt-14 pb-28">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SPLIT RECON: INFILTRATION
          </div>
          <span className="text-[10px] font-mono text-white/50">ESCROW: 0.15 BTC / XMR</span>
        </div>

        {/* SPLIT VIEW CONTAINER */}
        <div className="grid grid-cols-2 gap-2 flex-1 my-auto max-h-[380px]">
          {/* LEFT SIDE: CASUAL SMARTPHONE USER */}
          <div className="relative bg-slate-900/90 border border-white/15 rounded-xl p-3 flex flex-col justify-between shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Phone header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                📱 Target Victim
              </span>
              <span className="text-[9px] font-mono text-white/40">10:42 PM</span>
            </div>

            {/* Chat simulation */}
            <div className="flex flex-col gap-2 my-auto">
              <div className="bg-slate-800/90 text-white text-[11px] p-2 rounded-xl rounded-tl-none max-w-[85%] self-start border border-white/5 shadow-sm">
                Hey! Are we still grabbing coffee tomorrow?
              </div>

              <div className="bg-blue-600 text-white text-[11px] p-2 rounded-xl rounded-tr-none max-w-[85%] self-end shadow-sm">
                Yeah! Just finished shopping online. See ya at 9!
              </div>

              <div className="text-[9px] font-mono text-emerald-400 text-center bg-emerald-950/40 py-1 rounded border border-emerald-500/20 mt-1">
                STATUS: UNAWARE
              </div>
            </div>

            {/* Victim Note */}
            <div className="text-[9px] font-mono text-white/50 border-t border-white/10 pt-1.5 flex justify-between">
              <span>PASS REUSE: YES</span>
              <span className="text-red-400 font-bold">HIGH RISK</span>
            </div>
          </div>

          {/* RIGHT SIDE: AI BRUTE-FORCE TERMINAL */}
          <div className="relative bg-black/95 border border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between shadow-2xl shadow-emerald-950/50 backdrop-blur-md overflow-hidden">
            {/* Terminal Top bar */}
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                AI STUFFING BOT
              </span>
              <span className="text-[9px] font-mono text-emerald-300/70">64 THREADS</span>
            </div>

            {/* Real-time terminal output stream */}
            <div className="my-auto font-mono text-[9px] leading-tight text-emerald-400/90 space-y-1 overflow-hidden">
              <div className="text-white/60"># STUFFING SUITE v4.2</div>
              <div className="text-cyan-300">USER: alex.m@gmail.com</div>
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="truncate">
                  {log.includes('200') ? (
                    <span className="text-yellow-300 font-bold bg-yellow-950/60 px-1 rounded">
                      {log}
                    </span>
                  ) : (
                    log
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* AI Multi-Threading Badge */}
            <div className="border-t border-emerald-500/30 pt-1.5">
              <div className="flex justify-between text-[9px] font-mono text-emerald-300 mb-1">
                <span>SPEED:</span>
                <span className="font-bold">{testedCount.toLocaleString()} SITES/SEC</span>
              </div>
              <div className="w-full bg-emerald-950 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (localTime / 15) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Highlight Banner (Appears at 7.5s) */}
        <div className={`mt-2 bg-slate-900/90 border border-emerald-500/50 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono transition-all duration-300 ${
          showAiBadge ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-sm">⚡</span>
            <div className="flex flex-col">
              <span className="text-white font-bold">AUTOMATED BOT ATTACK</span>
              <span className="text-[10px] text-white/50">Zero manual hacking required</span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded uppercase">
            AI POWERED
          </span>
        </div>
      </div>
    </div>
  );
};
