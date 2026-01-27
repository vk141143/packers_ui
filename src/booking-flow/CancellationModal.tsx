import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { BookingRequest } from './types';
import { useStatusPopup } from '../components/common/StatusPopupManager';

interface CancellationModalProps {
  booking: BookingRequest;
  onCancel: (reason: string) => void;
  onClose: () => void;
  isProcessing: boolean;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  booking,
  onCancel,
  onClose,
  isProcessing
}) => {
  const [reason, setReason] = useState('');
  const { showStatus, StatusPopup } = useStatusPopup();

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }
    showStatus('booking-cancelled');
    onCancel(reason);
  };

  const canCancel = !booking.depositPaid && 
                   booking.status !== 'completed' && 
                   booking.status !== 'cancelled' &&
                   booking.status !== 'refunded';

  if (!canCancel) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cannot Cancel</h3>
            <p className="text-gray-600 mb-4">
              {booking.depositPaid 
                ? 'This booking cannot be cancelled as deposit has been paid.'
                : 'This booking cannot be cancelled at this stage.'
              }
            </p>
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
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Booking</h3>
          <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
          <p className="text-xs text-gray-500 mt-2">Booking ID: {booking.id}</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900 font-semibold mb-2">Refund Information</p>
          <p className="text-sm text-blue-700">
            Full refund of <span className="font-bold">£{booking.estimatedPrice}</span> will be processed within 5-7 business days
          </p>
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
            placeholder="Please tell us why you're cancelling..."
            disabled={isProcessing}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !reason.trim()}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" 
                />
                Processing...
              </>
            ) : (
              <>
                <XCircle size={20} />
                Confirm Cancel
              </>
            )}
          </button>
        </div>
      </motion.div>
      <StatusPopup />
    </div>
  );
};