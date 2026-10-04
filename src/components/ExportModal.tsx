import React, { useState, useRef, useEffect } from 'react';
import { canvasRenderer } from '../utils/canvasRenderer';
import { soundEngine } from '../utils/soundEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [durationMode, setDurationMode] = useState<'full' | 'preview'>('full'); // 60s vs 10s
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentRenderTime, setCurrentRenderTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState('');
  const [fileSizeMB, setFileSizeMB] = useState<string | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      isCancelledRef.current = true;
      setIsExporting(false);
    } else {
      isCancelledRef.current = false;
      // Preload images into canvasRenderer
      canvasRenderer.preloadImages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalDuration = durationMode === 'full' ? 60 : 10;
  const width = resolution === '1080p' ? 1080 : 720;
  const height = resolution === '1080p' ? 1920 : 1280;

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);
    setFileSizeMB(null);
    setStatusMessage('Initializing Canvas & Web Audio synth engine...');
    isCancelledRef.current = false;

    try {
      await canvasRenderer.preloadImages();

      // Create high-res offscreen rendering canvas
      const renderCanvas = document.createElement('canvas');
      renderCanvas.width = width;
      renderCanvas.height = height;
      const ctx = renderCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not create 2D canvas context');

      // Setup audio destination stream
      soundEngine.setMuted(false);
      soundEngine.setVolume(1.0);
      const audioDest = soundEngine.getMediaStreamDestination();
      const audioTracks = audioDest ? audioDest.stream.getAudioTracks() : [];

      // Capture stream from canvas at 30 FPS
      const canvasStream = renderCanvas.captureStream(30);
      const combinedTracks = [...canvasStream.getVideoTracks(), ...audioTracks];
      const combinedStream = new MediaStream(combinedTracks);

      // Determine best supported MIME type
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) {
          mimeType = 'video/mp4;codecs=avc1,mp4a.40.2';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
          mimeType = 'video/webm;codecs=vp9,opus';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        }
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: resolution === '1080p' ? 12000000 : 6000000 // 12 Mbps / 6 Mbps
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.start(100);

      // Start the audio synth drone and sound triggers
      soundEngine.startDrone();
      if (totalDuration > 0) soundEngine.playBassPulse(1.1);

      setStatusMessage('Recording video frames and procedural SFX...');

      const fps = 30;
      const totalFrames = totalDuration * fps;
      let frameIndex = 0;
      const frameInterval = 1000 / fps;

      let lastTriggeredSecond = -1;

      // Render loop running synchronously with clock
      const renderPromise = new Promise<Blob>((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (isCancelledRef.current) {
            clearInterval(intervalId);
            mediaRecorder.stop();
            soundEngine.stopDrone();
            reject(new Error('Export cancelled'));
            return;
          }

          const currentTime = frameIndex / fps;
          const currentSecond = Math.floor(currentTime);

          // Audio triggers during recording
          if (currentSecond !== lastTriggeredSecond) {
            lastTriggeredSecond = currentSecond;
            if (currentSecond === 7) soundEngine.playGlitchBurst();
            if (currentSecond === 20) {
              soundEngine.playGlitchBurst();
              soundEngine.playBassPulse(0.8);
            }
            if (currentSecond === 35) soundEngine.playAlarmBeep(true);
            if (currentSecond === 40) soundEngine.playCashDrain();
            if (currentSecond === 49) {
              soundEngine.dramaticPause(1.0);
              soundEngine.playBassPulse(1.2);
            }
          }

          // Draw onto high-res canvas
          canvasRenderer.renderFrame(ctx, width, height, currentTime, 0.4);

          // Also mirror onto the preview canvas in the dialog
          if (previewCanvasRef.current) {
            const pCtx = previewCanvasRef.current.getContext('2d');
            if (pCtx) {
              pCtx.drawImage(renderCanvas, 0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
            }
          }

          frameIndex++;
          const percent = Math.min(100, Math.floor((frameIndex / totalFrames) * 100));
          setProgress(percent);
          setCurrentRenderTime(currentTime);

          if (frameIndex >= totalFrames) {
            clearInterval(intervalId);
            soundEngine.stopDrone();
            setStatusMessage('Finalizing MP4 container...');

            mediaRecorder.onstop = () => {
              const recordedBlob = new Blob(chunks, { type: mimeType });
              resolve(recordedBlob);
            };
            mediaRecorder.stop();
          }
        }, frameInterval);
      });

      const initialBlob = await renderPromise;

      // Check if we need FFmpeg conversion for true H.264 MP4
      const filename = `dark_web_passwords_exposed_${resolution}.mp4`;
      setDownloadFilename(filename);

      if (mimeType.includes('mp4')) {
        // Native browser MP4
        const url = URL.createObjectURL(initialBlob);
        setDownloadUrl(url);
        setFileSizeMB((initialBlob.size / (1024 * 1024)).toFixed(1));
        setStatusMessage('Export Complete! MP4 ready for download.');
        setIsExporting(false);
      } else {
        // Convert to standard H.264 MP4 using server-side FFmpeg
        setStatusMessage('Encoding standard H.264/AAC MP4 via server FFmpeg...');

        try {
          const response = await fetch('/api/convert-to-mp4', {
            method: 'POST',
            headers: {
              'Content-Type': 'video/webm'
            },
            body: initialBlob
          });

          if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
          }

          const mp4Blob = await response.blob();
          const url = URL.createObjectURL(mp4Blob);
          setDownloadUrl(url);
          setFileSizeMB((mp4Blob.size / (1024 * 1024)).toFixed(1));
          setStatusMessage('Export Complete! H.264 MP4 ready.');
          setIsExporting(false);
        } catch (serverErr) {
          console.warn('Server ffmpeg fallback, using client blob:', serverErr);
          // Fallback to client blob download
          const url = URL.createObjectURL(initialBlob);
          setDownloadUrl(url);
          setFileSizeMB((initialBlob.size / (1024 * 1024)).toFixed(1));
          setStatusMessage('Export Complete! Video ready for download.');
          setIsExporting(false);
        }
      }
    } catch (err: any) {
      if (err.message !== 'Export cancelled') {
        console.error('Export error:', err);
        setStatusMessage(`Export failed: ${err.message || err}`);
      }
      setIsExporting(false);
      soundEngine.stopDrone();
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = downloadFilename || 'dark_web_passwords_exposed_short.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-lg">🎬</span>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white font-tech uppercase tracking-wide">
                EXPORT INFOGRAPHIC SHORT TO MP4
              </h3>
              <p className="text-[11px] text-white/50">
                High-definition 9:16 vertical video with synth drone, sound effects & camera HUD
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isExporting) isCancelledRef.current = true;
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-white">
          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resolution Selector */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 space-y-2">
              <label className="text-white/60 text-[11px] font-bold block">
                RESOLUTION (9:16 VERTICAL SHORTS):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => setResolution('1080p')}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    resolution === '1080p'
                      ? 'bg-red-600 border-red-500 text-white font-bold'
                      : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="font-bold text-xs">1080 × 1920</div>
                  <div className="text-[10px] opacity-75">Full HD (Shorts)</div>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => setResolution('720p')}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    resolution === '720p'
                      ? 'bg-red-600 border-red-500 text-white font-bold'
                      : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="font-bold text-xs">720 × 1280</div>
                  <div className="text-[10px] opacity-75">Standard (Fast)</div>
                </button>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 space-y-2">
              <label className="text-white/60 text-[11px] font-bold block">
                DURATION:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => setDurationMode('full')}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    durationMode === 'full'
                      ? 'bg-red-600 border-red-500 text-white font-bold'
                      : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="font-bold text-xs">Full Short (60s)</div>
                  <div className="text-[10px] opacity-75">All 5 Script Scenes</div>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => setDurationMode('preview')}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    durationMode === 'preview'
                      ? 'bg-red-600 border-red-500 text-white font-bold'
                      : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="font-bold text-xs">Sample Cut (10s)</div>
                  <div className="text-[10px] opacity-75">Quick Test Clip</div>
                </button>
              </div>
            </div>
          </div>

          {/* Video Preview and Live Rendering Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/60 p-4 rounded-xl border border-white/10">
            {/* Live Canvas Monitor */}
            <div className="relative w-28 h-48 sm:w-36 sm:h-64 bg-black border border-white/20 rounded-xl overflow-hidden shadow-xl shrink-0 flex items-center justify-center">
              <canvas
                ref={previewCanvasRef}
                width={270}
                height={480}
                className="w-full h-full object-cover"
              />
              {!isExporting && !downloadUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 text-[10px] text-white/40">
                  <span>9:16 Monitor</span>
                  <span>Ready</span>
                </div>
              )}
            </div>

            {/* Live Status & Progress */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {isExporting ? 'RENDERING & RECORDING' : downloadUrl ? 'EXPORT READY' : 'READY TO RENDER'}
                </span>
                <span className="text-red-400 font-bold tabular-nums">
                  {progress}% ({currentRenderTime.toFixed(1)}s / {totalDuration}s)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status Message */}
              <div className="text-[11px] text-white/70 bg-slate-900/90 p-2.5 rounded-lg border border-white/10 min-h-[42px] flex items-center">
                <span className="text-red-400 mr-2">▶</span>
                <span>{statusMessage || 'Click "Start MP4 Export" to begin rendering.'}</span>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-white/50 font-mono">
                <div>FORMAT: H.264 MP4</div>
                <div>AUDIO: 48kHz Stereo</div>
                <div>FPS: 30.00</div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-[11px] text-white/50">
              {downloadUrl && fileSizeMB && (
                <span className="text-emerald-400 font-bold">
                  File generated ({fileSizeMB} MB)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isExporting ? (
                <button
                  type="button"
                  onClick={() => {
                    isCancelledRef.current = true;
                    setIsExporting(false);
                    soundEngine.stopDrone();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  Cancel Export
                </button>
              ) : downloadUrl ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                >
                  <span>⬇</span> DOWNLOAD MP4 NOW
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartExport}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                >
                  <span>🎬</span> START MP4 EXPORT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
