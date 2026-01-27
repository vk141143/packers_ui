import React, { useState, useEffect } from 'react';

interface Job {
  id: string;
  clientName: string;
  services: string[];
  scheduledDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'verified';
  teamAssigned: string[];
  progress: number;
}

export const JobManagementDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => job.status === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Jobs</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{job.clientName}</h3>
                <p className="text-gray-600">Services: {job.services.join(', ')}</p>
                <p className="text-gray-600">Date: {job.scheduledDate}</p>
                <p className="text-gray-600">Team: {job.teamAssigned.join(', ')}</p>
              </div>
              
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${
                  job.status === 'completed' ? 'bg-green-100 text-green-800' :
                  job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status.replace('_', ' ').toUpperCase()}
                </span>
                
                <div className="mt-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{job.progress}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-x-2">
              {job.status === 'scheduled' && (
                <button
                  onClick={() => updateJobStatus(job.id, 'in_progress')}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Start Job
                </button>
              )}
              {job.status === 'in_progress' && (
                <button
                  onClick={() => updateJobStatus(job.id, 'completed')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};