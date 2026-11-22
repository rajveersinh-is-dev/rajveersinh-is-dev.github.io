import { useEffect, useRef, useState } from 'react';

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
};

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = DEFAULT_OPTIONS
) {
  const ref = useRef<T | null>(null);

  // Initialize visibility state: if prefers-reduced-motion is true or in SSR/non-browser, default to visible (true)
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    // Also default to true in environments without IntersectionObserver (such as node/jsdom tests)
    if (!('IntersectionObserver' in window)) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsVisible(true);
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const threshold = options.threshold ?? DEFAULT_OPTIONS.threshold;
  const rootMargin = options.rootMargin ?? DEFAULT_OPTIONS.rootMargin;
  const root = options.root ?? null;

  useEffect(() => {
    if (isVisible) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, threshold, rootMargin, root]);

  return [ref, isVisible] as const;
}
