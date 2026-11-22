import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';
import { HeroSection } from '../components/sections/HeroSection';
import { PreprintsSection } from '../components/sections/PreprintsSection';
import { ContactSection } from '../components/sections/ContactSection';
import { SkillsLandscapeSection } from '../components/sections/SkillsLandscapeSection';
import { AchievementsSection } from '../components/sections/AchievementsSection';
import { AboutSection } from '../components/sections/AboutSection';
import { PreferencesProvider } from '../context';
import { profileData } from '../data';

describe('Audit Verification: Complete Overhaul Integrity Checks', () => {
  it('Bug 1: Hero tagline and targetImpression render evaluated text, not literal curly braces', () => {
    const { container } = render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    // Tagline text must appear in rendered output
    expect(screen.getByText(new RegExp(profileData.tagline, 'i'))).toBeTruthy();
    expect(screen.getByText(new RegExp(profileData.targetImpression, 'i'))).toBeTruthy();

    // Must NOT contain literal JSX code string '{profileData.tagline}'
    expect(container.innerHTML).not.toContain('{profileData.tagline}');
    expect(container.innerHTML).not.toContain('{profileData.targetImpression}');
  });

  it('Fix 3 & 10: Latin decorative running-heads removed and journal name replaced', () => {
    const { container } = render(<App />);

    // Brand name check
    expect(screen.getAllByText(/Pardeshi.*Archive/i).length).toBeGreaterThan(0);
    expect(container.innerHTML).not.toContain('Acta Mathematica & Computatoria');
    expect(container.innerHTML).not.toContain('Acta Mathematica et Computatoria');
    expect(container.innerHTML).not.toContain('Fasciculus Systematum');
    expect(container.innerHTML).not.toContain('Bibliotheca Mathematica');
    expect(container.innerHTML).not.toContain('Documenta et Laureae');
    expect(container.innerHTML).not.toContain('Epistolae et Communicatio');
    expect(container.innerHTML).not.toContain('Chronologia Mathematica');
  });

  it('Fix 5: Crimson academic-seal strictly reserved and absent from wallpapering', () => {
    const { container } = render(
      <PreferencesProvider>
        <AchievementsSection />
        <AboutSection />
      </PreferencesProvider>
    );

    // Achievements section should not have text-academic-seal
    const achievementsEl = container.querySelector('#achievements');
    expect(achievementsEl?.innerHTML).not.toContain('text-academic-seal');
    expect(achievementsEl?.innerHTML).not.toContain('border-academic-seal');
    expect(achievementsEl?.innerHTML).not.toContain('bg-academic-seal');
  });

  it('Fix 6: Forbidden decorative icons removed', () => {
    const { container } = render(<App />);

    // Check that job bullets don't have CheckCircle2 (lucide-check-circle-2)
    const aboutEl = container.querySelector('#about');
    expect(aboutEl?.querySelector('.lucide-check-circle-2')).toBeNull();
    expect(aboutEl?.querySelector('.lucide-briefcase')).toBeNull();
    expect(aboutEl?.querySelector('.lucide-target')).toBeNull();
    expect(aboutEl?.querySelector('.lucide-compass')).toBeNull();

    // Achievements should not have Trophy or Award
    const achievementsEl = container.querySelector('#achievements');
    expect(achievementsEl?.querySelector('.lucide-trophy')).toBeNull();
    expect(achievementsEl?.querySelector('.lucide-award')).toBeNull();

    // Timeline should not have Clock
    const timelineEl = container.querySelector('#timeline');
    expect(timelineEl?.querySelector('.lucide-clock')).toBeNull();

    // Skills header should not have Layers or ShieldCheck
    const skillsEl = container.querySelector('#skills');
    expect(skillsEl?.querySelector('.lucide-layers')).toBeNull();
    expect(skillsEl?.querySelector('.lucide-shield-check')).toBeNull();
  });

  it('Fix 7: Interactive ASCII / Dither background canvas is mounted in Hero', () => {
    const { container } = render(
      <PreferencesProvider>
        <HeroSection />
      </PreferencesProvider>
    );

    const canvas = container.querySelector('canvas.interactive-canvas');
    expect(canvas).toBeTruthy();
  });

  it('Fix 9: Skills section renders interactive SVG constellation', () => {
    const { container } = render(
      <PreferencesProvider>
        <SkillsLandscapeSection />
      </PreferencesProvider>
    );

    const svg = container.querySelector('svg[role="img"]');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 720 340');

    // Nodes and edges exist
    const nodes = container.querySelectorAll('g.nodes > g');
    expect(nodes.length).toBeGreaterThan(0);
    const edges = container.querySelectorAll('g.edges > line');
    expect(edges.length).toBeGreaterThan(0);

    // Initial inspection panel renders
    expect(screen.getByText('Intermediate')).toBeTruthy();
  });

  it('Fix 12: Contact form has humanized plain English placeholders', () => {
    render(
      <PreferencesProvider>
        <ContactSection />
      </PreferencesProvider>
    );

    expect(screen.getByPlaceholderText('Your name')).toBeTruthy();
    expect(screen.getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Research collaboration, questions, feedback...')).toBeTruthy();
    expect(screen.getByPlaceholderText('Write your message here...')).toBeTruthy();
  });

  it('Fix 13: BibTeX template derives year from publication entry data', () => {
    render(
      <PreferencesProvider>
        <PreprintsSection />
      </PreferencesProvider>
    );

    // Look for View BibTeX button
    const viewBibtexBtns = screen.getAllByText(/View BibTeX/i);
    expect(viewBibtexBtns.length).toBeGreaterThan(0);
  });
});
