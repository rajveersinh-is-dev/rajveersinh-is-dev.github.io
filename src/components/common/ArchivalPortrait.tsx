import React, { useRef, useEffect, useState } from 'react';
import { usePreferences } from '../../context';
import portraitImg from '../../assets/portrait.jpg';

/**
 * ArchivalPortrait:
 * A retro-scientific archival portrait plate of Rajveersinh Vishal Pardeshi.
 * Renders an authentic 8x8 Bayer-dithered monochrome engraving in the active
 * palette (Night Study, Archival Paper, or DEC VT220 Amber CRT), with an
 * interactive toggle to inspect the thematically graded photographic plate.
 * 100% offline operational independence.
 */
export const ArchivalPortrait: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, playClick } = usePreferences();
  const [mode, setMode] = useState<'dither' | 'photo'>('dither');
  const [, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina-sharp rendering dimensions (360x420 at 6:7 aspect ratio)
    const width = 360;
    const height = 420;
    canvas.width = width;
    canvas.height = height;

    const isAmber = theme === 'amber-crt';
    const isPaper = theme === 'paper';

    // Base background colors
    const bgR = isAmber ? 10 : isPaper ? 250 : 22;
    const bgG = isAmber ? 8 : isPaper ? 247 : 20;
    const bgB = isAmber ? 2 : isPaper ? 240 : 18;

    // Foreground ink/phosphor colors
    const fgR = isAmber ? 255 : isPaper ? 28 : 237;
    const fgG = isAmber ? 176 : isPaper ? 25 : 232;
    const fgB = isAmber ? 0 : isPaper ? 23 : 223;

    // Highlight tone for fine accents (bright phosphor or rich sepia)
    const hiR = isAmber ? 255 : isPaper ? 74 : 245;
    const hiG = isAmber ? 218 : isPaper ? 60 : 200;
    const hiB = isAmber ? 77 : isPaper ? 48 : 120;

    // 8x8 Bayer Ordered Dither Matrix (64 discrete levels for high-fidelity engraving)
    const bayer8x8 = [
      [ 0, 32,  8, 40,  2, 34, 10, 42],
      [48, 16, 56, 24, 50, 18, 58, 26],
      [12, 44,  4, 36, 14, 46,  6, 38],
      [60, 28, 52, 20, 62, 30, 54, 22],
      [ 3, 35, 11, 43,  1, 33,  9, 41],
      [51, 19, 59, 27, 49, 17, 57, 25],
      [15, 47,  7, 39, 13, 45,  5, 37],
      [63, 31, 55, 23, 61, 29, 53, 21],
    ];

    const renderDither = (img: HTMLImageElement) => {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = width;
        offscreen.height = height;
        const offCtx = offscreen.getContext('2d');
        if (!offCtx) return;

        // Crop source square 360x360 into 6:7 aspect ratio (308.57 x 360)
        const srcW = img.naturalWidth || img.width || 360;
        const srcH = img.naturalHeight || img.height || 360;
        const targetAspect = width / height;
        let cropW = srcW;
        let cropH = srcH;
        let cropX = 0;
        let cropY = 0;

        if (srcW / srcH > targetAspect) {
          cropW = srcH * targetAspect;
          cropX = (srcW - cropW) / 2;
        } else {
          cropH = srcW / targetAspect;
          cropY = (srcH - cropH) / 2;
        }

        offCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, width, height);
        const imgData = offCtx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const outData = ctx.createImageData(width, height);
        const out = outData.data;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Standard ITU-R BT.601 perceptual luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            let norm = lum / 255;

            // S-curve contrast mapping to separate facial contours and voxel landscape
            norm = Math.pow(norm, 1.12);
            norm = (norm - 0.46) * 1.35 + 0.5;
            norm = Math.max(0, Math.min(1, norm));

            const bayerThreshold = (bayer8x8[y % 8][x % 8] + 0.5) / 64;

            // In Archival Paper, ink is dark on paper; in Night/Amber, phosphor is bright on dark
            const isHighlight = isPaper ? (norm < bayerThreshold) : (norm > bayerThreshold);

            if (isHighlight) {
              const isAccent = isPaper ? norm < 0.18 : norm > 0.84;
              out[idx] = isAccent ? hiR : fgR;
              out[idx + 1] = isAccent ? hiG : fgG;
              out[idx + 2] = isAccent ? hiB : fgB;
              out[idx + 3] = 255;
            } else {
              out[idx] = bgR;
              out[idx + 1] = bgG;
              out[idx + 2] = bgB;
              out[idx + 3] = 255;
            }
          }
        }

        ctx.putImageData(outData, 0, 0);

        // Archival inner border
        ctx.strokeStyle = isAmber ? '#805800' : isPaper ? '#38332d' : '#d97706';
        ctx.lineWidth = 1;
        ctx.strokeRect(6, 6, width - 12, height - 12);

        // Corner registration crosshairs for cadastral cartographic aesthetics
        const tick = 6;
        ctx.beginPath();
        // Top-left
        ctx.moveTo(14, 14 - tick); ctx.lineTo(14, 14 + tick);
        ctx.moveTo(14 - tick, 14); ctx.lineTo(14 + tick, 14);
        // Top-right
        ctx.moveTo(width - 14, 14 - tick); ctx.lineTo(width - 14, 14 + tick);
        ctx.moveTo(width - 14 - tick, 14); ctx.lineTo(width - 14 + tick, 14);
        // Bottom-left
        ctx.moveTo(14, height - 14 - tick); ctx.lineTo(14, height - 14 + tick);
        ctx.moveTo(14 - tick, height - 14); ctx.lineTo(14 + tick, height - 14);
        // Bottom-right
        ctx.moveTo(width - 14, height - 14 - tick); ctx.lineTo(width - 14, height - 14 + tick);
        ctx.moveTo(width - 14 - tick, height - 14); ctx.lineTo(width - 14 + tick, height - 14);
        ctx.stroke();

        setImageLoaded(true);
      } catch {
        // Fallback if canvas context extraction is restricted
      }
    };

    // Draw baseline framing immediately (useful for jsdom / offline tests)
    ctx.fillStyle = isAmber ? '#0a0802' : isPaper ? '#faf7f0' : '#161412';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = isAmber ? '#805800' : isPaper ? '#38332d' : '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    const img = new Image();
    img.src = portraitImg;
    if (img.complete && img.naturalWidth > 0) {
      renderDither(img);
    } else {
      img.onload = () => renderDither(img);
    }
  }, [theme]);

  const isAmber = theme === 'amber-crt';
  const isPaper = theme === 'paper';

  return (
    <figure className={`flex flex-col items-center space-y-2 select-none ${className}`}>
      <div
        className="relative p-1.5 rounded border border-paper-border-strong bg-paper-bg-base shadow-sm cursor-pointer group transition-transform hover:scale-[1.01]"
        onClick={() => {
          setMode(prev => (prev === 'dither' ? 'photo' : 'dither'));
          playClick();
        }}
        title="Click to toggle between Archival Engraving and Photographic Plate"
      >
        {/* Cadastral corner brackets */}
        <div className="absolute top-1 left-1 text-[9px] font-mono text-academic-amber select-none leading-none z-10">┌</div>
        <div className="absolute top-1 right-1 text-[9px] font-mono text-academic-amber select-none leading-none z-10">┐</div>
        <div className="absolute bottom-1 left-1 text-[9px] font-mono text-academic-amber select-none leading-none z-10">└</div>
        <div className="absolute bottom-1 right-1 text-[9px] font-mono text-academic-amber select-none leading-none z-10">┘</div>

        <div className="w-[190px] sm:w-[210px] aspect-[6/7] relative overflow-hidden rounded-xs bg-paper-bg-subtle">
          {/* Canvas Dither View */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full block object-cover transition-opacity duration-300 ${
              mode === 'dither' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
            aria-label="Procedural 1-bit Bayer dithered archival portrait of Rajveersinh Pardeshi"
          />

          {/* Direct Photographic View with Thematic Grading */}
          {mode === 'photo' && (
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={portraitImg}
                alt="Photograph of Rajveersinh Vishal Pardeshi"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isAmber
                    ? 'contrast-125 brightness-95 grayscale sepia hue-rotate-[5deg] saturate-[300%]'
                    : isPaper
                    ? 'contrast-110 brightness-98 sepia-[35%]'
                    : 'contrast-105 brightness-95'
                }`}
                style={{
                  objectPosition: 'center 20%',
                }}
              />
              {/* Thematic Scanline Overlay in Amber CRT mode */}
              {isAmber && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none crt-scanlines opacity-40 mix-blend-overlay"
                />
              )}
              {/* Cadastral inner border */}
              <div
                aria-hidden="true"
                className="absolute inset-[6px] border border-academic-amber/50 pointer-events-none"
              />
            </div>
          )}

          {/* Hover discovery hint */}
          <div className="absolute bottom-2 inset-x-2 py-0.5 px-1 bg-black/75 backdrop-blur-xs text-[8px] font-mono text-paper-text-dim text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded">
            Click to toggle {mode === 'dither' ? 'Photo' : 'Engraving'}
          </div>
        </div>
      </div>

      <figcaption className="text-center space-y-1.5 w-full max-w-[210px]">
        <div className="flex items-center justify-between text-[10px] font-mono text-academic-amber font-bold tracking-wider uppercase">
          <span>PLATE I • ARCHIVAL PORTRAIT</span>
          <span className="text-[9px] text-ink-muted">§ 01</span>
        </div>
        <div className="text-[9px] font-mono text-ink-muted">
          R. V. Pardeshi • Pune, IN (2026)
        </div>

        {/* Interactive Plate Mode Switcher: Dithered Engraving vs Photo Plate */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5" role="group" aria-label="Portrait display mode">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMode('dither');
              playClick();
            }}
            className={`px-2 py-0.5 text-[9px] font-mono rounded transition-colors ${
              mode === 'dither'
                ? 'bg-academic-amber/20 text-academic-amber font-bold border border-academic-amber/40'
                : 'text-ink-dim hover:text-ink-primary border border-transparent'
            }`}
            title="View authentic 8x8 Bayer-dithered archival engraving"
          >
            [● Engraving]
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMode('photo');
              playClick();
            }}
            className={`px-2 py-0.5 text-[9px] font-mono rounded transition-colors ${
              mode === 'photo'
                ? 'bg-academic-amber/20 text-academic-amber font-bold border border-academic-amber/40'
                : 'text-ink-dim hover:text-ink-primary border border-transparent'
            }`}
            title="View photographic plate with thematic grading"
          >
            [○ Photo Plate]
          </button>
        </div>
      </figcaption>
    </figure>
  );
};
