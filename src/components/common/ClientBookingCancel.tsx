import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, DollarSign, Clock, FileText } from 'lucide-react';
import { Job } from '../../types';
import { jobStore } from '../../store/jobStore';
import { DepositCancellationModal } from './DepositCancellationModal';
import { useCancellationFlow } from '../../hooks/useCancellationFlow';

interface ClientBookingCancelProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onCancelSuccess: () => void;
}

export const ClientBookingCancel: React.FC<ClientBookingCancelProps> = ({
  job,
  isOpen,
  onClose,
  onCancelSuccess
}) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if deposit has been paid
  const depositAmount = job.finalQuote?.depositAmount || job.initialPayment?.amount || 0;
  const hasDepositPaid = depositAmount > 0;
  
  // Use the new cancellation flow for deposit bookings
  const {
    isProcessing: isCancellationProcessing,
    processCancellation
  } = useCancellationFlow({
    bookingId: job.id,
    depositAmount,
    onSuccess: (data) => {
      alert(`✅ Booking Cancelled Successfully!\n\n💰 Refund Amount: £${data.refundAmount?.toFixed(2)}\n📧 Refund will be processed within 5-7 business days\n📋 Cancellation Reference: ${job.immutableReferenceId}\n\nYou will receive a confirmation email shortly.`);
      onCancelSuccess();
      onClose();
    },
    onError: (error) => {
      alert(`❌ Error: ${error}`);
    }
  });

  const predefinedReasons = [
    'Changed my mind',
    'Found alternative service',
    'No longer needed',
    'Schedule conflict',
    'Price concerns',
    'Other'
  ];

  const getRefundPolicy = () => {
    const now = new Date();
    const scheduledDate = new Date(job.scheduledDate);
    const hoursUntilJob = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    const depositPaid = job.finalQuote?.depositAmount || job.initialPayment?.amount || 0;

    // Refund policy based on cancellation timing
    if (job.status === 'client-booking-request' || job.status === 'admin-quoted') {
      return {
        refundPercentage: 100,
        refundAmount: 0,
        message: 'No payment made yet. Free cancellation.',
        canCancel: true
      };
    }

    if (job.status === 'in-progress' || job.status === 'work-completed') {
      return {
        refundPercentage: 0,
        refundAmount: 0,
        message: 'Work has started or completed. No refund available.',
        canCancel: false
      };
    }

    if (hoursUntilJob > 48) {
      return {
        refundPercentage: 100,
        refundAmount: depositPaid,
        message: 'Full refund available (more than 48 hours before scheduled date)',
        canCancel: true
      };
    } else if (hoursUntilJob > 24) {
      return {
        refundPercentage: 50,
        refundAmount: depositPaid * 0.5,
        message: '50% refund (24-48 hours before scheduled date)',
        canCancel: true
      };
    } else {
      return {
        refundPercentage: 0,
        refundAmount: 0,
        message: 'No refund (less than 24 hours before scheduled date)',
        canCancel: true
      };
    }
  };

  const refundPolicy = getRefundPolicy();

  const handleCancel = async () => {
    if (!selectedReason && !cancellationReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    if (!refundPolicy.canCancel) {
      alert('This booking cannot be cancelled at this stage');
      return;
    }

    setIsProcessing(true);

    try {
      const reason = selectedReason === 'Other' ? cancellationReason : selectedReason;
      
      const result = jobStore.cancelJob(job.id, reason, 'Client');

      if (result.success) {
        // Process refund if applicable
        if (refundPolicy.refundAmount > 0) {
          jobStore.updateJob(job.id, {
            refundStatus: 'pending',
            refundAmount: refundPolicy.refundAmount
          });
        }

        alert(`✅ Booking Cancelled Successfully!\n\n${refundPolicy.refundAmount > 0 ? `💰 Refund Amount: £${refundPolicy.refundAmount.toFixed(2)}\n📧 Refund will be processed within 5-7 business days\n` : ''}📋 Cancellation Reference: ${job.immutableReferenceId}\n\nYou will receive a confirmation email shortly.`);
        
        onCancelSuccess();
        onClose();
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      alert('Error cancelling booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If deposit is paid, use the new enhanced modal
  if (hasDepositPaid && isOpen) {
    return (
      <DepositCancellationModal
        booking={{
          id: job.id,
          referenceNumber: job.immutableReferenceId,
          depositAmount,
          serviceType: job.serviceType,
          scheduledDate: job.scheduledDate,
          clientName: job.clientName || 'Client'
        }}
        isOpen={true}
        onClose={onClose}
        onCancelConfirm={(reason) => processCancellation(reason)}
        isProcessing={isCancellationProcessing}
      />
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Cancel Booking</h2>
              <p className="text-red-100 mt-1">Review cancellation policy before proceeding</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Details */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Reference</p>
                <p className="font-semibold">{job.immutableReferenceId}</p>
              </div>
              <div>
                <p className="text-gray-600">Service</p>
                <p className="font-semibold capitalize">{job.serviceType.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-600">Scheduled Date</p>
                <p className="font-semibold">{new Date(job.scheduledDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold capitalize">{job.status.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className={`rounded-xl p-4 border-2 ${
            refundPolicy.refundPercentage === 100 ? 'bg-green-50 border-green-200' :
            refundPolicy.refundPercentage === 50 ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className={`w-5 h-5 ${
                refundPolicy.refundPercentage === 100 ? 'text-green-600' :
                refundPolicy.refundPercentage === 50 ? 'text-yellow-600' :
                'text-red-600'
              }`} />
              <h3 className={`font-bold ${
                refundPolicy.refundPercentage === 100 ? 'text-green-800' :
                refundPolicy.refundPercentage === 50 ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                Refund Policy
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Deposit Paid:</span>
                <span className="font-semibold">£{(job.finalQuote?.depositAmount || job.initialPayment?.amount || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Refund Percentage:</span>
                <span className="font-bold text-lg">{refundPolicy.refundPercentage}%</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Refund Amount:</span>
                <span className={`text-2xl font-bold ${
                  refundPolicy.refundAmount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  £{refundPolicy.refundAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={`mt-3 p-3 rounded-lg ${
              refundPolicy.refundPercentage === 100 ? 'bg-green-100' :
              refundPolicy.refundPercentage === 50 ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <p className={`text-sm font-medium ${
                refundPolicy.refundPercentage === 100 ? 'text-green-800' :
                refundPolicy.refundPercentage === 50 ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {refundPolicy.message}
              </p>
            </div>
          </div>

          {/* Cancellation Terms */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-800">Cancellation Terms</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Cancellations more than 48 hours before: 100% refund</li>
              <li>• Cancellations 24-48 hours before: 50% refund</li>
              <li>• Cancellations less than 24 hours before: No refund</li>
              <li>• Refunds processed within 5-7 business days</li>
              <li>• Work in progress cannot be cancelled</li>
            </ul>
          </div>

          {/* Cancellation Reason */}
          {refundPolicy.canCancel && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Cancellation *
              </label>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                {predefinedReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedReason === reason
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {selectedReason === 'Other' && (
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide details..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              )}
            </div>
          )}

          {/* Warning */}
          {refundPolicy.canCancel && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertTriangle size={20} />
                <span className="font-semibold">Warning</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                This action cannot be undone. Once cancelled, you will need to create a new booking if you change your mind.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {refundPolicy.canCancel ? (
              <>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isProcessing || (!selectedReason && !cancellationReason.trim())}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <X size={20} />
                      Cancel Booking
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};