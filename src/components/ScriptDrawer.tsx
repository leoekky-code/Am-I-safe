import React from 'react';
import { SCRIPT_SEGMENTS, SCENES } from '../data/scriptData';

interface ScriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: number;
  onJumpToTime: (time: number) => void;
}

export const ScriptDrawer: React.FC<ScriptDrawerProps> = ({
  isOpen,
  onClose,
  currentTime,
  onJumpToTime
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div>
            <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider">
              PRODUCTION SCRIPT & CUES
            </h3>
            <p className="text-[11px] text-white/50">
              Exact voiceover timings, visual beats & SFX cues
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Script List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {SCENES.map(scene => {
            const segments = SCRIPT_SEGMENTS.filter(s => s.sceneIndex === scene.index);
            const isSceneActive = currentTime >= scene.startTime && currentTime < scene.endTime;

            return (
              <div
                key={scene.id}
                className={`border rounded-xl p-3.5 transition-all duration-200 ${
                  isSceneActive
                    ? 'border-red-500/60 bg-red-950/20 shadow-lg'
                    : 'border-white/10 bg-slate-900/40'
                }`}
              >
                {/* Scene Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: scene.accentColor }}
                    />
                    <span className="font-bold text-white uppercase text-[11px]">
                      {scene.title} ({scene.timeRange})
                    </span>
                  </div>
                  <button
                    onClick={() => onJumpToTime(scene.startTime)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Jump ▶
                  </button>
                </div>

                {/* SFX / Visual Description */}
                <div className="bg-black/50 p-2 rounded-lg text-[10px] space-y-1 mb-2.5 text-white/60">
                  <div>
                    <span className="text-amber-400 font-bold">SFX:</span> {scene.sfxDescription}
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold">VISUAL:</span> {scene.visualDescription}
                  </div>
                </div>

                {/* Lines in Scene */}
                <div className="space-y-2">
                  {segments.map(seg => {
                    const isLineActive = currentTime >= seg.startTime && currentTime <= seg.endTime;

                    return (
                      <div
                        key={seg.id}
                        onClick={() => onJumpToTime(seg.startTime)}
                        className={`p-2 rounded-lg cursor-pointer transition-all ${
                          isLineActive
                            ? 'bg-yellow-500/20 border border-yellow-500/50 text-white font-semibold'
                            : 'hover:bg-white/5 text-white/70'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                          <span>
                            {Math.floor(seg.startTime)}s – {Math.floor(seg.endTime)}s
                          </span>
                          {seg.sfxCue && (
                            <span className="text-red-400 font-bold">SFX: {seg.sfxCue}</span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed">"{seg.text}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
