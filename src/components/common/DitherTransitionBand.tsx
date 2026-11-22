import React from 'react';

/**
 * 28px-tall procedural transition band between sections that dissolves
 * from the current section background into the next using an authentic
 * 4x4 Bayer matrix dither gradient.
 */
export const DitherTransitionBand: React.FC<{ className?: string; inverted?: boolean }> = ({
  className = '',
  inverted = false,
}) => {
  // 4x4 Bayer Matrix
  // [  0,  8,  2, 10 ]
  // [ 12,  4, 14,  6 ]
  // [  3, 11,  1,  9 ]
  // [ 15,  7, 13,  5 ]
  // We divide the 28px height into 7 bands of 4px each, with thresholds 2, 4, 6, 8, 10, 12, 14.
  const bayer4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];

  const bands = 7; // 7 rows of 4px = 28px height
  const pixelSize = 4;

  return (
    <div
      className={`w-full h-7 overflow-hidden pointer-events-none select-none relative z-10 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block text-paper-border-subtle"
        preserveAspectRatio="none"
        viewBox="0 0 100 28"
      >
        <defs>
          <pattern
            id={`bayer-dither-band-${inverted ? 'inv' : 'norm'}`}
            width="16"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            {Array.from({ length: bands }).map((_, bandIdx) => {
              const y = bandIdx * pixelSize;
              // Threshold increases from top to bottom (or inverted)
              const threshold = inverted
                ? Math.floor(((bands - bandIdx) / bands) * 16)
                : Math.floor(((bandIdx + 1) / bands) * 16);

              return bayer4x4.map((row, r) => {
                if (r >= pixelSize) return null;
                return row.map((val, c) => {
                  if (val < threshold) {
                    return (
                      <rect
                        key={`${bandIdx}-${r}-${c}`}
                        x={c * pixelSize}
                        y={y + r}
                        width={pixelSize}
                        height={pixelSize}
                        fill="currentColor"
                        opacity={0.35 + (bandIdx / bands) * 0.45}
                      />
                    );
                  }
                  return null;
                });
              });
            })}
          </pattern>
        </defs>
        <rect
          width="100%"
          height="28"
          fill={`url(#bayer-dither-band-${inverted ? 'inv' : 'norm'})`}
        />
      </svg>
    </div>
  );
};
