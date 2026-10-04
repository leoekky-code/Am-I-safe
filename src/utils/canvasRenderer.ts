import serverImageSrc from '../assets/images/server_eastern_europe_1791131628573.jpg';
import vaultImageSrc from '../assets/images/dark_web_data_vault_1791131641566.jpg';
import terminalImageSrc from '../assets/images/hacker_terminal_code_1791131652509.jpg';
import mirrorImageSrc from '../assets/images/smartphone_mirror_dark_1791131663164.jpg';
import { SCRIPT_SEGMENTS } from '../data/scriptData';

class CanvasRenderer {
  private images: { [key: string]: HTMLImageElement } = {};
  private imagesLoaded = false;

  public async preloadImages(): Promise<void> {
    if (this.imagesLoaded) return;

    const sources = {
      server: serverImageSrc,
      vault: vaultImageSrc,
      terminal: terminalImageSrc,
      mirror: mirrorImageSrc
    };

    const promises = Object.entries(sources).map(([key, src]) => {
      return new Promise<void>(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.images[key] = img;
          resolve();
        };
        img.onerror = () => {
          // Fallback if image fails
          this.images[key] = img;
          resolve();
        };
        img.src = src;
      });
    });

    await Promise.all(promises);
    this.imagesLoaded = true;
  }

  public renderFrame(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    audioMeter = 0.3
  ) {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Render Scene Layer
    if (time < 7) {
      this.renderSceneHook(ctx, width, height, time);
    } else if (time < 20) {
      this.renderSceneVault(ctx, width, height, time);
    } else if (time < 35) {
      this.renderSceneConflict(ctx, width, height, time);
    } else if (time < 49) {
      this.renderSceneDrain(ctx, width, height, time);
    } else {
      this.renderSceneClimax(ctx, width, height, time);
    }

    // Render Global Security Camera HUD Layer
    this.renderSecurityHud(ctx, width, height, time, audioMeter);

    // Render Subtitles Layer
    this.renderSubtitles(ctx, width, height, time);

    // Scanlines
    this.renderScanlines(ctx, width, height);
  }

  private renderSceneHook(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const img = this.images['server'];
    if (img && img.complete) {
      const zoom = 1 + (time / 7) * 0.15;
      const dw = w * zoom;
      const dh = h * zoom;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    // Dark gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0,0,0,0.7)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top banner
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('CRITICAL DATA BREACH // MINSK RELAY #108', w * 0.08, h * 0.12);

    // Center Counter: 15,000,000,000
    const progress = Math.min(1, Math.pow(time / 3.2, 2.5));
    const countVal = Math.floor(15000000000 * progress);

    ctx.textAlign = 'center';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('GLOBAL CREDENTIAL DUMP', w / 2, h * 0.36);

    ctx.font = '900 68px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(countVal.toLocaleString('en-US'), w / 2, h * 0.43);

    ctx.font = '900 48px "Syne", sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('PASSWORDS EXPOSED', w / 2, h * 0.49);

    // Fake Onion Bar
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, w * 0.1, h * 0.53, w * 0.8, 64, 12, true, true);

    ctx.textAlign = 'left';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('🔒 http://pwned73kv...onion', w * 0.14, h * 0.57);

    // Leaked victim record card (time >= 4.4s)
    if (time >= 4.2) {
      const cardY = h * 0.65;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.92)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 3;
      this.roundRect(ctx, w * 0.08, cardY, w * 0.84, 180, 16, true, true);

      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('VICTIM RECORD IDENTIFIED', w * 0.12, cardY + 40);

      ctx.font = '20px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('Name: Alex M. Johnson', w * 0.12, cardY + 80);
      ctx.fillText('Address: 412 Maple Ave, Seattle WA', w * 0.12, cardY + 115);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText('Plaintext Pass: Summer2023!# [LEAKED]', w * 0.12, cardY + 150);
    }
  }

  private renderSceneVault(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const local = time - 7;
    const img = this.images['vault'];
    if (img && img.complete) {
      const zoom = 1.05 + (local / 13) * 0.12;
      const dw = w * zoom;
      const dh = h * zoom;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0,0,0,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('UNDERGROUND ARCHIVE // VAULT: 0x9F...4B', w * 0.08, h * 0.12);

    // Surface Myth vs Core Reality
    const boxW = w * 0.41;
    const boxH = 150;
    const boxY = h * 0.22;

    // Box 1: Surface
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, w * 0.07, boxY, boxW, boxH, 12, true, true);

    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('SURFACE MYTH', w * 0.1, boxY + 36);

    ctx.font = 'bold 22px "Syne", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('Contraband Bazaars', w * 0.1, boxY + 74);

    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('10% OF DARK WEB', w * 0.1, boxY + 120);

    // Box 2: Core Reality
    ctx.fillStyle = local >= 3 ? 'rgba(8, 51, 68, 0.9)' : 'rgba(0,0,0,0.7)';
    ctx.strokeStyle = local >= 3 ? '#38bdf8' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, w * 0.52, boxY, boxW, boxH, 12, true, true);

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('CORE REALITY', w * 0.55, boxY + 36);

    ctx.font = '900 22px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Human Data Clearinghouse', w * 0.55, boxY + 74);

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('90% OF TRAFFIC', w * 0.55, boxY + 120);

    // Corporate Breaches list
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('DOCUMENTED MEGA BREACHES', w / 2, h * 0.44);

    ctx.textAlign = 'left';
    const breaches = [
      { name: 'TICKETMASTER LEAK', sub: '560,000,000 Customer Files Dumped' },
      { name: 'AT&T TELECOM ARCHIVE', sub: '73,000,000 Passcodes & SSN Exposed' },
      { name: 'AES-256 DIGITAL VAULTS', sub: 'Buyer Vaults Hidden Behind Encryption' }
    ];

    breaches.forEach((b, i) => {
      const by = h * 0.48 + i * 95;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = i === 2 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      this.roundRect(ctx, w * 0.08, by, w * 0.84, 80, 14, true, true);

      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(b.name, w * 0.12, by + 34);

      ctx.font = '18px "JetBrains Mono", monospace';
      ctx.fillStyle = i === 2 ? '#38bdf8' : 'rgba(255,255,255,0.6)';
      ctx.fillText(b.sub, w * 0.12, by + 62);
    });
  }

  private renderSceneConflict(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const local = time - 20;
    const img = this.images['terminal'];
    if (img && img.complete) {
      ctx.globalAlpha = 0.35;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    }

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('SPLIT RECON: INFILTRATION // ESCROW 0.15 BTC', w * 0.08, h * 0.12);

    // Split Cards
    const cardW = w * 0.41;
    const cardH = 460;
    const cardY = h * 0.18;

    // Left: Victim Phone
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, w * 0.07, cardY, cardW, cardH, 16, true, true);

    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('📱 Target Phone', w * 0.1, cardY + 40);

    // Chat bubble 1
    ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
    this.roundRect(ctx, w * 0.1, cardY + 70, cardW * 0.8, 70, 10, true, false);
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Hey! Grabbing coffee', w * 0.12, cardY + 100);
    ctx.fillText('tomorrow at 9?', w * 0.12, cardY + 125);

    // Chat bubble 2
    ctx.fillStyle = '#2563eb';
    this.roundRect(ctx, w * 0.16, cardY + 160, cardW * 0.75, 70, 10, true, false);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Yeah! Just shopping', w * 0.18, cardY + 190);
    ctx.fillText('online now. See ya!', w * 0.18, cardY + 215);

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('STATUS: UNAWARE', w * 0.1, cardY + 390);

    // Right: AI Bot Terminal
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    this.roundRect(ctx, w * 0.52, cardY, cardW, cardH, 16, true, true);

    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('⚡ AI Stuffing Bot', w * 0.55, cardY + 40);

    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('USER: alex.m@gmail.com', w * 0.55, cardY + 75);

    const testLines = [
      'POST amazon/auth -> 401',
      'POST netflix/auth -> 401',
      'POST walmart/auth -> 401',
      'POST paypal/auth -> 401',
      'POST apexretail/auth -> 200 OK',
      'SESSION HIJACKED'
    ];

    testLines.forEach((tl, idx) => {
      const ly = cardY + 115 + idx * 38;
      ctx.font = tl.includes('200') ? 'bold 15px "JetBrains Mono"' : '14px "JetBrains Mono"';
      ctx.fillStyle = tl.includes('200') ? '#facc15' : '#22c55e';
      ctx.fillText(tl, w * 0.55, ly);
    });

    // Speed badge
    const speed = Math.floor(3500 + local * 950);
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`SPEED: ${speed.toLocaleString()} SITES/S`, w * 0.55, cardY + 410);
  }

  private renderSceneDrain(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const local = time - 35;
    const isFlashing = local >= 0.8 && local <= 4.0;
    const isMorning = local >= 8.5;

    ctx.fillStyle = isFlashing ? 'rgba(127, 29, 29, 0.45)' : 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, w, h);

    // Top Clock
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(isMorning ? '07:15 AM — VICTIM WAKES UP' : '03:42 AM — VICTIM ASLEEP', w * 0.08, h * 0.12);

    // ACCOUNT UNLOCKED Red banner
    const alertY = h * 0.22;
    ctx.fillStyle = isFlashing ? 'rgba(185, 28, 28, 0.9)' : 'rgba(127, 29, 29, 0.6)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    this.roundRect(ctx, w * 0.08, alertY, w * 0.84, 140, 16, true, true);

    ctx.textAlign = 'center';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('CRITICAL SECURITY ALERT', w / 2, alertY + 45);

    ctx.font = '900 48px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('ACCOUNT UNLOCKED', w / 2, alertY + 100);

    // Retail Store card
    ctx.textAlign = 'left';
    const storeY = h * 0.42;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, w * 0.08, storeY, w * 0.84, 260, 16, true, true);

    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🛒 APEX RETAIL STORE', w * 0.12, storeY + 45);

    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('AUTOMATED FUND DRAIN IN PROGRESS', w * 0.12, storeY + 80);

    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Saved Card (Visa •••• 4819): $500.00 Charged', w * 0.12, storeY + 125);

    // Dynamic credit
    let credit = 120;
    if (local >= 4.5 && local <= 7.5) {
      credit = Math.max(0, Math.floor(120 * (1 - (local - 4.5) / 3)));
    } else if (local > 7.5) {
      credit = 0;
    }

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = credit === 0 ? '#ef4444' : '#facc15';
    ctx.fillText(`Store Credit Balance: $${credit}.00`, w * 0.12, storeY + 170);

    ctx.font = '18px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Items: 5x $100 Digital Gift Cards Dispatched', w * 0.12, storeY + 215);

    // Morning Notification Popup
    if (isMorning) {
      const noteY = h * 0.72;
      ctx.fillStyle = '#ffffff';
      this.roundRect(ctx, w * 0.08, noteY, w * 0.84, 110, 16, true, false);

      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('✉️ Mail · 03:44 AM (Read at 07:15 AM)', w * 0.12, noteY + 36);

      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Order Confirmed: $500.00 Gift Cards Dispatched', w * 0.12, noteY + 68);

      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('By the time you wake up... the funds are gone.', w * 0.12, noteY + 95);
    }
  }

  private renderSceneClimax(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const local = time - 49;
    const img = this.images['mirror'];
    if (img && img.complete) {
      const zoom = 1.18 - (local / 11) * 0.18;
      const dw = w * zoom;
      const dh = h * zoom;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0,0,0,0.85)');
    grad.addColorStop(1, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('FINAL DIRECTIVE // ASSUME BREACHED', w * 0.08, h * 0.12);

    ctx.textAlign = 'center';
    ctx.font = '900 36px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Assume Your Information', w / 2, h * 0.22);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Is Already Leaked.', w / 2, h * 0.26);

    // 3 Golden Rules HUD
    ctx.textAlign = 'left';
    const rules = [
      { title: 'Enable Two-Factor Auth (2FA)', sub: 'Use Authenticator App / Passkeys, not SMS' },
      { title: 'Stop Reusing Passwords', sub: 'Generate unique 16+ chars per service' },
      { title: 'Check Breach Exposure', sub: 'Audit leaked credential databases routinely' }
    ];

    rules.forEach((r, idx) => {
      const ry = h * 0.33 + idx * 115;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = idx === 0 ? '#22c55e' : idx === 1 ? '#38bdf8' : '#a855f7';
      ctx.lineWidth = 2;
      this.roundRect(ctx, w * 0.08, ry, w * 0.84, 95, 14, true, true);

      // Checkmark box
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 26px "JetBrains Mono", monospace';
      ctx.fillText('✓', w * 0.12, ry + 56);

      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(r.title, w * 0.18, ry + 42);

      ctx.font = '17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText(r.sub, w * 0.18, ry + 74);
    });

    // Final punchline
    if (local >= 8.5) {
      ctx.textAlign = 'center';
      ctx.font = '900 40px "Syne", sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('...TO REACH INTO YOUR WALLET.', w / 2, h * 0.76);
    }
  }

  private renderSecurityHud(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    audioMeter: number
  ) {
    ctx.textAlign = 'left';
    // Top Bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, w, 60);

    // REC
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(40, 32, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('REC', 60, 40);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('CAM-04 // VAULT-EU', 130, 40);

    // Timecode
    const mins = Math.floor(time / 60).toString().padStart(2, '0');
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    const frames = Math.floor((time % 1) * 30).toString().padStart(2, '0');
    const tc = `00:${mins}:${secs}:${frames}`;

    ctx.textAlign = 'right';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText(tc, w - 40, 40);

    // Framing Brackets
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 3;
    const pad = 40;
    const len = 30;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(pad, pad + len);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + len, pad);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(w - pad - len, pad);
    ctx.lineTo(w - pad, pad);
    ctx.lineTo(w - pad, pad + len);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(pad, h - pad - len);
    ctx.lineTo(pad, h - pad);
    ctx.lineTo(pad + len, h - pad);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(w - pad - len, h - pad);
    ctx.lineTo(w - pad, h - pad);
    ctx.lineTo(w - pad, h - pad - len);
    ctx.stroke();

    // Bottom Footer
    ctx.textAlign = 'left';
    ctx.font = '18px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('GEO: 53.8930° N, 27.5674° E', pad, h - 25);

    // Audio Meter
    const meterX = w / 2 - 60;
    const meterY = h - 35;
    for (let i = 0; i < 10; i++) {
      const active = audioMeter * 10 >= i;
      ctx.fillStyle = active
        ? i >= 8
          ? '#ef4444'
          : i >= 5
          ? '#facc15'
          : '#22c55e'
        : 'rgba(255,255,255,0.15)';
      ctx.fillRect(meterX + i * 12, meterY - (i + 1) * 2, 8, (i + 1) * 2 + 10);
    }
  }

  private renderSubtitles(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const activeSeg = SCRIPT_SEGMENTS.find(
      seg => time >= seg.startTime && time <= seg.endTime + 0.3
    );
    if (!activeSeg) return;

    const subY = h * 0.85;

    // Subtitle background pill
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, w * 0.06, subY - 40, w * 0.88, 90, 16, true, true);

    // Draw words
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';

    // Simple single-line or multi-line wrap
    const words = activeSeg.words;
    let line1 = '';
    let line2 = '';

    words.forEach((item, idx) => {
      if (idx < words.length / 2) {
        line1 += item.word + ' ';
      } else {
        line2 += item.word + ' ';
      }
    });

    ctx.fillStyle = '#facc15';
    ctx.fillText(line1.trim(), w / 2, subY);
    if (line2.trim()) {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line2.trim(), w / 2, subY + 30);
    }
  }

  private renderScanlines(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean,
    stroke: boolean
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
}

export const canvasRenderer = new CanvasRenderer();
