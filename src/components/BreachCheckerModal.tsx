import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface BreachCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoBreach {
  title: string;
  date: string;
  count: string;
  compromisedData: string[];
  description: string;
}

export const BreachCheckerModal: React.FC<BreachCheckerModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<DemoBreach[]>([]);

  if (!isOpen) return null;

  const demoAccounts = [
    { label: 'alex.morgan@retail.com', breaches: 4 },
    { label: 'sarah.c@gmail.com', breaches: 6 },
    { label: 'john.smith@yahoo.com', breaches: 8 },
    { label: 'clean.secure.user@proton.me', breaches: 0 }
  ];

  const handleSearch = (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    setIsSearching(true);
    setHasSearched(false);
    soundEngine.playTypingClick(2500);

    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);

      if (targetEmail.includes('clean') || targetEmail.includes('proton')) {
        setResults([]);
        soundEngine.playAlarmBeep(true);
      } else {
        soundEngine.playBassPulse(0.9);
        setResults([
          {
            title: 'Collection #1 Mega Dump',
            date: 'January 2019',
            count: '772,904,991 accounts',
            compromisedData: ['Email Addresses', 'Plaintext Passwords'],
            description: 'A massive compilation of 2,692,818,238 distinct rows of leaked email address and password pairs circulating on hacking forums.'
          },
          {
            title: 'Exploit.in Aggregated Vault',
            date: 'Late 2016',
            count: '593,427,119 accounts',
            compromisedData: ['Email Addresses', 'Passwords', 'Bcrypt Hashes'],
            description: 'Compromised credential dump utilized widely in automated credential stuffing attacks against e-commerce websites.'
          },
          {
            title: 'Corporate Retailer Infiltration',
            date: 'March 2023',
            count: '43,000,000 accounts',
            compromisedData: ['Phone Numbers', 'Home Addresses', 'Store Credit Balances', 'Hashed Passwords'],
            description: 'Database breach from a major multinational retailer dumped onto Russian-language Telegram channels.'
          }
        ]);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-950 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-lg">🛡️</span>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white font-tech tracking-wide">
                DARK WEB BREACH EXPOSURE SIMULATOR
              </h3>
              <p className="text-[11px] text-white/50">
                Check whether your credentials exist in known underground dumps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          {/* Email input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-[11px]">Enter Email or Username to Test:</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(email)}
                placeholder="e.g. yourname@domain.com"
                className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-red-500 text-xs"
              />
              <button
                onClick={() => handleSearch(email)}
                disabled={isSearching}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1.5 shrink-0"
              >
                {isSearching ? 'SCANNING...' : 'SCAN LEAKS'}
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-sets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-white/40">Try sample targets:</span>
            {demoAccounts.map(demo => (
              <button
                key={demo.label}
                onClick={() => {
                  setEmail(demo.label);
                  handleSearch(demo.label);
                }}
                className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20 transition-colors"
              >
                {demo.label}
              </button>
            ))}
          </div>

          {/* Search Result */}
          {hasSearched && (
            <div className="mt-4 space-y-3">
              {results.length > 0 ? (
                <>
                  <div className="bg-red-950/60 border border-red-500/50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <div className="text-red-400 font-bold text-xs uppercase tracking-wide">
                          Pwned in {results.length} Data Breaches
                        </div>
                        <div className="text-[11px] text-white/70">
                          This email was found in published dark web credential dumps.
                        </div>
                      </div>
                    </div>
                    <span className="text-red-400 text-xs font-bold px-2 py-0.5 bg-red-900/40 rounded border border-red-500/40">
                      CRITICAL RISK
                    </span>
                  </div>

                  <div className="space-y-2">
                    {results.map((r, i) => (
                      <div key={i} className="bg-slate-900/80 border border-white/10 p-3 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{r.title}</span>
                          <span className="text-white/40 text-[10px]">{r.date}</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">{r.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {r.compromisedData.map((d, di) => (
                            <span
                              key={di}
                              className="text-[9px] bg-red-950/70 border border-red-500/30 text-red-300 px-1.5 py-0.5 rounded"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Immediate Action advice */}
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-300 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1">
                      <span>🔒</span> Proactive Defense Checklist:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-white/80">
                      <li>Change your password immediately on any account using this secret.</li>
                      <li>Enable 2FA (TOTP authenticator app) on your primary email and finance apps.</li>
                      <li>Never reuse passwords across different portals.</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-xl text-center space-y-1">
                  <div className="text-2xl">🛡️</div>
                  <div className="text-emerald-400 font-bold text-xs uppercase">
                    No Known Breaches Found
                  </div>
                  <p className="text-[11px] text-white/60">
                    This account did not appear in any indexed public compilations. Keep practicing unique passwords!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
