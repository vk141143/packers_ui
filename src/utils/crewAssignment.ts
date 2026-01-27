import { Job } from '../types';

export interface CrewMember {
  id: string;
  name: string;
  available: boolean;
  currentJobs: number;
  skills: string[];
  location?: string;
}

export const crewDatabase: CrewMember[] = [
  { id: '1', name: 'Mike Davies', available: true, currentJobs: 0, skills: ['emergency', 'hoarder'], location: 'London' },
  { id: '2', name: 'Tom Brown', available: true, currentJobs: 1, skills: ['fire-flood', 'void'], location: 'London' },
  { id: '3', name: 'James Wilson', available: false, currentJobs: 3, skills: ['probate', 'furniture'], location: 'Manchester' },
  { id: '4', name: 'David Smith', available: true, currentJobs: 0, skills: ['emergency', 'void'], location: 'London' },
  { id: '5', name: 'Robert Johnson', available: true, currentJobs: 2, skills: ['hoarder', 'furniture'], location: 'Birmingham' },
  { id: '6', name: 'Chris Evans', available: true, currentJobs: 0, skills: ['fire-flood', 'probate'], location: 'London' },
];

export interface AutoAssignmentResult {
  success: boolean;
  crewIds: string[];
  crewNames: string[];
  reason?: string;
  method: 'auto' | 'manual';
}

/**
 * Automatically assigns crew based on availability, workload, and job requirements
 */
export const autoAssignCrew = (job: Job, crewCount: number = 2): AutoAssignmentResult => {
  // Filter available crew
  const availableCrew = crewDatabase.filter(c => c.available);

  if (availableCrew.length === 0) {
    return {
      success: false,
      crewIds: [],
      crewNames: [],
      reason: 'No crew members available',
      method: 'auto'
    };
  }

  if (availableCrew.length < crewCount) {
    return {
      success: false,
      crewIds: [],
      crewNames: [],
      reason: `Only ${availableCrew.length} crew available, need ${crewCount}`,
      method: 'auto'
    };
  }

  // Score crew based on:
  // 1. Current workload (fewer jobs = higher score)
  // 2. Skills match (if applicable)
  // 3. Location proximity (if applicable)
  const scoredCrew = availableCrew.map(crew => {
    let score = 100;
    
    // Workload scoring (less work = higher score)
    score -= crew.currentJobs * 10;
    
    // Skills match bonus
    const serviceType = job.serviceType;
    if (crew.skills.some(skill => serviceType.includes(skill))) {
      score += 20;
    }
    
    // Location match bonus (simplified - in production use actual distance)
    if (crew.location && job.pickupAddress.includes(crew.location)) {
      score += 15;
    }
    
    return { ...crew, score };
  });

  // Sort by score (highest first) and select top crew members
  const selectedCrew = scoredCrew
    .sort((a, b) => b.score - a.score)
    .slice(0, crewCount);

  return {
    success: true,
    crewIds: selectedCrew.map(c => c.id),
    crewNames: selectedCrew.map(c => c.name),
    method: 'auto'
  };
};

/**
 * Check if specific crew members are available
 */
export const checkCrewAvailability = (crewIds: string[]): boolean => {
  return crewIds.every(id => {
    const crew = crewDatabase.find(c => c.id === id);
    return crew && crew.available;
  });
};

/**
 * Get crew member details
 */
export const getCrewMember = (crewId: string): CrewMember | undefined => {
  return crewDatabase.find(c => c.id === crewId);
};

/**
 * Update crew availability (simulate real-time updates)
 */
export const updateCrewAvailability = (crewId: string, available: boolean): void => {
  const crew = crewDatabase.find(c => c.id === crewId);
  if (crew) {
    crew.available = available;
  }
};

/**
 * Increment crew workload when assigned
 */
export const incrementCrewWorkload = (crewIds: string[]): void => {
  crewIds.forEach(id => {
    const crew = crewDatabase.find(c => c.id === id);
    if (crew) {
      crew.currentJobs += 1;
    }
  });
};

/**
 * Decrement crew workload when job completed
 */
export const decrementCrewWorkload = (crewIds: string[]): void => {
  crewIds.forEach(id => {
    const crew = crewDatabase.find(c => c.id === id);
    if (crew && crew.currentJobs > 0) {
      crew.currentJobs -= 1;
    }
  });
};

/**
 * Get available crew count
 */
export const getAvailableCrewCount = (): number => {
  return crewDatabase.filter(c => c.available).length;
};

/**
 * Get crew statistics
 */
export const getCrewStats = () => {
  const total = crewDatabase.length;
  const available = crewDatabase.filter(c => c.available).length;
  const busy = total - available;
  const totalJobs = crewDatabase.reduce((sum, c) => sum + c.currentJobs, 0);
  
  return {
    total,
    available,
    busy,
    totalJobs,
    averageWorkload: totalJobs / total
  };
};
