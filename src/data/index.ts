import { profileData } from './profile';
import { educationData } from './education';
import { projectsData } from './projects';
import { publicationsData } from './publications';
import { achievementsData } from './achievements';
import { skillsData } from './skills';
import { experienceData } from './experience';
import { contactData } from './social';
import { timelineData } from './timeline';
import { researchInterestsData } from './researchInterests';
import { connectionsGraphData } from './connections';

export {
  profileData,
  educationData,
  projectsData,
  publicationsData,
  achievementsData,
  skillsData,
  experienceData,
  contactData,
  timelineData,
  researchInterestsData,
  connectionsGraphData,
};

// Content verification check
export function validateContentIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!profileData.fullName || profileData.fullName.trim() === '') {
    errors.push('Profile full name is missing.');
  }

  if (profileData.age !== 16) {
    errors.push(`Profile age expected 16, found ${profileData.age}.`);
  }

  // Ensure top 5 projects exist
  const featuredProjects = projectsData.filter(p => p.isFeatured);
  if (featuredProjects.length < 5) {
    errors.push(`Expected at least 5 featured projects, found ${featuredProjects.length}.`);
  }

  // Ensure 2 Zenodo preprints exist
  const zenodoPreprints = publicationsData.filter(p => p.recordUrl.includes('zenodo.org'));
  if (zenodoPreprints.length < 2) {
    errors.push(`Expected at least 2 Zenodo preprints, found ${zenodoPreprints.length}.`);
  }

  // Ensure no unverified publications claim peer review
  publicationsData.forEach(pub => {
    if (pub.isPeerReviewed) {
      errors.push(`Publication ${pub.id} cannot claim peer review.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
