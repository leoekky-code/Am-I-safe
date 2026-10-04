import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Body parser for video blob uploads up to 200MB
app.use(express.raw({ type: ['video/*', 'application/octet-stream'], limit: '200mb' }));
app.use(express.json({ limit: '200mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Convert uploaded video stream (WebM/MP4) into standard H.264/AAC MP4 via FFmpeg
app.post('/api/convert-to-mp4', async (req, res) => {
  try {
    const inputBuffer = req.body as Buffer;
    if (!inputBuffer || !inputBuffer.length) {
      return res.status(400).json({ error: 'No video data provided in request body' });
    }

    const tempDir = os.tmpdir();
    const id = Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const inputPath = path.join(tempDir, `input_${id}.webm`);
    const outputPath = path.join(tempDir, `dark_web_short_${id}.mp4`);

    await fs.promises.writeFile(inputPath, inputBuffer);

    // Run ffmpeg with H.264 video, yuv420p for max device compatibility, AAC audio
    const cmd = `ffmpeg -y -i "${inputPath}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 22 -c:a aac -b:a 192k -movflags +faststart "${outputPath}"`;

    exec(cmd, async (error, stdout, stderr) => {
      if (error) {
        console.error('FFmpeg error:', stderr);
        // Clean up input
        await fs.promises.unlink(inputPath).catch(() => {});
        return res.status(500).json({ error: 'FFmpeg conversion failed', details: stderr });
      }

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'attachment; filename="dark_web_passwords_exposed_short.mp4"');

      const fileStream = fs.createReadStream(outputPath);
      fileStream.pipe(res);

      fileStream.on('close', async () => {
        try {
          await fs.promises.unlink(inputPath).catch(() => {});
          await fs.promises.unlink(outputPath).catch(() => {});
        } catch {}
      });
    });
  } catch (err: any) {
    console.error('Server export error:', err);
    res.status(500).json({ error: err.message || 'Server error during export' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
