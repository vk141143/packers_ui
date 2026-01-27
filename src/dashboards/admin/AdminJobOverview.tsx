import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobStore } from '../../store/jobStore';
import { Job } from '../../types';
import { AdminJobStatusTracker } from '../../components/common/AdminJobStatusTracker';
import { 
  CheckCircle, 
  Clock, 
  CreditCard, 
  AlertTriangle, 
  DollarSign, 
  FileText,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminJobOverview: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const updateJobs = () => {
      setJobs(jobStore.getJobs());
    };
    updateJobs();
    return jobStore.subscribe(updateJobs);
  }, []);

  // Categorize jobs by status
  const pendingQuotes = jobs.filter(j => j.status === 'client-booking-request');
  const awaitingPayment = jobs.filter(j => j.status === 'payment-pending' || j.status === 'final-payment-pending');
  const needsVerification = jobs.filter(j => j.status === 'work-completed');
  const inProgress = jobs.filter(j => j.status === 'in-progress');
  const completed = jobs.filter(j => j.status === 'completed');

  const totalRevenue = jobs
    .filter(j => j.status === 'completed')
    .reduce((sum, j) => sum + (j.finalQuote?.fixedPrice || j.estimatedValue || 0), 0);

  const pendingRevenue = jobs
    .filter(j => ['final-payment-pending', 'work-completed', 'admin-reviewed'].includes(j.status))
    .reduce((sum, j) => {
      const total = j.finalQuote?.fixedPrice || j.estimatedValue || 0;
      const deposit = j.finalQuote?.depositAmount || 0;
      return sum + Math.max(0, total - deposit);
    }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-8 mb-8"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Job Overview 📊</h1>
          <p className="text-blue-100 text-lg">Monitor all jobs and required admin actions</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{needsVerification.length}</p>
                <p className="text-xs text-red-500 mt-1">Jobs need verification</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{inProgress.length}</p>
                <p className="text-xs text-blue-500 mt-1">Active jobs</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Activity size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Revenue</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">£{pendingRevenue.toFixed(0)}</p>
                <p className="text-xs text-orange-500 mt-1">Awaiting payment</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <CreditCard size={24} className="text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">£{totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-green-500 mt-1">This period</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Priority Actions */}
        {needsVerification.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              🚨 Urgent: Jobs Need Verification ({needsVerification.length})
            </h2>
            <div className="grid gap-4">
              {needsVerification.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdminJobStatusTracker job={job} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Quotes */}
        {pendingQuotes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              📝 Quotes Needed ({pendingQuotes.length})
            </h2>
            <div className="grid gap-4">
              {pendingQuotes.slice(0, 3).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdminJobStatusTracker job={job} />
                </motion.div>
              ))}
              {pendingQuotes.length > 3 && (
                <div className="text-center py-4">
                  <p className="text-gray-600">+ {pendingQuotes.length - 3} more quotes needed</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Pending */}
        {awaitingPayment.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              💳 Awaiting Payment ({awaitingPayment.length})
            </h2>
            <div className="grid gap-4">
              {awaitingPayment.slice(0, 3).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdminJobStatusTracker job={job} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgress.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              🔄 Work in Progress ({inProgress.length})
            </h2>
            <div className="grid gap-4">
              {inProgress.slice(0, 3).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdminJobStatusTracker job={job} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              ✅ Recently Completed ({completed.length})
            </h2>
            <div className="grid gap-4">
              {completed.slice(0, 2).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdminJobStatusTracker job={job} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
              <FileText className="w-6 h-6 text-orange-600" />
              <div className="text-left">
                <p className="font-semibold text-orange-800">Create Quotes</p>
                <p className="text-sm text-orange-600">{pendingQuotes.length} pending</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div className="text-left">
                <p className="font-semibold text-red-800">Verify Jobs</p>
                <p className="text-sm text-red-600">{needsVerification.length} need verification</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <Users className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-blue-800">Assign Crews</p>
                <p className="text-sm text-blue-600">Manage assignments</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};