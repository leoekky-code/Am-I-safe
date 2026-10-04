import React from 'react';
import { SCRIPT_SEGMENTS } from '../data/scriptData';

interface SubtitlesOverlayProps {
  currentTime: number;
}

export const SubtitlesOverlay: React.FC<SubtitlesOverlayProps> = ({ currentTime }) => {
  // Find current segment
  const activeSegment = SCRIPT_SEGMENTS.find(
    seg => currentTime >= seg.startTime && currentTime <= seg.endTime + 0.3
  );

  if (!activeSegment) return null;

  return (
    <div className="absolute bottom-14 md:bottom-16 left-0 right-0 z-40 px-4 md:px-8 text-center pointer-events-none flex flex-col items-center">
      {/* SFX Alert Badge if in cue */}
      {activeSegment.sfxCue && currentTime - activeSegment.startTime < 1.4 && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-[11px] font-mono text-red-300 tracking-wider animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span>SFX: {activeSegment.sfxCue}</span>
        </div>
      )}

      {/* High impact Subtitle container */}
      <div className="max-w-md bg-black/75 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-xl shadow-2xl shadow-black/80 transition-all duration-150">
        <p className="text-base md:text-lg font-bold leading-snug tracking-wide text-white">
          {activeSegment.words.map((w, index) => {
            const isWordActive = currentTime >= w.start && currentTime <= w.end + 0.15;
            const isWordPast = currentTime > w.end + 0.15;

            return (
              <span
                key={index}
                className={`inline-block mr-1.5 transition-all duration-100 ${
                  isWordActive
                    ? 'text-yellow-300 scale-110 drop-shadow-[0_0_12px_rgba(253,224,71,0.8)] font-extrabold'
                    : isWordPast
                    ? 'text-white'
                    : 'text-white/40'
                }`}
              >
                {w.word}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
