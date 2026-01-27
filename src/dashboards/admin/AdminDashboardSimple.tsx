import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobStore } from '../../store/jobStore';
import { userStore } from '../../store/userStore';
import { Job } from '../../types';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(jobStore.getJobs());
  const [pendingUsers, setPendingUsers] = useState(userStore.getPendingUsers().filter(u => u.status === 'pending'));

  useEffect(() => {
    const unsubscribe = jobStore.subscribe(() => setJobs(jobStore.getJobs()));
    const interval = setInterval(() => {
      setPendingUsers(userStore.getPendingUsers().filter(u => u.status === 'pending'));
    }, 5000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const stats = [
    { 
      label: 'User Approvals', 
      count: pendingUsers.length, 
      icon: Users, 
      color: 'bg-orange-500',
      path: '/admin/users'
    },
    { 
      label: 'Operations Review', 
      count: jobs.filter(j => j.status === 'client-booking-request').length, 
      icon: AlertCircle, 
      color: 'bg-purple-500',
      path: '/admin/operations'
    },
    { 
      label: 'Quote Management', 
      count: jobs.filter(j => j.status === 'client-booking-request' || j.status === 'admin-quoted').length, 
      icon: FileText, 
      color: 'bg-blue-500',
      path: '/admin/quotes'
    },
    { 
      label: 'Job Verification', 
      count: jobs.filter(j => j.status === 'work-completed').length, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      path: '/admin/verification'
    },
  ];

  const activeJobs = jobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled');

  const getJobStatus = (job: Job) => {
    if (job.status === 'work-completed') return { text: 'Work Done - Set Price', color: 'bg-blue-100 text-blue-700' };
    if (job.status === 'crew-dispatched') return { text: 'Crew En Route', color: 'bg-purple-100 text-purple-700' };
    if (job.status === 'in-progress') return { text: 'Crew Working', color: 'bg-orange-100 text-orange-700' };
    if (job.status === 'client-booking-request') return { text: 'Needs Quote', color: 'bg-red-100 text-red-700' };
    if (job.status === 'admin-quoted') return { text: 'Quote Sent', color: 'bg-yellow-100 text-yellow-700' };
    if (job.status === 'booking-confirmed' && !job.crewAssigned) return { text: 'Needs Crew', color: 'bg-green-100 text-green-700' };
    if (job.crewAssigned) return { text: 'Crew Assigned', color: 'bg-purple-100 text-purple-700' };
    return { text: 'New Job', color: 'bg-gray-100 text-gray-700' };
  };

  const getAction = (job: Job) => {
    if (job.status === 'work-completed') {
      return (
        <button
          onClick={() => navigate('/admin/verification', { state: { job } })}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Set Final Price
        </button>
      );
    }
    if (job.status === 'client-booking-request') {
      return (
        <button
          onClick={() => navigate('/admin/quotes', { state: { job } })}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Create Quote
        </button>
      );
    }
    if (job.status === 'booking-confirmed' && !job.crewAssigned) {
      return (
        <button
          onClick={() => navigate('/admin/assign-crew', { state: { job } })}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          Assign Crew
        </button>
      );
    }
    return <span className="text-sm text-gray-500">No action needed</span>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Operations Dashboard</h1>
        <p className="text-blue-100">Manage jobs and verify work</p>
      </div>

      {/* Alerts */}
      {pendingUsers.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-orange-900">👥 {pendingUsers.length} New Signups</p>
              <p className="text-sm text-orange-700">Users waiting for approval</p>
            </div>
            <button
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={() => navigate(stat.path)}
              className="bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-lg transition"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={24} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Active Jobs ({activeJobs.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Job ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Crew</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activeJobs.map((job) => {
                const status = getJobStatus(job);
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{job.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.clientName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.pickupAddress}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {job.crewAssigned ? job.crewAssigned.join(', ') : 'Not assigned'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getAction(job)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
