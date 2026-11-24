import React, { useRef, useEffect } from 'react';
import { usePreferences } from '../../context';

/**
 * ArchivalPortrait:
 * A stylized procedural monochrome portrait plate utilizing an authentic
 * 4x4 Bayer dither matrix and archival mathematical engravings.
 * Renders offline with zero remote assets.
 */
export const ArchivalPortrait: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = usePreferences();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 240;
    const height = 280;
    canvas.width = width;
    canvas.height = height;

    // Palette resolution based on theme
    const isAmber = theme === 'amber-crt';
    const isPaper = theme === 'paper';

    const bgR = isAmber ? 18 : isPaper ? 245 : 26;
    const bgG = isAmber ? 14 : isPaper ? 242 : 24;
    const bgB = isAmber ? 4 : isPaper ? 234 : 22;

    const fgR = isAmber ? 255 : isPaper ? 28 : 237;
    const fgG = isAmber ? 176 : isPaper ? 25 : 232;
    const fgB = isAmber ? 0 : isPaper ? 23 : 223;

    // 4x4 Bayer matrix
    const bayer4x4 = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5],
    ];

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const centerX = width / 2;
    const centerY = height / 2 - 10;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // Mathematical silhouette field: stylized scholarly bust/head form
        // Head oval
        const dxH = (x - centerX) / 48;
        const dyH = (y - (centerY - 22)) / 58;
        const headDist = Math.sqrt(dxH * dxH + dyH * dyH);

        // Shoulder curve
        const dxS = (x - centerX) / 88;
        const dyS = (y - (centerY + 68)) / 54;
        const shoulderDist = Math.sqrt(dxS * dxS + dyS * dyS);

        // Academic Collar / Lapel lines
        const lapel = Math.abs(x - centerX) - (y - centerY) * 0.45;

        // Base luminance field [0, 1]
        let intensity = 0.08;

        if (headDist < 1.0) {
          // Face lighting gradient from top-left
          const lightX = (x - (centerX - 24)) / 45;
          const lightY = (y - (centerY - 35)) / 55;
          const lightDist = Math.sqrt(lightX * lightX + lightY * lightY);
          intensity = Math.max(0.2, 0.85 - lightDist * 0.65);

          // Eye/glasses structure hint
          if (y >= centerY - 28 && y <= centerY - 22 && Math.abs(x - centerX) < 32) {
            intensity *= 0.55;
          }
        } else if (shoulderDist < 1.0 && y > centerY + 10) {
          intensity = 0.35 + (y / height) * 0.25;
          if (Math.abs(lapel) < 4) {
            intensity = 0.75;
          }
        }

        // Geometric contour orbits
        const rOrbit = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (Math.abs(rOrbit - 105) < 1.2 || Math.abs(rOrbit - 120) < 0.8) {
          intensity = Math.min(1.0, intensity + 0.4);
        }

        // Apply Bayer threshold
        const bayerVal = (bayer4x4[y % 4][x % 4] + 0.5) / 16;
        const isFg = intensity > bayerVal;

        if (isFg) {
          data[idx] = fgR;
          data[idx + 1] = fgG;
          data[idx + 2] = fgB;
          data[idx + 3] = 235;
        } else {
          data[idx] = bgR;
          data[idx + 1] = bgG;
          data[idx + 2] = bgB;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Subtle framing annotations
    ctx.strokeStyle = isAmber ? '#805800' : isPaper ? '#38332d' : '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, width - 12, height - 12);
  }, [theme]);

  return (
    <figure className={`flex flex-col items-center space-y-2 select-none ${className}`}>
      <div className="relative p-1.5 rounded border border-paper-border-strong bg-paper-bg-base shadow-sm">
        {/* Cadastral corner brackets */}
        <div className="absolute top-1 left-1 text-[9px] font-mono text-academic-amber select-none leading-none">┌</div>
        <div className="absolute top-1 right-1 text-[9px] font-mono text-academic-amber select-none leading-none">┐</div>
        <div className="absolute bottom-1 left-1 text-[9px] font-mono text-academic-amber select-none leading-none">└</div>
        <div className="absolute bottom-1 right-1 text-[9px] font-mono text-academic-amber select-none leading-none">┘</div>

        <canvas
          ref={canvasRef}
          className="rounded-xs block"
          style={{ width: '180px', height: '210px' }}
          aria-label="Procedural 1-bit Bayer dithered archival portrait of Rajveersinh Pardeshi"
        />
      </div>

      <figcaption className="text-center space-y-0.5">
        <span className="block text-[10px] font-mono text-academic-amber font-bold tracking-wider uppercase">
          PLATE I • ARCHIVAL PORTRAIT
        </span>
        <span className="block text-[9px] font-mono text-ink-muted">
          R. V. Pardeshi • Pune, IN (2026)
        </span>
      </figcaption>
    </figure>
  );
};
