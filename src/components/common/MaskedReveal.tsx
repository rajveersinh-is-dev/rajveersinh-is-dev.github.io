import React, { useRef, useState, useEffect } from 'react';

interface MaskedRevealProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delayMs?: number;
  as?: React.ElementType;
}

export const MaskedReveal: React.FC<MaskedRevealProps> = ({
  children,
  className = '',
  innerClassName = '',
  delayMs = 0,
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  const [revealed, setRevealed] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    if (!('IntersectionObserver' in window)) return true;
    return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) setRevealed(true);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <Component ref={containerRef} className={`overflow-hidden ${className}`}>
        <div className={innerClassName}>{children}</div>
      </Component>
    );
  }

  return (
    <Component ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        className={`transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } ${innerClassName}`}
        style={{ transitionDelay: `${delayMs}ms` }}
      >
        {children}
      </div>
    </Component>
  );
};
