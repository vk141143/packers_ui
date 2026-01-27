import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobHistory, getJobById, getJobTracking, cancelJobRequest, submitJobRating } from '../services/api';
import { jobStore } from '../store/jobStore';
import { Job } from '../types';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token || token.startsWith('mock_token')) {
        return [
          {
            job_id: '3fbe04ee-864d-4915-ae4b-f5af6b776a51',
            property_address: 'bangalore',
            service_type: 'Emergency Clearance',
            created_at: '01/27/2026',
            total_amount: 1600,
            scheduled_date: '09-12-2025',
            status: 'Quote Sent',
            can_cancel: true
          }
        ];
      }
      
      const response = await getJobTracking();
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.error || 'Failed to fetch jobs');
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      // Check if we're in demo mode (mock token)
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock_token')) {
        // Use local jobStore for demo mode
        const job = jobStore.getJobById(id);
        console.log(`📋 useJob: Retrieved job ${id}:`, job);
        return job;
      }
      
      // Use real API for production
      const response = await getJobById(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch job');
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, reason }: { jobId: string; reason?: string }) =>
      cancelJobRequest(jobId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useSubmitRating = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      jobId, 
      rating, 
      comment, 
      crewId 
    }: { 
      jobId: string; 
      rating: number; 
      comment?: string; 
      crewId?: string; 
    }) => submitJobRating(jobId, rating, comment, crewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};