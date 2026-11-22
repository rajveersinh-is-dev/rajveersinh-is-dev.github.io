// Type definitions for the structured content system

export interface ProfileData {
  fullName: string;
  professionalIdentity: string;
  age: number;
  location: string;
  tagline: string;
  writingPerspective: 'first-person';
  targetImpression: string;
  longTermAmbition: string;
  fiveYearAspiration: string;
  about: string;
  researchPhilosophy: string;
  verified: boolean;
}

export interface EducationEntry {
  id: string;
  institution: string;
  programmeOrStage: string;
  type: 'higher-education' | 'school-education';
  status: string;
  notes?: string;
  verified: boolean;
}

export interface ProjectEntry {
  id: string;
  name: string;
  conciseDescription: string;
  category: string;
  technologies: string[];
  motivation: string;
  keyIdeas: string[];
  status: string;
  githubUrl?: string;
  externalUrl?: string;
  isFeatured: boolean; // Top 5 featured
  priority: number;
  verified: boolean;
  metricsAuditNote?: string;
  simulationNote?: string;
}

export interface PublicationEntry {
  id: string;
  title: string;
  shortAbstract: string;
  researchArea: string;
  status: 'Preprint';
  authors: string[];
  recordUrl: string;
  pdfUrl?: string;
  isPeerReviewed: false;
  verified: boolean;
  year?: string;
}

export interface AchievementEntry {
  id: string;
  title: string;
  organization: 'Kaggle' | 'SOF IMO';
  description: string;
  details: string;
  isOngoing?: boolean;
  url?: string;
  verified: boolean;
}

export interface SkillEntry {
  name: string;
  description: string;
  associatedTopics: string[];
}

export interface SkillCategory {
  categoryName: string;
  proficiencyLevel: 'Intermediate';
  skills: SkillEntry[];
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  subsidiaryOrFamilyBusiness: string;
  role: string;
  responsibilities: string[];
  verified: boolean;
}

export interface ContactData {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  orcidUrl: string;
  kaggleUrl: string;
  verified: boolean;
}

export interface TimelineEntry {
  id: string;
  yearOrPeriod: string;
  title: string;
  category: 'Research' | 'Education' | 'Project' | 'Competition';
  description: string;
  verified: boolean;
}

export interface ResearchInterestNode {
  id: string;
  title: string;
  summary: string;
  connections: string[]; // Connected research interest IDs
}

export interface GraphConnectionNode {
  id: string;
  name: string;
  type: 'research' | 'project' | 'concept' | 'technology';
  description: string;
  connections: string[];
}
