import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '../../components/common/DataTable';
import { JobVerificationModal } from '../../components/common/JobVerificationModal';
import { InvoiceGenerationModal } from '../../components/common/InvoiceGenerationModal';
import { formatDate } from '../../utils/helpers';
import { AlertCircle, Users, CheckCircle, TrendingUp, AlertTriangle, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPendingCrew, getUnassignedJobs, getJobsPendingVerification } from '../../services/authService';
import { Job, Invoice } from '../../types';
import { ComprehensiveWorkflow } from '../../components/workflow/ComprehensiveWorkflow';
import { OperationsReviewDashboard } from './OperationsReviewDashboard';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showOpsReview, setShowOpsReview] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('🔑 Using token:', token ? 'Token exists' : 'No token');
      
      const [pendingCrewData, activeJobsData] = await Promise.all([
        getPendingCrew().catch(err => {
          console.error('❌ Failed to fetch pending crew:', err);
          return [];
        }),
        fetch('https://voidworksgroup.co.uk/api/admin/dashboard/active-jobs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(async res => {
          console.log('📡 API Response status:', res.status);
          if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ API Error:', errorText);
            return [];
          }
          const data = await res.json();
          console.log('✅ API Response data:', data);
          return data;
        }).catch(err => {
          console.error('❌ Failed to fetch active jobs:', err);
          return [];
        })
      ]);
      
      console.log('📊 Final data - Pending Crew:', pendingCrewData?.length || 0);
      console.log('📊 Final data - Active Jobs:', activeJobsData?.length || 0);
      
      setPendingUsers(pendingCrewData || []);
      setJobs(activeJobsData || []);
    } catch (error) {
      console.error('💥 Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const urgentJobs = jobs?.filter(job => {
    const scheduledDate = new Date(job.scheduled_date || job.scheduledDate);
    const now = new Date();
    const timeDiff = scheduledDate.getTime() - now.getTime();
    const hoursUntilJob = timeDiff / (1000 * 3600);
    
    return hoursUntilJob <= 12 && hoursUntilJob > 0;
  }) || [];

  const handleVerifyJob = (jobId: string, finalPrice: number) => {
    // Update local state only since we're using API data
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'awaiting-payment' as const,
          finalPrice: finalPrice,
        };
      }
      return job;
    });
    setJobs(updatedJobs);
    setShowVerificationModal(false);
    alert(`Job verified and final price £${finalPrice} sent to client!`);
  };

  const handleRejectJob = (jobId: string, reason: string) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'admin-rejected' as const,
          rejectionReason: reason,
        };
      }
      return job;
    });
    setJobs(updatedJobs);
    setShowVerificationModal(false);
  };

  const handleInvoiceComplete = (invoice: Invoice) => {
    if (selectedJob) {
      const updatedJobs = jobs.map(job => {
        if (job.id === selectedJob.id) {
          return {
            ...job,
            status: 'completed' as const,
            invoiceId: invoice.id
          };
        }
        return job;
      });
      setJobs(updatedJobs);
    }
    setShowInvoiceModal(false);
    setSelectedJob(null);
  };

  const columns = [
    { header: 'Job ID', accessor: 'job_id' as const },
    { header: 'Client', accessor: 'client' as const },
    { header: 'Property', accessor: 'property' as const },
    { header: 'Crew', accessor: 'crew' as const },
    { header: 'Status', accessor: 'status' as const },
    { header: 'Action', accessor: 'action' as const },
    { 
      header: 'Job Status', 
      accessor: (row: any) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          {row.status}
        </span>
      )
    },
    { 
      header: 'What To Do Next', 
      accessor: (row: any) => (
        <span className="text-xs font-semibold text-gray-600">
          {row.action}
        </span>
      )
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 mb-8 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, delay: 4 }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Operations Control 🏢
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-blue-200"
              >
                Manage jobs, verify work, and process payments
              </motion.p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOpsReview(!showOpsReview)}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${
                  showOpsReview 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <AlertCircle size={20} />
                {showOpsReview ? 'Hide Ops Review' : 'Operations Review'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWorkflow(!showWorkflow)}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${
                  showWorkflow 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <AlertCircle size={20} />
                {showWorkflow ? 'Hide Workflow' : 'Show 8-Step Workflow'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Users size={20} />
                Back to Dashboard
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Operations Review Dashboard */}
        {showOpsReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="-mx-4 -mt-6"
          >
            <OperationsReviewDashboard />
          </motion.div>
        )}

        {/* 8-Step Workflow */}
        {showWorkflow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-orange-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Complete 8-Step Workflow Process</h3>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                AI → Ops Review → Client Quote → Deposit → Schedule → Execute → Verify → Invoice
              </span>
            </div>
            <ComprehensiveWorkflow />
          </motion.div>
        )}

        {/* User Approval Alert - Show if there are pending users */}
        {pendingUsers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 shadow-xl text-white mb-6"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="bg-white/20 p-4 rounded-xl"
              >
                <Users size={32} />
              </motion.div>
              <div className="flex-1">
                <p className="text-xl font-bold">
                  👥 NEW SIGNUPS: {pendingUsers.length} {pendingUsers.length === 1 ? 'user needs' : 'users need'} approval
                </p>
                <p className="text-orange-100 mt-1">
                  Crew and sales team members waiting for account activation
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/users')}
                className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Review Applications
              </motion.button>
            </div>
          </motion.div>
        )}

        {urgentJobs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 shadow-xl text-white"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="bg-white/20 p-4 rounded-xl"
              >
                <AlertCircle size={32} />
              </motion.div>
              <div className="flex-1">
                <p className="text-xl font-bold">
                  🚨 URGENT: {urgentJobs.length} {urgentJobs.length === 1 ? 'job requires' : 'jobs require'} immediate action
                </p>
                <p className="text-red-100 mt-1">
                  Emergency jobs or SLA deadlines approaching within 12 hours
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/sla')}
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View All
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid - Only show when not in Operations Review mode */}
        {!showOpsReview && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { label: 'User Approvals', value: pendingUsers.length, icon: Users, gradient: 'from-orange-500 to-orange-600', desc: '👥 Crew & Sales Signups', delay: 0.05, onClick: () => navigate('/admin/users') },
              { label: 'Operations Review', value: jobs.filter(j => j.status === 'client-booking-request').length, icon: AlertCircle, gradient: 'from-purple-500 to-purple-600', desc: '🤖 Step 2: AI → Ops Review', delay: 0.1, onClick: () => navigate('/admin/operations') },
              { label: 'Quote Management', value: jobs.filter(j => j.status === 'client-booking-request' || j.status === 'admin-quoted').length, icon: FileText, gradient: 'from-blue-500 to-blue-600', desc: '💰 Step 3: Final Quote Creation', delay: 0.2, onClick: () => navigate('/admin/quotes') },
              { label: 'Crew Assignment', value: jobs.filter(j => j.status === 'booking-confirmed' && !j.crewAssigned).length, icon: Users, gradient: 'from-green-500 to-green-600', desc: '👥 Step 6: Job Scheduling', delay: 0.3, onClick: () => navigate('/admin/assign-crew') },
              { label: 'Job Verification', value: jobs.filter(j => j.status === 'work-completed').length, icon: CheckCircle, gradient: 'from-red-500 to-red-600', desc: '✅ Step 8: Verification & Invoice', delay: 0.4, onClick: () => navigate('/admin/verification') },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={stat.onClick}
                  className={`bg-white rounded-2xl shadow-lg p-6 ${stat.onClick ? 'cursor-pointer' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quick Actions - Only show when not in Operations Review mode */}
        {!showOpsReview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'User Approvals', desc: `${pendingUsers.length} pending signups`, icon: Users, gradient: 'from-orange-600 to-orange-700', onClick: () => navigate('/admin/users'), img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop', badge: pendingUsers.length > 0 ? pendingUsers.length : null },
              { title: 'Operations Review', desc: 'Step 2: Review AI analyses', icon: Eye, gradient: 'from-purple-600 to-purple-700', onClick: () => navigate('/admin/operations'), img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop' },
              { title: 'Quote Management', desc: 'Step 3: Final quote creation', icon: FileText, gradient: 'from-blue-600 to-blue-700', onClick: () => navigate('/admin/quotes'), img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop' },
              { title: 'Job Verification', desc: 'Step 8: Verification & invoice', icon: CheckCircle, gradient: 'from-green-600 to-green-700', onClick: () => navigate('/admin/verification'), img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop' },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-xl group"
                >
                  <img src={action.img} alt={action.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${action.gradient} opacity-80`} />
                  {action.badge && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {action.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <Icon size={40} className="mb-3" />
                    <h3 className="text-xl font-bold">{action.title}</h3>
                    <p className="text-sm text-white/90 mt-1 text-center">{action.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Jobs Table - Only show when not in Operations Review mode */}
        {!showOpsReview && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Workflow Jobs - 8-Step Process
              </h3>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {jobs.length} Active
              </span>
            </div>
            <DataTable 
              data={jobs} 
              columns={columns} 
              onRowClick={(job) => {
                navigate(`/admin/job/${job.job_id}`);
              }} 
            />
          </motion.div>
        )}

        {/* Modals */}
        {selectedJob && (
          <>
            <JobVerificationModal
              job={selectedJob}
              isOpen={showVerificationModal}
              onClose={() => {
                setShowVerificationModal(false);
                setSelectedJob(null);
              }}
              onVerify={handleVerifyJob}
              onReject={handleRejectJob}
            />
            <InvoiceGenerationModal
              job={selectedJob}
              isOpen={showInvoiceModal}
              onClose={() => {
                setShowInvoiceModal(false);
                setSelectedJob(null);
              }}
              onComplete={handleInvoiceComplete}
            />
          </>
        )}
      </div>
    </div>
  );
};
