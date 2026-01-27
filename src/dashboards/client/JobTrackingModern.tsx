import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { getJobTrackingById } from '../../services/api';
import { ClientFinalPaymentPopup } from '../../components/common/ClientFinalPaymentPopup';
import { ClientInvoiceDisplay } from '../../components/common/ClientInvoiceDisplay';
import { ClientBookingCancel } from '../../components/common/ClientBookingCancel';
import { ArrowLeft, XCircle, AlertTriangle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/common/Button';
import { Job } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { crewMembers } from '../../data/mockData';

export const JobTrackingModern: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: jobs = [], isLoading } = useJobs();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobDetails, setJobDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelJob, setSelectedCancelJob] = useState<any | null>(null);

  // Get crew details
  const assignedCrew = selectedJob?.crewIds?.map(crewId => 
    crewMembers.find(crew => crew.id === crewId)
  ).filter(Boolean) || [];

  useEffect(() => {
    if (jobId && jobId !== 'undefined') {
      // First try to find job in the list
      if (jobs.length > 0) {
        const foundJob = jobs.find(j => j.job_id === jobId || j.id === jobId);
        setSelectedJob(foundJob || null);
      }
      
      // Always fetch detailed job tracking info
      setLoadingDetails(true);
      getJobTrackingById(jobId)
        .then(response => {
          if (response.success) {
            setJobDetails(response.data);
            // If no job found in list, use the API response as selectedJob
            if (!selectedJob) {
              setSelectedJob(response.data);
            }
          }
        })
        .finally(() => setLoadingDetails(false));
    }
  }, [jobId, jobs]);

  const handleCancelJob = (job: Job) => {
    setSelectedCancelJob(job);
    setShowCancelModal(true);
  };

  const handleCancelSuccess = () => {
    setShowCancelModal(false);
    setSelectedCancelJob(null);
    navigate('/client/tracking');
  };

  const canCancelJob = (job: Job) => {
    return ['client-booking-request', 'admin-quoted', 'client-approved', 'payment-pending', 'booking-confirmed', 'crew-assigned'].includes(job.status) && job.status !== 'cancelled';
  };

  const handlePaymentSuccess = (paymentData: any) => {
    if (!selectedJob) return;
    
    const result = jobStore.processFinalPayment(selectedJob.id, paymentData);
    if (result.success) {
      setShowPaymentPopup(false);
      setShowInvoice(true);
      alert('Payment successful! Job completed.');
    } else {
      alert(`Payment failed: ${result.error}`);
    }
  };

  // If no specific job ID, show job list
  if (!jobId) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-8 mb-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => navigate('/client')} 
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
              📍 Job Tracking & History
            </h1>
            <p className="text-lg text-gray-600">Track your jobs in real-time and view past bookings</p>
          </motion.div>
          
          {/* Job List */}
          <div className="grid gap-6">
            {jobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/50"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={40} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Yet</h3>
                <p className="text-gray-600 mb-6">Start by requesting a booking from your dashboard</p>
                <button
                  onClick={() => navigate('/client')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            ) : (
              jobs.map((job, index) => (
                <motion.div
                  key={job.job_id || job.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{job.job_id || job.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' :
                            job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            job.status === 'booking-confirmed' ? 'bg-blue-100 text-blue-800' :
                            job.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                            job.status === 'final-payment-pending' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status === 'completed' && '✓ '}
                            {job.status === 'in-progress' && '⏳ '}
                            {job.status === 'final-payment-pending' && '💳 '}
                            {job.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium mb-1">📍 {job.property_address || job.propertyAddress}</p>
                        <p className="text-sm text-gray-600 capitalize">📦 {job.service_type || job.serviceType?.replace('-', ' ')}</p>
                      </div>
                    </div>
                    
                    {/* Job Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-white/50 rounded-2xl">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm font-semibold text-gray-900">{job.created_at || new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      {(job.total_amount || job.finalQuote) && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                          <p className="text-sm font-bold text-blue-600">{formatCurrency(job.total_amount || job.finalQuote?.fixedPrice || 0)}</p>
                        </div>
                      )}
                      {job.assignedCrew && job.assignedCrew.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Crew Assigned</p>
                          <p className="text-sm font-semibold text-gray-900">{job.assignedCrew.length} members</p>
                        </div>
                      )}
                      {job.scheduledDate && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Scheduled</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(job.scheduledDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {canCancelJob(job) && (
                        <button
                          onClick={() => handleCancelJob(job)}
                          className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 font-semibold text-sm"
                        >
                          <XCircle size={16} />
                          Cancel Job
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/client/tracking/${job.job_id || job.id}`)}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                      >
                        👁️ View Details & Track
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        
        {/* Cancel Job Modal */}
        <AnimatePresence>
          {showCancelModal && selectedCancelJob && (
            <ClientBookingCancel
              job={selectedCancelJob}
              isOpen={showCancelModal}
              onClose={() => {
                setShowCancelModal(false);
                setSelectedCancelJob(null);
              }}
              onCancelSuccess={handleCancelSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!selectedJob && !jobDetails) {
    if (loadingDetails) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      );
    }
    return <div className="text-center py-20 text-gray-600">Job not found 😕</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Single Card with Everything */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white rounded-t-xl">
            <button 
              onClick={() => navigate('/client/tracking')} 
              className="flex items-center gap-2 text-white/80 hover:text-white mb-3"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-xl font-bold mb-1">{jobDetails?.job_id || selectedJob?.job_id || selectedJob?.id}</h1>
            <p className="text-sm text-blue-100">{jobDetails?.property_address || selectedJob?.property_address || selectedJob?.propertyAddress}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Job Details Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                Job Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedJob.propertySize && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold">PROPERTY SIZE</p>
                    <p className="font-bold text-gray-900">{selectedJob.propertySize.replace('-', ' ')}</p>
                  </div>
                )}
                {selectedJob.vanLoads && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold">VAN LOADS</p>
                    <p className="font-bold text-gray-900">{selectedJob.vanLoads}</p>
                  </div>
                )}
                {selectedJob.urgency && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold">PRIORITY</p>
                    <p className="font-bold text-gray-900 capitalize">{selectedJob.urgency}</p>
                  </div>
                )}
                {selectedJob.wasteTypes && selectedJob.wasteTypes.length > 0 && (
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">WASTE TYPES</p>
                    <p className="font-bold text-gray-900">{selectedJob.wasteTypes.join(', ')}</p>
                  </div>
                )}
                {selectedJob.accessDifficulty && selectedJob.accessDifficulty.length > 0 && (
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">ACCESS NOTES</p>
                    <p className="font-bold text-gray-900">{selectedJob.accessDifficulty.join(', ')}</p>
                  </div>
                )}
                {selectedJob.description && (
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">ADDITIONAL INFORMATION</p>
                    <p className="font-bold text-gray-900">{selectedJob.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">STATUS</p>
              <div className={`px-4 py-2 rounded-lg inline-block font-bold ${
                (jobDetails?.status || selectedJob?.status) === 'completed' ? 'bg-green-100 text-green-700' :
                (jobDetails?.status || selectedJob?.status) === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                (jobDetails?.status || selectedJob?.status) === 'crew-dispatched' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {(jobDetails?.status || selectedJob?.status || 'Unknown').replace('-', ' ').toUpperCase()}
              </div>
            </div>

            {/* Crew */}
            {selectedJob.crewAssigned && selectedJob.crewAssigned.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-semibold">ASSIGNED CREW</p>
                <p className="font-bold text-gray-900">{selectedJob.crewAssigned.join(', ')}</p>
              </div>
            )}

            {/* Distance & ETA */}
            {(selectedJob.status === 'crew-dispatched' || selectedJob.status === 'crew-arrived') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-semibold">DISTANCE</p>
                  <p className="font-bold text-gray-900">5.2 km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-semibold">ETA</p>
                  <p className="font-bold text-gray-900">15:30</p>
                </div>
              </div>
            )}

            {/* Progress */}
            <div>
              <p className="text-xs text-gray-500 mb-3 font-semibold">PROGRESS</p>
              <div className="space-y-2">
                {jobDetails?.progress?.map((step: any) => (
                  <div key={step.step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? '✓' : step.step}
                    </div>
                    <span className={`text-sm ${
                      step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Required */}
            {selectedJob.status === 'final-payment-pending' && selectedJob.finalPayment && !selectedJob.finalPayment.paidAt && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2 font-semibold">PAYMENT REQUIRED</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">Final Amount:</span>
                  <span className="text-xl font-bold text-orange-600">{formatCurrency(selectedJob.finalPayment.amount)}</span>
                </div>
                <button 
                  onClick={() => setShowPaymentPopup(true)} 
                  className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700"
                >
                  Pay Now
                </button>
              </div>
            )}

            {/* Completed */}
            {selectedJob.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2 font-semibold">JOB COMPLETED</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Paid:</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(selectedJob.finalQuote?.fixedPrice || 0)}</span>
                </div>
              </div>
            )}

            {/* Crew Details */}
            {jobDetails?.crew_details && (
              <div>
                <p className="text-xs text-gray-500 mb-3 font-semibold">CREW DETAILS</p>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">👷</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{jobDetails.crew_details.name || 'Crew Member'}</p>
                        <p className="text-sm text-gray-600">{jobDetails.crew_details.role || 'Team Lead'}</p>
                      </div>
                    </div>
                    {jobDetails.crew_details.phone && (
                      <div className="text-sm text-gray-600">
                        📞 {jobDetails.crew_details.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <ClientFinalPaymentPopup
          job={selectedJob}
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {showInvoice && selectedJob.invoiceId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInvoice(false)}>
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <ClientInvoiceDisplay job={selectedJob} invoiceId={selectedJob.invoiceId} />
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => setShowInvoice(false)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};