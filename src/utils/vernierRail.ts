export interface SectionDefinition {
  id: string;
  label: string;
  fallbackPx: number;
}

export const SECTION_DEFS: SectionDefinition[] = [
  { id: 'hero', label: 'TOP', fallbackPx: 0 },
  { id: 'about', label: '§ 01', fallbackPx: 400 },
  { id: 'research-interests', label: '§ 02', fallbackPx: 900 },
  { id: 'projects', label: '§ 03', fallbackPx: 1500 },
  { id: 'preprints', label: '§ 04', fallbackPx: 2200 },
  { id: 'achievements', label: '§ 05', fallbackPx: 2900 },
  { id: 'skills', label: '§ 06', fallbackPx: 3600 },
  { id: 'education', label: '§ 07', fallbackPx: 4300 },
  { id: 'connections-graph', label: '§ 10', fallbackPx: 5300 },
  { id: 'playground', label: '§ 11', fallbackPx: 6200 },
  { id: 'contact', label: '§ 12', fallbackPx: 7100 },
];

/**
 * Computes monotonic piece-wise continuous progress along the vernier rail [0, 1].
 * Maps user's scrollY directly to section landmarks so that when reading section i,
 * the vernier needle points directly to landmark i without clamping, flying out of
 * bounds, or overflowing document boundaries.
 */
export const computeNeedleProgress = (
  scrollY: number,
  maxScroll: number,
  ticks: { px: number }[]
): number => {
  if (ticks.length < 2 || maxScroll <= 0) return 0;
  if (scrollY <= 0) return 0;
  if (scrollY >= maxScroll) return 1;

  const N = ticks.length;
  // Prior to first landmark
  if (scrollY <= ticks[0].px) return 0;

  // Segmented interpolation between consecutive section landmarks
  for (let i = 0; i < N - 1; i++) {
    const pStart = ticks[i].px;
    const pEnd = ticks[i + 1].px;
    if (scrollY >= pStart && scrollY <= pEnd) {
      const span = Math.max(1, pEnd - pStart);
      const t = (scrollY - pStart) / span;
      return Math.min(1, Math.max(0, (i + t) / (N - 1)));
    }
  }

  // After last landmark:
  // If the last landmark is at or beyond maxScroll, clamp to 1.0
  const lastPx = ticks[N - 1].px;
  if (scrollY >= lastPx) {
    if (lastPx >= maxScroll) return 1;
    // When last landmark is less than maxScroll (e.g. fallback or content before footer),
    // smoothly follow dynamic document scroll progress to maxScroll (1.0)
    return Math.min(1, Math.max(0, scrollY / maxScroll));
  }

  // Fallback linear scroll progress clamped to [0, 1]
  return Math.min(1, Math.max(0, scrollY / maxScroll));
};

/**
 * Measures real section top offsets from document body, falling back to static offsets.
 */
export const getMeasuredSections = (): {
  id: string;
  label: string;
  fallbackPx: number;
  px: number;
}[] => {
  if (typeof document === 'undefined') {
    return SECTION_DEFS.map((s) => ({ ...s, px: s.fallbackPx }));
  }

  const scrollY =
    typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0;

  const sections = SECTION_DEFS.map((sec) => {
    if (sec.id === 'hero') {
      return { ...sec, px: 0 };
    }
    const el = document.getElementById(sec.id);
    if (!el) {
      return { ...sec, px: sec.fallbackPx };
    }
    const rect = el.getBoundingClientRect();
    const docTop = Math.round(rect.top + scrollY);
    return {
      ...sec,
      px: docTop >= 0 ? docTop : sec.fallbackPx,
    };
  });

  // Guarantee monotonic ascending order for robust interpolation
  for (let i = 1; i < sections.length; i++) {
    if (sections[i].px <= sections[i - 1].px) {
      sections[i].px = sections[i - 1].px + 1;
    }
  }

  return sections;
};
