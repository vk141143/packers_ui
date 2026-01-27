import { Job, ServiceType } from '../types';
import { mockUsers } from '../data/mockData';
import { jobStore } from '../store/jobStore';

interface CrewMember {
  id: string;
  name: string;
  availability: boolean;
  currentJobs: number;
  skills: string[];
  location: string;
  performanceScore: number;
}

// Crew database with skills and locations
const crewDatabase: Record<string, { skills: string[], location: string, performanceScore: number }> = {
  '3': { skills: ['emergency', 'fire-flood', 'general'], location: 'London', performanceScore: 95 },
  '6': { skills: ['hoarder', 'void-turnover', 'general'], location: 'London', performanceScore: 88 },
  '7': { skills: ['emergency', 'void-turnover', 'general'], location: 'Birmingham', performanceScore: 92 },
  '8': { skills: ['hoarder', 'fire-flood', 'general'], location: 'Manchester', performanceScore: 85 },
  '9': { skills: ['emergency', 'general'], location: 'London', performanceScore: 90 },
  '10': { skills: ['void-turnover', 'hoarder', 'general'], location: 'Birmingham', performanceScore: 87 },
};

// Extract location from address
const getLocationFromAddress = (address: string): string => {
  if (address.toLowerCase().includes('london')) return 'London';
  if (address.toLowerCase().includes('birmingham')) return 'Birmingham';
  if (address.toLowerCase().includes('manchester')) return 'Manchester';
  return 'London'; // Default
};

// Check crew availability
const getCrewWorkload = (): Record<string, number> => {
  const jobs = jobStore.getJobs();
  const workload: Record<string, number> = {};
  
  jobs.forEach(job => {
    if (job.status === 'in-progress' || job.status === 'scheduled') {
      job.crewIds?.forEach(crewId => {
        workload[crewId] = (workload[crewId] || 0) + 1;
      });
    }
  });
  
  return workload;
};

// Get available crew members with smart filtering
const getAvailableCrew = (job: Job): CrewMember[] => {
  const crewUsers = mockUsers.filter(u => u.role === 'crew');
  const workload = getCrewWorkload();
  const jobLocation = getLocationFromAddress(job.propertyAddress);
  
  return crewUsers.map(crew => {
    const crewData = crewDatabase[crew.id] || { skills: ['general'], location: 'London', performanceScore: 80 };
    const currentJobs = workload[crew.id] || 0;
    
    return {
      id: crew.id,
      name: crew.name,
      availability: currentJobs < 2, // Max 2 concurrent jobs
      currentJobs,
      skills: crewData.skills,
      location: crewData.location,
      performanceScore: crewData.performanceScore
    };
  }).filter(crew => crew.availability); // Only available crew
};

// Calculate crew score for job
const calculateCrewScore = (crew: CrewMember, job: Job, jobLocation: string): number => {
  let score = 0;
  
  // Skill matching (40 points)
  const jobSkill = job.serviceType;
  if (crew.skills.includes(jobSkill)) score += 40;
  else if (crew.skills.includes('general')) score += 20;
  
  // Location matching (30 points)
  if (crew.location === jobLocation) score += 30;
  
  // Performance score (20 points)
  score += (crew.performanceScore / 100) * 20;
  
  // Workload balancing (10 points)
  score += (2 - crew.currentJobs) * 5;
  
  return score;
};

// Auto-assign crew based on job requirements
export const autoAssignCrew = (job: Job): { crewIds: string[], crewNames: string[], vehicleId: string } => {
  const availableCrew = getAvailableCrew(job);
  const jobLocation = getLocationFromAddress(job.propertyAddress);
  
  // Determine crew size based on job size
  const crewSize = job.jobSize === 'XL' ? 4 : job.jobSize === 'L' ? 3 : 2;
  
  // Score and sort crew by best fit
  const scoredCrew = availableCrew.map(crew => ({
    ...crew,
    score: calculateCrewScore(crew, job, jobLocation)
  })).sort((a, b) => b.score - a.score);
  
  // Select top N crew members
  const selectedCrew = scoredCrew.slice(0, Math.min(crewSize, scoredCrew.length));
  
  // Fallback if not enough crew
  if (selectedCrew.length < crewSize) {
    console.warn(`Only ${selectedCrew.length} crew available, need ${crewSize}`);
  }
  
  // Auto-select vehicle based on job requirements
  const vehicleId = job.vehicleType || 'small-van';
  
  return {
    crewIds: selectedCrew.map(c => c.id),
    crewNames: selectedCrew.map(c => c.name),
    vehicleId
  };
};

// Auto-assign when job is approved
export const autoAssignOnApproval = (job: Job): Job => {
  const assignment = autoAssignCrew(job);
  
  return {
    ...job,
    crewIds: assignment.crewIds,
    crewAssigned: assignment.crewNames,
    vehicleId: assignment.vehicleId,
    status: 'scheduled',
    lifecycleState: 'scheduled',
    dispatchedAt: new Date().toISOString()
  };
};

// Get crew assignment explanation (for debugging/admin view)
export const getAssignmentReason = (job: Job, crewId: string): string => {
  const crew = crewDatabase[crewId];
  if (!crew) return 'General availability';
  
  const reasons: string[] = [];
  
  if (crew.skills.includes(job.serviceType)) {
    reasons.push('Skilled in ' + job.serviceType);
  }
  
  const jobLocation = getLocationFromAddress(job.propertyAddress);
  if (crew.location === jobLocation) {
    reasons.push('Local to ' + jobLocation);
  }
  
  if (crew.performanceScore >= 90) {
    reasons.push('High performer');
  }
  
  return reasons.join(', ') || 'Available crew member';
};
