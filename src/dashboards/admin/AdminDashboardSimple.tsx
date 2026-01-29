import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { getPendingCrew } from '../../services/authService';
import { getAdminActiveJobs } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsData, usersData] = await Promise.all([
        getAdminActiveJobs().then(res => res.data || []),
        getPendingCrew().catch(() => [])
      ]);
      setJobs(jobsData);
      setPendingUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: 'User Approvals', 
      count: pendingUsers.length, 
      icon: Users, 
      color: 'bg-orange-500',
      path: '/admin/users'
    },
    { 
      label: 'Quote Management', 
      count: jobs.filter(j => j.status === 'Quote Sent' || j.status === 'Needs Quote').length, 
      icon: FileText, 
      color: 'bg-blue-500',
      path: '/admin/quotes'
    },
    { 
      label: 'Crew Assignment', 
      count: jobs.filter(j => j.status === 'Quote Accepted' && j.crew === 'Not assigned').length, 
      icon: Users, 
      color: 'bg-green-500',
      path: '/admin/assign-crew'
    },
    { 
      label: 'Job Verification', 
      count: jobs.filter(j => j.status === 'payment_pending').length, 
      icon: CheckCircle, 
      color: 'bg-purple-500',
      path: '/admin/verification'
    },
  ];

  const activeJobs = jobs;

  const getJobStatus = (job: any) => {
    return { text: job.status, color: 'bg-blue-100 text-blue-700' };
  };

  const getAction = (job: any) => {
    return <span className="text-sm text-gray-600">{job.action}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                  <tr key={job.job_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{job.job_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.client}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.property}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.crew}</td>
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
