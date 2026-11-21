import type { AchievementEntry } from '../types/content';

export const achievementsData: AchievementEntry[] = [
  {
    id: "kaggle-squares-in-squares",
    title: "Kaggle — Squares in Squares Competition",
    organization: "Kaggle",
    description: "7th — current reported leaderboard position; ongoing competition.",
    details: "Ranked 7th among approximately 13,000 global entries on the active public leaderboard for the Squares in Squares algorithmic competition. (Note: Leaderboard position is subject to change as competition proceeds).",
    isOngoing: true,
    url: "https://www.kaggle.com/competitions/squares-in-squares",
    verified: true,
  },
  {
    id: "sof-imo-medals",
    title: "SOF International Mathematics Olympiad (IMO)",
    organization: "SOF IMO",
    description: "Multiple school-level medals awarded across Classes 6, 7, and 8.",
    details: "Earned multiple school-level medals in Classes 6, 7, and 8 in the Science Olympiad Foundation International Mathematics Olympiad for early mathematical problem-solving aptitude.",
    isOngoing: false,
    verified: true,
  }
];
