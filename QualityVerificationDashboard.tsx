import React, { useState, useEffect } from 'react';

interface CompletedJob {
  id: string;
  clientName: string;
  services: string[];
  completedDate: string;
  status: 'completed' | 'verified' | 'issues_reported';
  photos: string[];
  clientFeedback?: {
    rating: number;
    comments: string;
    issues: string[];
  };
}

export const QualityVerificationDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async () => {
    try {
      const response = await fetch('/api/jobs/completed');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching completed jobs:', error);
    }
  };

  const verifyJob = async (jobId: string, verified: boolean, notes?: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified, notes })
      });
      fetchCompletedJobs();
    } catch (error) {
      console.error('Error verifying job:', error);
    }
  };

  const sendFeedbackRequest = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/request-feedback`, {
        method: 'POST'
      });
      alert('Feedback request sent to client');
    } catch (error) {
      console.error('Error sending feedback request:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quality Verification</h1>

      <div className="grid gap-4">
        {jobs.map(job => (
          <div key={job.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{job.clientName}</h3>
                <p className="text-gray-600">Services: {job.services.join(', ')}</p>
                <p className="text-gray-600">Completed: {job.completedDate}</p>
                
                {job.clientFeedback && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <span className="text-yellow-500">
                        {'★'.repeat(job.clientFeedback.rating)}
                        {'☆'.repeat(5 - job.clientFeedback.rating)}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({job.clientFeedback.rating}/5)
                      </span>
                    </div>
                    {job.clientFeedback.comments && (
                      <p className="text-sm text-gray-700 mt-1">
                        "{job.clientFeedback.comments}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${
                  job.status === 'verified' ? 'bg-green-100 text-green-800' :
                  job.status === 'issues_reported' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {job.photos.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Completion Photos:</p>
                <div className="flex space-x-2">
                  {job.photos.slice(0, 3).map((photo, index) => (
                    <img 
                      key={index}
                      src={photo} 
                      alt={`Job completion ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ))}
                  {job.photos.length > 3 && (
                    <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs">
                      +{job.photos.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 space-x-2">
              {job.status === 'completed' && (
                <>
                  <button
                    onClick={() => verifyJob(job.id, true)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Verify Complete
                  </button>
                  <button
                    onClick={() => sendFeedbackRequest(job.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Request Client Feedback
                  </button>
                </>
              )}
              
              {job.clientFeedback?.issues && job.clientFeedback.issues.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 rounded">
                  <p className="text-sm font-medium text-red-800">Issues Reported:</p>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {job.clientFeedback.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};