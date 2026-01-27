import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../hooks/useJobs';
import { jobStore } from '../../store/jobStore';

export const JobDebugger: React.FC = () => {
  const { user } = useAuth();
  const { data: jobs = [], isLoading, error } = useJobs();

  const handleCreateTestJob = () => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    const testJob = jobStore.createJob({
      clientName: user.name,
      clientId: user.id,
      clientType: user.clientType || 'council',
      propertyAddress: 'Test Address, London, SW1A 1AA',
      serviceType: 'emergency-clearance',
      scheduledDate: new Date().toISOString(),
      urgency: 'standard',
      description: 'Test job created for debugging'
    });

    console.log('✅ Test job created:', testJob);
    alert(`✅ Test job created: ${testJob.id}`);
  };

  const handleClearJobs = () => {
    // Reset to original mock jobs
    jobStore.updateJobs([]);
    alert('🗑️ All jobs cleared');
  };

  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error.message}</div>;

  const userJobs = jobs.filter(job => job.clientId === user?.id);

  return (
    <div className="bg-white border rounded-lg p-6 m-4">
      <h3 className="text-lg font-bold mb-4">🔧 Job Debugger</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Current User:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">All Jobs ({jobs.length}):</h4>
          <div className="bg-gray-100 p-2 rounded text-sm max-h-40 overflow-y-auto">
            {jobs.map(job => (
              <div key={job.id} className="mb-2 p-2 bg-white rounded">
                <strong>{job.id}</strong> - Client ID: {job.clientId} - Status: {job.status}
                <br />
                <small>Address: {job.propertyAddress}</small>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Your Jobs ({userJobs.length}):</h4>
          <div className="bg-green-100 p-2 rounded text-sm max-h-40 overflow-y-auto">
            {userJobs.length === 0 ? (
              <p>No jobs found for your user ID: {user?.id}</p>
            ) : (
              userJobs.map(job => (
                <div key={job.id} className="mb-2 p-2 bg-white rounded">
                  <strong>{job.id}</strong> - Status: {job.status}
                  <br />
                  <small>Address: {job.propertyAddress}</small>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCreateTestJob}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Test Job
          </button>
          <button
            onClick={handleClearJobs}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear All Jobs
          </button>
        </div>
      </div>
    </div>
  );
};