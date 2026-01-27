import { useQuery } from '@tanstack/react-query';
import { useJobs } from './useJobs';
import { Job } from '../types';

export const useAnalytics = () => {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();

  return useQuery({
    queryKey: ['analytics', jobs],
    queryFn: () => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      // Current period jobs
      const currentJobs = jobs.filter((job: Job) => new Date(job.createdAt) >= lastMonth);
      const previousJobs = jobs.filter((job: Job) => {
        const jobDate = new Date(job.createdAt);
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
        return jobDate >= twoMonthsAgo && jobDate < lastMonth;
      });

      // Calculate trends
      const activeJobsTrend = previousJobs.length > 0 
        ? ((currentJobs.length - previousJobs.length) / previousJobs.length * 100).toFixed(0)
        : '0';

      const completedCurrent = currentJobs.filter((job: Job) => job.status === 'completed').length;
      const completedPrevious = previousJobs.filter((job: Job) => job.status === 'completed').length;
      const completedTrend = completedPrevious > 0 
        ? ((completedCurrent - completedPrevious) / completedPrevious * 100).toFixed(0)
        : '0';

      // SLA compliance
      const slaCompliantCurrent = currentJobs.filter((job: Job) => !job.slaBreached).length;
      const slaCompliantPrevious = previousJobs.filter((job: Job) => !job.slaBreached).length;
      const currentSLARate = currentJobs.length > 0 ? (slaCompliantCurrent / currentJobs.length * 100) : 0;
      const previousSLARate = previousJobs.length > 0 ? (slaCompliantPrevious / previousJobs.length * 100) : 0;
      const slaTrend = (currentSLARate - previousSLARate).toFixed(0);

      return {
        activeJobsTrend: {
          value: `${activeJobsTrend > 0 ? '+' : ''}${activeJobsTrend}%`,
          direction: Number(activeJobsTrend) >= 0 ? 'up' : 'down'
        },
        completedTrend: {
          value: `${completedTrend > 0 ? '+' : ''}${completedTrend}%`,
          direction: Number(completedTrend) >= 0 ? 'up' : 'down'
        },
        slaTrend: {
          value: `${slaTrend > 0 ? '+' : ''}${slaTrend}%`,
          direction: Number(slaTrend) >= 0 ? 'up' : 'down'
        },
        slaComplianceRate: Math.round(currentSLARate)
      };
    },
    enabled: !jobsLoading && jobs.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};