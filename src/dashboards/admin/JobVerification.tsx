import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getJobsPendingVerification, approveJobVerification, rejectJobVerification } from '../../services/authService';
import { Job } from '../../types';
import { CheckCircle, XCircle, Camera, Package, MapPin, Clock, User, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

export const JobVerification: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsData = await getJobsPendingVerification();
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (job: Job) => {
    setSelectedJob(job);
    setShowVerificationModal(true);
  };

  const handleVerificationApprove = () => {
    setShowVerificationModal(false);
    setShowPriceModal(true);
    // Use finalQuote fixedPrice if available, otherwise estimatedValue
    const quotedAmount = selectedJob?.finalQuote?.fixedPrice || selectedJob?.estimatedValue || 0;
    setFinalPrice(quotedAmount.toString());
  };

  const handleSetFinalPrice = () => {
    if (!selectedJob) return;
    
    const freshJob = jobStore.getJobById(selectedJob.id);
    if (!freshJob) {
      alert('❌ Error: Job not found');
      return;
    }
    
    if (!finalPrice || parseFloat(finalPrice) <= 0) {
      alert('❌ Please enter a valid final price');
      return;
    }
    
    // Calculate payment breakdown
    const totalAmount = parseFloat(finalPrice);
    const depositPaid = freshJob.finalQuote?.depositAmount || 0;
    const remainingAmount = totalAmount - depositPaid;
    
    if (remainingAmount < 0) {
      alert('❌ Error: Final price cannot be less than deposit paid.');
      return;
    }
    
    // Use the verifyJob method
    const verifyResult = jobStore.verifyJob(freshJob.id, totalAmount, 'Admin');
    
    if (verifyResult.success) {
      alert(`✅ Work Verified & Payment Notification Sent!

📋 Job Status Updated:
• Work completed and verified by admin
• Final amount set to £${totalAmount}
• Remaining payment due: £${remainingAmount}

📧 Client Notification:
• Payment request sent to ${freshJob.clientName}
• Client will receive email with payment link
• Job will complete once payment is received

💰 Payment Breakdown:
• Total Amount: £${totalAmount}
• Deposit Paid: £${depositPaid}
• Amount Due: £${remainingAmount}`);
      setSelectedJob(null);
      setFinalPrice('');
      setShowPriceModal(false);
    } else {
      alert(`❌ Error: ${verifyResult.error}`);
    }
  };

  const handleReject = (job: Job) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    const updatedJob = {
      ...job,
      status: 'admin-rejected' as const,
      rejectionReason,
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Admin',
      statusHistory: [
        ...(job.statusHistory || []),
        {
          status: 'admin-rejected',
          timestamp: new Date().toISOString(),
          updatedBy: 'Admin',
          notes: `Work rejected: ${rejectionReason}`
        }
      ]
    };
    
    jobStore.updateJob(updatedJob);
    alert('Job rejected. Crew has been notified to redo the work.');
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 p-8 mb-8 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-2">Job Verification & Invoice Generation 📋</h2>
          <p className="text-purple-100 text-lg">Review completed jobs and generate invoices</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">{jobs.length}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <Clock size={32} className="text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {formatCurrency(jobs.reduce((sum, j) => sum + (j.estimatedValue || 0), 0))}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <DollarSign size={32} className="text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Job Value</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {jobs.length > 0 ? formatCurrency(jobs.reduce((sum, j) => sum + (j.estimatedValue || 0), 0) / jobs.length) : '£0'}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <FileText size={32} className="text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up! 🎉</h3>
            <p className="text-gray-600">No jobs pending verification at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handleVerifyClick(job)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                    {job.id}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    ✅ Ready to Verify
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-3">{job.clientName}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="truncate">{job.propertyAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-green-600" />
                    <span>{formatDate(job.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} className="text-orange-600" />
                    <span>{job.crewAssigned?.join(', ') || 'No crew'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-600">Quoted Amount</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(job.finalQuote?.fixedPrice || job.estimatedValue || 0)}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                  <Camera size={14} />
                  <span>{job.photos?.length || 0} photos uploaded</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Review Modal */}
      {showVerificationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Review Job Details</h3>
                  <p className="text-blue-100 mt-1">{selectedJob.immutableReferenceId} - {selectedJob.clientName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    setSelectedJob(null);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Details Section */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Client Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 mb-1">Client Name</p>
                    <p className="font-semibold text-gray-900">{selectedJob.clientName}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 mb-1">Service Type</p>
                    <p className="font-semibold text-gray-900">{selectedJob.serviceType}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 mb-1">Property Address</p>
                    <p className="font-semibold text-gray-900">{selectedJob.pickupAddress}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 mb-1">Scheduled Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedJob.scheduledDate)}</p>
                  </div>
                </div>
              </div>

              {/* Crew Details Section */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={20} className="text-orange-600" />
                  Crew Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-xs text-orange-600 mb-1">Assigned Crew</p>
                    <p className="font-semibold text-gray-900">{selectedJob.crewAssigned?.join(', ') || 'No crew assigned'}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-xs text-orange-600 mb-1">Completed Date</p>
                    <p className="font-semibold text-gray-900">
                      {selectedJob.completedAt ? formatDate(selectedJob.completedAt) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-xs text-orange-600 mb-1">Work Duration</p>
                    <p className="font-semibold text-gray-900">
                      {selectedJob.completionTimeMinutes ? `${Math.floor(selectedJob.completionTimeMinutes / 60)}h ${selectedJob.completionTimeMinutes % 60}m` : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-xs text-orange-600 mb-1">SLA Status</p>
                    <p className="font-semibold text-gray-900">{selectedJob.slaBreached ? '❌ Breached' : '✅ Met'}</p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              {selectedJob.checklist && selectedJob.checklist.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={20} className="text-purple-600" />
                    Checklist Completion
                  </h4>
                  <div className="space-y-2">
                    {selectedJob.checklist.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          item.completed ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <XCircle size={20} className="text-red-600" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Camera size={20} className="text-purple-600" />
                  Before & After Photos ({selectedJob.photos?.length || 0})
                </h4>
                {selectedJob.photos && selectedJob.photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {selectedJob.photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={photo.type}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            photo.type === 'before' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                          }`}>
                            {photo.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-800">Missing Photos</p>
                      <p className="text-sm text-red-700">No photos uploaded. Consider rejecting this job.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerificationApprove}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={24} />
                  Verify & Continue
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowVerificationModal(false);
                    setShowRejectModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={24} />
                  Reject Job
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Set Final Price Modal */}
      {showPriceModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Set Final Price</h3>
              <p className="text-gray-600">Enter the final amount to charge the client</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Payment Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Quoted Amount:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(selectedJob.finalQuote?.fixedPrice || selectedJob.estimatedValue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Deposit Paid:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(selectedJob.finalQuote?.depositAmount || 0)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex justify-between">
                  <span className="text-blue-700 font-semibold">Remaining Amount:</span>
                  <span className="font-bold text-blue-900">
                    {formatCurrency((parseFloat(finalPrice) || 0) - (selectedJob.finalQuote?.depositAmount || 0))}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Final Price *</label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the total amount. Client will pay the remaining balance after deposit.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPriceModal(false);
                  setFinalPrice('');
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSetFinalPrice}
                disabled={!finalPrice || parseFloat(finalPrice) <= 0}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={20} />
                Send Payment Request
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Reject Job</h3>
              <p className="text-gray-600">Provide a reason for rejection. Crew will redo the work.</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                placeholder="e.g., Photos are unclear, property not properly cleaned, missing items..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedJob)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Reject Job
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
