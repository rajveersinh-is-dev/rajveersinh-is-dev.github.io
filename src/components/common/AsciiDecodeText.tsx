import React, { useState, useRef, useEffect, useCallback } from 'react';

interface AsciiDecodeTextProps {
  text: string;
  className?: string;
  durationMs?: number;
  triggerOnHover?: boolean;
}

const GLYPH_STAGES = ['·', '+', '∂', '∇'];

/**
 * Interactive ASCII Glyph Shuffle:
 * Shuffles through mathematical symbols (· → + → ∂ → ∇ → target string)
 * over ~120ms when hovering over action buttons and primary links.
 */
export const AsciiDecodeText: React.FC<AsciiDecodeTextProps> = ({
  text,
  className = '',
  durationMs = 120,
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [prevText, setPrevText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<number | null>(null);

  if (prevText !== text) {
    setPrevText(text);
    setDisplayText(text);
  }

  const triggerShuffle = useCallback(() => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayText(text);
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);

    const stepInterval = Math.max(20, Math.floor(durationMs / (GLYPH_STAGES.length + 1)));
    let currentStep = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      if (currentStep < GLYPH_STAGES.length) {
        // Show mathematical glyph prefix / shuffle
        const glyph = GLYPH_STAGES[currentStep];
        // Generate random scrambled glyphs matching length
        const scrambled = text
          .split('')
          .map((ch, idx) => (ch === ' ' ? ' ' : idx === 0 ? glyph : GLYPH_STAGES[(currentStep + idx) % GLYPH_STAGES.length]))
          .join('');
        setDisplayText(scrambled);
        currentStep++;
      } else {
        // Final resolution to target text
        setDisplayText(text);
        setIsAnimating(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, stepInterval);
  }, [text, durationMs, isAnimating]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <span
      className={`inline-block font-mono transition-colors ${className}`}
      onMouseEnter={triggerOnHover ? triggerShuffle : undefined}
    >
      {displayText}
    </span>
  );
};
