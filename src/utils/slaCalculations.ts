import { Job, SLAType } from '../types';

export const calculateSLADeadline = (dispatchTime: string, slaType: SLAType): string => {
  const dispatch = new Date(dispatchTime);
  const hours = slaType === '24h' ? 24 : slaType === '48h' ? 48 : 168;
  const deadline = new Date(dispatch.getTime() + hours * 60 * 60 * 1000);
  return deadline.toISOString();
};

export const calculateResponseTime = (createdAt: string, dispatchedAt: string): number => {
  const created = new Date(createdAt);
  const dispatched = new Date(dispatchedAt);
  return Math.floor((dispatched.getTime() - created.getTime()) / (1000 * 60));
};

export const calculateCompletionTime = (startedAt: string, completedAt: string): number => {
  const started = new Date(startedAt);
  const completed = new Date(completedAt);
  return Math.floor((completed.getTime() - started.getTime()) / (1000 * 60));
};

export const isSLABreached = (slaDeadline: string, completedAt?: string): boolean => {
  const deadline = new Date(slaDeadline);
  const completion = completedAt ? new Date(completedAt) : new Date();
  return completion > deadline;
};

export const getSLAStatus = (job: Job): {
  breached: boolean;
  hoursRemaining: number;
  status: 'safe' | 'warning' | 'critical' | 'breached';
} => {
  const now = new Date();
  const deadline = new Date(job.slaDeadline);
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (job.completedAt) {
    const breached = isSLABreached(job.slaDeadline, job.completedAt);
    return {
      breached,
      hoursRemaining: 0,
      status: breached ? 'breached' : 'safe',
    };
  }

  if (hoursRemaining < 0) {
    return { breached: true, hoursRemaining: 0, status: 'breached' };
  }

  if (hoursRemaining < 6) {
    return { breached: false, hoursRemaining, status: 'critical' };
  }

  if (hoursRemaining < 12) {
    return { breached: false, hoursRemaining, status: 'warning' };
  }

  return { breached: false, hoursRemaining, status: 'safe' };
};

export const lockSLAData = (job: Job): void => {
  if (job.completedAt) {
    Object.freeze(job.slaDeadline);
    Object.freeze(job.slaBreached);
    Object.freeze(job.responseTimeMinutes);
    Object.freeze(job.completionTimeMinutes);
  }
};
