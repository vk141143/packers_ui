import { useState, useEffect } from 'react';
import { getJobHistory } from '../services/api';

export interface JobHistoryItem {
  job_id: string;
  service_type: string;
  property_address: string;
  scheduled_date: string;
  status_badge: string;
  workflow_progress: Array<{
    name: string;
    completed: boolean;
  }>;
  created_at?: string;
  updated_at?: string;
}

export const useJobHistory = () => {
  const [jobs, setJobs] = useState<JobHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token || token.startsWith('mock_token')) {
          // Mock data for demo mode
          setJobs([
            {
              job_id: '3fbe04ee-864d-4915-ae4b-f5af6b776a51',
              service_type: 'Emergency Clearance',
              property_address: 'bangalore',
              scheduled_date: '09-12-2025',
              status_badge: 'Quote Sent',
              workflow_progress: [
                { name: 'Request', completed: true },
                { name: 'Quote', completed: true },
                { name: 'Payment', completed: false },
                { name: 'Crew', completed: false },
                { name: 'Work', completed: false },
                { name: 'Complete', completed: false }
              ],
              created_at: '2025-01-15T10:00:00Z'
            }
          ]);
          setLoading(false);
          return;
        }
        
        const response = await getJobHistory();
        if (response.success && response.data) {
          setJobs(response.data);
        } else {
          setError(response.error || 'Failed to fetch jobs');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading, error, refetch: () => setLoading(true) };
};