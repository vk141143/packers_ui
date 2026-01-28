export interface CreateJobRequest {
  property_address: string;
  date: string;
  time: string;
  service_id: number;
  urgency_level_id: string;
  property_size: string;
  van_loads: number;
  waste_types: string;
  furniture_items: number;
}

export interface JobResponse {
  id: string;
  property_address: string;
  date: string;
  time: string;
  service_id: number;
  urgency_level_id: string;
  property_size: string;
  van_loads: number;
  waste_types: string;
  furniture_items: number;
  status: string;
  created_at: string;
}

export interface ConfirmJobResponse {
  message: string;
}

export const jobsApi = {
  createJob: async (jobData: CreateJobRequest): Promise<JobResponse> => {
    const response = await fetch('/api/jobs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to create job`);
    }
    
    return response.json();
  },

  getJobById: async (jobId: string): Promise<JobResponse> => {
    const response = await fetch(`/api/jobs/${jobId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to get job`);
    }
    
    return response.json();
  },

  getAllJobs: async (): Promise<JobResponse[]> => {
    const response = await fetch('/api/jobs/');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to get jobs`);
    }
    
    return response.json();
  },

  confirmJob: async (jobId: string): Promise<ConfirmJobResponse> => {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('/api/jobs/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ job_id: jobId })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to confirm job`);
    }
    
    return response.json();
  }
};