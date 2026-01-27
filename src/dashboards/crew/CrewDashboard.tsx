import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTable } from '../../components/common/DataTable';
import { SLATimer } from '../../components/common/SLATimer';
import { getCrewJobs } from '../../services/crewService';
import { formatDateTime } from '../../utils/helpers';
import { MapPin, Clock, Package, TrendingUp, Truck, CheckCircle, X, AlertCircle, Play, Star, Award, Navigation, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSLAStatusBadge } from '../../utils/auditHelpers';
import { Job } from '../../types';

export const CrewDashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignmentNotification, setShowAssignmentNotification] = useState(false);
  const [newAssignedJob] = useState<Job | null>(null);
  const crewName = 'Mike Davies';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getCrewJobs();
      setJobs(data.jobs || data || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      const { jobStore } = await import('../../store/jobStore');
      const allJobs = jobStore.getJobs();
      setJobs(allJobs);
    } finally {
      setLoading(false);
    }
  };

  const myJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    return jobs.filter(j => {
      // Check if crew is assigned by name or ID
      const isAssignedByName = j.crewAssigned?.some(assignedName => 
        assignedName.includes('Mike Davies') || assignedName.includes('Mike')
      );
      const isAssignedById = j.crewIds?.includes('crew-001');
      
      return isAssignedByName || isAssignedById;
    });
  }, [jobs]);
  const todayJobs = useMemo(() => myJobs.filter(j => j.status !== 'completed'), [myJobs]);

  const handleRowClick = useCallback((job: Job) => navigate(`/crew/job/${job.id}`), [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const columns = [
    { header: 'Job Reference', accessor: 'immutableReferenceId' as const },
    { header: '🏠 Property Location', accessor: 'pickupAddress' as const },
    { header: '🕰️ Scheduled Time', accessor: (row: Job) => formatDateTime(row.scheduledDate) },
    { 
      header: '📊 Job Status', 
      accessor: (row: Job) => {
        const statusMap: Record<string, { text: string; emoji: string; color: string }> = {
          'created': { text: 'New Job - Not Started', emoji: '🆕', color: 'bg-gray-100 text-gray-800' },
          'dispatched': { text: 'Ready to Start', emoji: '🚀', color: 'bg-blue-100 text-blue-800' },
          'in-progress': { text: 'Working On-Site', emoji: '🔄', color: 'bg-orange-100 text-orange-800' },
          'completed': { text: 'Work Done - Awaiting Admin Review', emoji: '✅', color: 'bg-green-100 text-green-800' },
          'verified': { text: 'Verified by Admin', emoji: '✓', color: 'bg-green-100 text-green-800' },
          'invoiced': { text: 'Job Complete & Invoiced', emoji: '🎉', color: 'bg-purple-100 text-purple-800' },
          'admin-rejected': { text: 'Needs Rework - Check Details', emoji: '⚠️', color: 'bg-red-100 text-red-800' }
        };
        const status = statusMap[row.lifecycleState] || statusMap[row.status] || { text: row.status, emoji: '📋', color: 'bg-gray-100 text-gray-800' };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
            {status.emoji} {status.text}
          </span>
        );
      }
    },
    { 
      header: '⏰ Time Remaining', 
      accessor: (row: Job) => {
        const slaStatus = getSLAStatusBadge(row);
        const colors = {
          green: 'bg-green-100 text-green-800',
          orange: 'bg-orange-100 text-orange-800',
          red: 'bg-red-100 text-red-800',
        };
        const emojis = {
          green: '✅',
          orange: '⚠️',
          red: '🚨'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[slaStatus.color as keyof typeof colors]}`}>
            {emojis[slaStatus.color as keyof typeof emojis]} {slaStatus.label}
          </span>
        );
      }
    },
    { header: '🕰️ Countdown Timer', accessor: (row: Job) => <SLATimer deadline={row.slaDeadline} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <Truck size={150} className="text-white" />
          </motion.div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">👋 Welcome back, {crewName.split(' ')[0]}!</h2>
              <p className="text-blue-100 text-lg">Ready to make today productive? You've got {todayJobs.length} jobs waiting</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Phone size={16} />
                Emergency
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Support
              </motion.button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className="text-sm">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-300" />
              <span className="text-sm">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-green-300" />
              <span className="text-sm">Top Performer</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Pending Jobs", 
            value: myJobs.filter(j => j.status === 'crew-assigned' || j.status === 'dispatched').length, 
            icon: Package, 
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
            desc: 'Ready to start',
            action: 'Start Now'
          },
          { 
            label: 'In Progress', 
            value: myJobs.filter(j => j.status === 'in-progress').length, 
            icon: Play, 
            gradient: 'from-orange-500 to-orange-600',
            bgGradient: 'from-orange-50 to-orange-100',
            desc: 'Currently active',
            action: 'Continue'
          },
          { 
            label: 'Completed Today', 
            value: myJobs.filter(j => j.status === 'work-completed').length, 
            icon: CheckCircle, 
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100',
            desc: 'Awaiting verification',
            action: 'View Details'
          },
          { 
            label: 'Total Earnings', 
            value: '£' + (myJobs.filter(j => j.status === 'completed').length * 85).toFixed(0), 
            icon: TrendingUp, 
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100',
            desc: 'This week',
            action: 'View Report'
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <button className="text-xs bg-white/70 px-3 py-1 rounded-full font-medium hover:bg-white/90 transition-all">
                  {stat.action}
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Route Planning Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-32 flex items-center justify-center">
            <div className="text-center text-white">
              <Navigation size={32} className="mx-auto mb-2" />
              <h3 className="text-xl font-bold">Smart Route Planning</h3>
            </div>
          </div>
          <div className="absolute -bottom-4 left-6 right-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Today's Route Optimized</p>
                    <p className="text-sm text-gray-600">{todayJobs.length} stops • Est. 6.5 hours</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View Route
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-600">{todayJobs.length}</div>
              <div className="text-xs text-green-700 font-medium">Jobs Today</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-blue-600">24.5</div>
              <div className="text-xs text-blue-700 font-medium">Miles Total</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-600">5:00</div>
              <div className="text-xs text-purple-700 font-medium">Est. Finish</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>Current User: Mike Davies (ID: crew-001)</div>
              <div>Total Jobs: {jobs.length}</div>
              <div>My Jobs: {myJobs.length}</div>
              <div>Jobs with crew assigned: {jobs.filter(j => j.crewAssigned?.length > 0).length}</div>
              <div>Jobs with crew IDs: {jobs.filter(j => j.crewIds?.length > 0).length}</div>
            </div>
        </motion.div>
      )}
      {/* Enhanced Jobs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="text-blue-600" size={24} />
                My Jobs Today
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {myJobs.length} total jobs • {myJobs.filter(j => j.status === 'in-progress').length} in progress • {myJobs.filter(j => j.status === 'completed').length} completed
              </p>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all">
                Filter
              </button>
              <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-all">
                Sort by Priority
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {myJobs.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No jobs assigned yet</h4>
              <p className="text-gray-500">Check back soon for new assignments or contact dispatch</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                Contact Dispatch
              </button>
            </div>
          ) : (
            <DataTable 
              data={myJobs} 
              columns={columns}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </motion.div>
      </div>
      
      {/* Job Assignment Notification */}
      <AnimatePresence>
        {showAssignmentNotification && newAssignedJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowAssignmentNotification(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">New Job Assigned!</h3>
                <p className="text-gray-600">You have been assigned to a new job</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Job Reference</p>
                    <p className="font-semibold text-gray-900">{newAssignedJob.immutableReferenceId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{newAssignedJob.serviceType.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property Address</p>
                    <p className="font-semibold text-gray-900">{newAssignedJob.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-semibold text-gray-900">{formatDateTime(newAssignedJob.scheduledDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SLA Type</p>
                    <p className="font-semibold text-orange-600">{newAssignedJob.slaType}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAssignmentNotification(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setShowAssignmentNotification(false);
                    navigate(`/crew/job/${newAssignedJob.id}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  View Job
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
