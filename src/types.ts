export interface ScriptSegment {
  id: string;
  sceneIndex: number;
  startTime: number;
  endTime: number;
  sectionTitle: string;
  visualCue: string;
  sfxCue: string;
  text: string;
  words: { word: string; start: number; end: number }[];
}

export interface SceneMeta {
  index: number;
  id: string;
  title: string;
  timeRange: string;
  startTime: number;
  endTime: number;
  headline: string;
  sfxDescription: string;
  visualDescription: string;
  accentColor: string;
}

export interface DirectorSettings {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isMuted: boolean;
  volume: number;
  droneEnabled: boolean;
  sfxEnabled: boolean;
  voiceoverEnabled: boolean;
  cameraHudEnabled: boolean;
  scanlinesEnabled: boolean;
  glitchEnabled: boolean;
  viewMode: 'shorts' | 'landscape' | 'fullscreen';
}
