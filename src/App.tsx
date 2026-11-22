import React from 'react';
import { PreferencesProvider, usePreferences } from './context';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { CustomCursor } from './components/common/CustomCursor';
import { MathTerminal } from './components/common/MathTerminal';
import { BlueprintGutter } from './components/common/BlueprintGutter';
import { DitherTransitionBand } from './components/common/DitherTransitionBand';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ResearchInterestsSection } from './components/sections/ResearchInterestsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { PreprintsSection } from './components/sections/PreprintsSection';
import { AchievementsSection } from './components/sections/AchievementsSection';
import { SkillsLandscapeSection } from './components/sections/SkillsLandscapeSection';
import { EducationSection } from './components/sections/EducationSection';
import { ConnectionsGraphSection } from './components/sections/ConnectionsGraphSection';
import { PlaygroundSection } from './components/sections/PlaygroundSection';
import { ContactSection } from './components/sections/ContactSection';

const AppContent: React.FC = () => {
  const { theme } = usePreferences();

  return (
    <div className="min-h-screen bg-bg-void text-text-primary selection:bg-academic-amber/20 selection:text-academic-amber font-serif relative">
      {/* High-Performance CRT Scanline Overlay in DEC VT220 Amber Mode */}
      {theme === 'amber-crt' && <div className="crt-scanlines" aria-hidden="true" />}

      {/* Desktop Margin Vernier Rails */}
      <BlueprintGutter side="left" />
      <BlueprintGutter side="right" />

      {/* Custom Magnetic Cursor & Canvas Coordinate Reticle */}
      <CustomCursor />

      {/* Mathematical Terminal (REPL) */}
      <MathTerminal />

      {/* Command Palette Accessible Dialog */}
      <CommandPalette />

      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Content Sections with Procedural Bayer Transition Bands */}
      <main>
        <HeroSection />
        <DitherTransitionBand />
        <AboutSection />
        <DitherTransitionBand inverted />
        <ResearchInterestsSection />
        <DitherTransitionBand />
        <ProjectsSection />
        <DitherTransitionBand inverted />
        <PreprintsSection />
        <DitherTransitionBand />
        <AchievementsSection />
        <DitherTransitionBand inverted />
        <SkillsLandscapeSection />
        <DitherTransitionBand />
        {/* § 7. Academic Curriculum & Scholarly Milestones (Consolidated Education + Timeline + CV) */}
        <EducationSection />
        <DitherTransitionBand inverted />
        <ConnectionsGraphSection />
        <DitherTransitionBand />
        <PlaygroundSection />
        <DitherTransitionBand inverted />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PreferencesProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </PreferencesProvider>
  );
};

export default App;
