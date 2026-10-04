import React from 'react';
import { SceneHook } from './scenes/SceneHook';
import { SceneVault } from './scenes/SceneVault';
import { SceneConflict } from './scenes/SceneConflict';
import { SceneDrain } from './scenes/SceneDrain';
import { SceneClimax } from './scenes/SceneClimax';
import { SecurityCameraHud } from './SecurityCameraHud';
import { SubtitlesOverlay } from './SubtitlesOverlay';
import { SCENES } from '../data/scriptData';
import { DirectorSettings } from '../types';

interface VideoPlayerProps {
  currentTime: number;
  settings: DirectorSettings;
  onTogglePlay: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentTime,
  settings,
  onTogglePlay
}) => {
  // Determine active scene
  const activeSceneIndex = SCENES.findIndex(
    s => currentTime >= s.startTime && currentTime < s.endTime
  );
  const currentScene = SCENES[activeSceneIndex] || SCENES[SCENES.length - 1];

  // Render scene based on current time
  const renderScene = () => {
    if (currentTime < 7) {
      return <SceneHook currentTime={currentTime} />;
    } else if (currentTime < 20) {
      return <SceneVault currentTime={currentTime} />;
    } else if (currentTime < 35) {
      return <SceneConflict currentTime={currentTime} />;
    } else if (currentTime < 49) {
      return <SceneDrain currentTime={currentTime} />;
    } else {
      return <SceneClimax currentTime={currentTime} />;
    }
  };

  // Determine container dimensions based on viewMode
  let aspectStyle = 'aspect-[9/16] max-h-[76vh] w-auto max-w-[420px]';
  if (settings.viewMode === 'landscape') {
    aspectStyle = 'aspect-[16/9] max-h-[76vh] w-full max-w-[960px]';
  } else if (settings.viewMode === 'fullscreen') {
    aspectStyle = 'w-full h-[78vh] max-w-5xl';
  }

  return (
    <div className="relative flex items-center justify-center w-full py-2">
      {/* Phone / Screen Frame */}
      <div
        onClick={onTogglePlay}
        className={`relative ${aspectStyle} w-full mx-auto bg-black rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border-2 border-white/20 transition-all duration-300 cursor-pointer group select-none`}
      >
        {/* Dynamic Scene Component */}
        <div className="w-full h-full relative">
          {renderScene()}
        </div>

        {/* Security Camera HUD Overlay */}
        <SecurityCameraHud
          currentTime={currentTime}
          currentSceneTitle={currentScene.title}
          enabled={settings.cameraHudEnabled}
        />

        {/* Dynamic Karaoke Subtitles Overlay */}
        <SubtitlesOverlay currentTime={currentTime} />

        {/* CRT Scanline Filter Overlay */}
        {settings.scanlinesEnabled && (
          <div className="absolute inset-0 pointer-events-none scanlines z-20 opacity-35" />
        )}

        {/* Security Vignette */}
        <div className="absolute inset-0 pointer-events-none vignette-security z-20 opacity-60" />

        {/* Glitch Overlay if toggled */}
        {settings.glitchEnabled && (currentTime % 8 < 0.25 || (currentTime >= 35 && currentTime <= 37)) && (
          <div className="absolute inset-0 pointer-events-none bg-red-500/10 mix-blend-color-dodge z-30 animate-glitch" />
        )}

        {/* Subtle Play / Pause Overlay Hint on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-40 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/60 border border-white/30 backdrop-blur-md flex items-center justify-center text-white text-xl shadow-xl">
            {settings.isPlaying ? '❚❚' : '▶'}
          </div>
        </div>
      </div>
    </div>
  );
};
