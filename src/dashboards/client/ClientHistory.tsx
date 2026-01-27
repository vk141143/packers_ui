import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Package, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useJobHistory } from '../../hooks/useJobHistory';
import { formatDate, formatCurrency } from '../../utils/helpers';

const getStatusInfo = (status: string) => {
  if (status === 'job_created') return { label: '📝 Job Created', color: 'bg-yellow-100 text-yellow-800' };
  if (status === 'in_progress') return { label: '🔄 In Progress', color: 'bg-blue-100 text-blue-800' };
  if (status === 'completed') return { label: '✅ Completed', color: 'bg-green-100 text-green-800' };
  if (status === 'cancelled') return { label: '❌ Cancelled', color: 'bg-red-100 text-red-800' };
  return { label: '📋 New', color: 'bg-gray-100 text-gray-800' };
};

export const ClientHistory: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, loading, error } = useJobHistory();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading job history: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-6">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate('/client')} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">📋 Job History</h1>
        <p className="text-gray-600">Track all your service requests and their progress</p>
      </div>

      <div className="px-6 py-8">
        <div className="space-y-4">
          {jobs.map((job) => {
            const status = getStatusInfo(job.status_badge || job.status);
            return (
              <motion.div
                key={job.job_id || Math.random()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-600">{job.job_id?.slice(0, 8) || 'N/A'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {job.sla_status || job.status_badge}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {job.total_amount > 0 ? formatCurrency(job.total_amount) : 'Quote Pending'}
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-3">
                  {job.service_type}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{job.property_address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{job.scheduled_date}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {formatDate(job.created_at)}</span>
                    <span>Updated: {formatDate(job.updated_at)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">You haven't made any service requests yet.</p>
              <button
                onClick={() => navigate('/client/request-booking')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request Service
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};