import React from 'react';
import { PreferencesProvider } from './context';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
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
      <div className="min-h-screen bg-bg-void text-text-primary selection:bg-amber-500/20 selection:text-amber-400 font-sans relative">
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
    </PreferencesProvider>
  );
};

export default App;
