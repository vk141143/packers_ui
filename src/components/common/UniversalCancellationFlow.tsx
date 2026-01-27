import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle, Shield, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Job } from '../../types';
import { useCancellationFlow } from '../../hooks/useCancellationFlow';
import { jobStore } from '../../store/jobStore';

interface UniversalCancellationFlowProps {
  job: Job;
  userRole: 'client' | 'admin' | 'crew' | 'sales' | 'management';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: { refundAmount: number; reason: string }) => void;
}

const CANCELLATION_RULES = {
  'client-booking-request': { 
    allowed: true, 
    refundPercent: 100, 
    reason: 'Full refund - No work started' 
  },
  'admin-quoted': { 
    allowed: true, 
    refundPercent: 100, 
    reason: 'Full refund - Quote not accepted' 
  },
  'client-approved': { 
    allowed: true, 
    refundPercent: 100, 
    reason: 'Full refund - Payment not made' 
  },
  'payment-pending': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Cannot cancel during payment processing' 
  },
  'booking-confirmed': { 
    allowed: true, 
    refundPercent: 85, 
    reason: '15% admin fee applies' 
  },
  'crew-assigned': { 
    allowed: true, 
    refundPercent: 75, 
    reason: '25% cancellation fee - Crew notified' 
  },
  'crew-dispatched': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Cannot cancel - Crew en route' 
  },
  'in-progress': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Cannot cancel - Work in progress' 
  },
  'work-completed': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Cannot cancel - Work completed' 
  },
  'completed': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Cannot cancel - Job completed' 
  },
  'cancelled': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Already cancelled' 
  }
};

export const UniversalCancellationFlow: React.FC<UniversalCancellationFlowProps> = ({
  job,
  userRole,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'confirm' | 'reason' | 'processing' | 'success'>('confirm');
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  
  const rule = CANCELLATION_RULES[job.status as keyof typeof CANCELLATION_RULES] || 
               { allowed: false, refundPercent: 0, reason: 'Status not recognized' };
  
  const depositAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
  const refundAmount = Math.round(depositAmount * (rule.refundPercent / 100));
  const cancellationFee = depositAmount - refundAmount;

  const { processCancellation, isProcessing } = useCancellationFlow({
    bookingId: job.id,
    depositAmount,
    onSuccess: (data) => {
      setStep('success');
      setTimeout(() => {
        onSuccess({ refundAmount: data.refundAmount, reason: data.reason });
      }, 2000);
    },
    onError: (error) => {
      alert(`Cancellation failed: ${error}`);
      setStep('confirm');
    }
  });

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }
    
    setStep('processing');
    
    // Update job status immediately
    const updatedJob = {
      ...job,
      status: 'cancelled' as const,
      cancelledAt: new Date().toISOString(),
      cancelledBy: userRole,
      cancellationReason: reason,
      refundAmount,
      cancellationFee
    };
    
    jobStore.updateJob(updatedJob);
    
    // Process the cancellation
    await processCancellation(reason);
  };

  const canUserCancel = () => {
    if (!rule.allowed) return false;
    
    // Role-based permissions
    switch (userRole) {
      case 'client':
        return ['client-booking-request', 'admin-quoted', 'client-approved', 'booking-confirmed', 'crew-assigned'].includes(job.status);
      case 'admin':
        return true; // Admin can cancel most jobs
      case 'crew':
        return false; // Crew cannot cancel, only admin
      case 'sales':
        return ['client-booking-request', 'admin-quoted'].includes(job.status);
      case 'management':
        return true; // Management can cancel most jobs
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  if (!canUserCancel()) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cannot Cancel</h3>
            <p className="text-gray-600 mb-4">{rule.reason}</p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                <strong>Job ID:</strong> {job.id}<br />
                <strong>Status:</strong> {job.status.replace('-', ' ').toUpperCase()}<br />
                <strong>Your Role:</strong> {userRole.toUpperCase()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Booking</h3>
                <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
              </div>

              {/* Job Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job ID:</span>
                    <span className="font-semibold">{job.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold capitalize">{job.serviceType?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold">{job.status.replace('-', ' ').toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Refund Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-blue-900">Refund Information</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Original Amount:</span>
                    <span className="font-bold">£{depositAmount}</span>
                  </div>
                  {cancellationFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Cancellation Fee:</span>
                      <span className="font-bold text-red-600">-£{cancellationFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-700 font-semibold">Refund Amount:</span>
                    <span className="font-bold text-green-600">£{refundAmount}</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">{rule.reason}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => setStep('reason')}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
                >
                  Continue Cancel
                </button>
              </div>
            </motion.div>
          )}

          {step === 'reason' && (
            <motion.div
              key="reason"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancellation Reason</h3>
                <p className="text-gray-600">Please tell us why you're cancelling</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="Please provide a detailed reason for cancellation..."
                />
              </div>

              {userRole === 'admin' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type "CANCEL BOOKING" to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="CANCEL BOOKING"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!reason.trim() || (userRole === 'admin' && confirmText !== 'CANCEL BOOKING')}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Cancellation</h3>
              <p className="text-gray-600">Please wait while we process your cancellation...</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Cancelled</h3>
              <p className="text-gray-600 mb-4">Your booking has been successfully cancelled</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800">
                  Refund of <strong>£{refundAmount}</strong> will be processed within 5-7 business days
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};