import { describe, it, expect } from 'vitest';
import {
  profileData,
  educationData,
  projectsData,
  publicationsData,
  achievementsData,
  skillsData,
  experienceData,
  contactData,
  timelineData,
  connectionsGraphData,
} from '../data';

describe('Authoritative Content & Strict Honesty Validation', () => {
  it('strictly validates profile data without embellishment', () => {
    expect(profileData.fullName).toBe('Rajveersinh Vishal Pardeshi');
    expect(profileData.professionalIdentity).toBe('Independent Mathematical Researcher');
    expect(profileData.age).toBe(16);
    expect(profileData.location).toBe('Pune, Maharashtra, India');
    expect(profileData.tagline).toBe('Discovering Structure. Proving Ideas. Building the Future.');
    expect(profileData.about).toContain('I am an independent researcher');
    expect(profileData.researchPhilosophy).toContain('Mathematics is not merely a subject to study');
  });

  it('strictly verifies education data without synthetic graduation or performance claims', () => {
    const iitm = educationData.find((e) => e.institution.includes('IIT Madras') || e.institution.includes('Indian Institute of Technology Madras'));
    expect(iitm).toBeDefined();
    expect(iitm?.programmeOrStage).toBe('Bachelor of Science, Aerospace, Aeronautical and Astronautical Engineering');
    expect(iitm?.status).toBe('Currently Enrolled');

    const school = educationData.find((e) => e.institution.includes('Eon Gyanankur'));
    expect(school).toBeDefined();
    expect(school?.programmeOrStage).toBe('Class XII');
  });

  it('strictly checks Kaggle and SOF IMO achievements without fabricated rankings', () => {
    const kaggle = achievementsData.find((a) => a.organization === 'Kaggle');
    expect(kaggle).toBeDefined();
    expect(kaggle?.isOngoing).toBe(true);
    expect(kaggle?.description).toContain('7th');
    expect(kaggle?.description).toContain('ongoing competition');

    const sof = achievementsData.find((a) => a.organization === 'SOF IMO');
    expect(sof).toBeDefined();
    expect(sof?.description).toContain('Multiple school-level medals');
    expect(sof?.details).toContain('Classes 6, 7, and 8');
  });

  it('verifies that preprints are marked as preprints and do not claim peer review', () => {
    expect(publicationsData.length).toBeGreaterThanOrEqual(2);
    const zenodo1 = publicationsData.find((p) => p.recordUrl.includes('22273633'));
    const zenodo2 = publicationsData.find((p) => p.recordUrl.includes('22310401'));
    expect(zenodo1).toBeDefined();
    expect(zenodo2).toBeDefined();

    publicationsData.forEach((pub) => {
      expect(pub.status).toBe('Preprint');
      expect(pub.isPeerReviewed).toBe(false);
      expect(pub.authors).toContain('Rajveersinh Vishal Pardeshi');
    });
  });

  it('validates project portfolio priority order and requirements', () => {
    // Priority order: NumLang (#1), Omni Toolkit (#2), Terrain Erosion Engine (#3), Umbra (#4), DocuTrust (#5)
    expect(projectsData[0].name).toBe('NumLang');
    expect(projectsData[0].priority).toBe(1);
    expect(projectsData[0].technologies).toContain('Rust');
    expect(projectsData[0].technologies).toContain('Lean 4');

    expect(projectsData[1].name).toBe('Omni Toolkit');
    expect(projectsData[1].priority).toBe(2);

    expect(projectsData[2].name).toBe('Terrain Erosion Engine');
    expect(projectsData[2].priority).toBe(3);

    expect(projectsData[3].name).toBe('Umbra');
    expect(projectsData[3].priority).toBe(4);
    expect(projectsData[3].metricsAuditNote).toContain('70 checks, 88.67% coverage');

    expect(projectsData[4].name).toBe('DocuTrust');
    expect(projectsData[4].priority).toBe(5);

    // Verify additional projects are present
    const names = projectsData.map((p) => p.name);
    expect(names).toContain('ADHP-CSPP');
    expect(names).toContain('Dual-Pruned Decoding');
    expect(names).toContain('Early Warning Complex Systems');
    expect(names).toContain('Certified Dose');
    expect(names).toContain('Sunflower Conjecture Audit');
    expect(names).toContain('Lilium Mathematical Art');
  });

  it('verifies skill proficiency is accurately intermediate without artificial ratings', () => {
    skillsData.forEach((cat) => {
      expect(cat.proficiencyLevel).toBe('Intermediate');
    });

    const allSkills = skillsData.flatMap((c) => c.skills.map((s) => s.name));
    expect(allSkills).toContain('Rust');
    expect(allSkills).toContain('Python');
    expect(allSkills).toContain('TypeScript');
    expect(allSkills).toContain('Lean 4');
    expect(allSkills).toContain('LLVM');
    expect(allSkills).toContain('Cranelift');
  });

  it('verifies professional experience contains only reported technical roles', () => {
    const airgun = experienceData.find((e) => e.organization.includes('OnlineAirgun.com'));
    expect(airgun).toBeDefined();
    expect(airgun?.role).toBe('Website Manager');
    expect(airgun?.subsidiaryOrFamilyBusiness).toContain('Rajput Gun House / Rajput Arms');
  });

  it('verifies approved contact details and profiles', () => {
    expect(contactData.email).toBe('rajveer28dec@gmail.com');
    expect(contactData.githubUrl).toBe('https://github.com/rajveersinh-is-dev');
    expect(contactData.linkedinUrl).toContain('rajveer-pardeshi');
    expect(contactData.orcidUrl).toBe('https://orcid.org/0009-0004-7838-4064');
    expect(contactData.kaggleUrl).toBe('https://www.kaggle.com/rajveerpardeshi');
  });

  it('verifies research timeline and connections graph integrity', () => {
    expect(timelineData.length).toBeGreaterThanOrEqual(4);
    expect(connectionsGraphData.length).toBeGreaterThanOrEqual(10);

    const hasResearch = connectionsGraphData.some((n) => n.type === 'research');
    const hasProject = connectionsGraphData.some((n) => n.type === 'project');
    const hasConcept = connectionsGraphData.some((n) => n.type === 'concept');
    const hasTech = connectionsGraphData.some((n) => n.type === 'technology');

    expect(hasResearch).toBe(true);
    expect(hasProject).toBe(true);
    expect(hasConcept).toBe(true);
    expect(hasTech).toBe(true);
  });
});
