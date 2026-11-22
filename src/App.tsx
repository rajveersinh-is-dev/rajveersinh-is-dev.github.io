import React from 'react';
import { PreferencesProvider } from './context';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { CustomCursor } from './components/common/CustomCursor';
import { MathTerminal } from './components/common/MathTerminal';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ResearchInterestsSection } from './components/sections/ResearchInterestsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { PreprintsSection } from './components/sections/PreprintsSection';
import { AchievementsSection } from './components/sections/AchievementsSection';
import { SkillsLandscapeSection } from './components/sections/SkillsLandscapeSection';
import { EducationSection } from './components/sections/EducationSection';
import { CvSection } from './components/sections/CvSection';
import { TimelineSection } from './components/sections/TimelineSection';
import { ConnectionsGraphSection } from './components/sections/ConnectionsGraphSection';
import { PlaygroundSection } from './components/sections/PlaygroundSection';
import { ContactSection } from './components/sections/ContactSection';

export const App: React.FC = () => {
  return (
    <PreferencesProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-bg-void text-text-primary selection:bg-academic-amber/20 selection:text-academic-amber font-serif relative">
          {/* Custom Magnetic Cursor & Canvas Coordinate Reticle */}
          <CustomCursor />

          {/* Mathematical Terminal (REPL) */}
          <MathTerminal />

          {/* Command Palette Accessible Dialog */}
          <CommandPalette />

          {/* Global Navigation Header */}
          <Navbar />

          {/* Main Content Sections */}
          <main>
            <HeroSection />
            <AboutSection />
            <ResearchInterestsSection />
            <ProjectsSection />
            <PreprintsSection />
            <AchievementsSection />
            <SkillsLandscapeSection />
            <EducationSection />
            <CvSection />
            <TimelineSection />
            <ConnectionsGraphSection />
            <PlaygroundSection />
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </ErrorBoundary>
    </PreferencesProvider>
  );
};

export default App;
