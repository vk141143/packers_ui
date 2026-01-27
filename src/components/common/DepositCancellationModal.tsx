import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, FileText, CheckCircle, DollarSign } from 'lucide-react';
import { useStatusPopup } from './StatusPopupManager';

interface DepositCancellationModalProps {
  booking: {
    id: string;
    referenceNumber: string;
    depositAmount: number;
    serviceType: string;
    scheduledDate: string;
    clientName: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onCancelConfirm: (reason: string) => void;
  isProcessing?: boolean;
}

type CancellationStep = 'terms' | 'reason' | 'confirmation';

export const DepositCancellationModal: React.FC<DepositCancellationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelConfirm,
  isProcessing = false
}) => {
  const [currentStep, setCurrentStep] = useState<CancellationStep>('terms');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { showStatus, StatusPopup } = useStatusPopup();

  const predefinedReasons = [
    'Change of plans',
    'Found alternative service',
    'No longer needed',
    'Schedule conflict',
    'Financial constraints',
    'Service concerns',
    'Other'
  ];

  const cancellationTerms = [
    'I understand that cancelling after deposit payment may result in partial refund',
    'Refund processing will take 5-7 business days',
    'Cancellation fees may apply based on timing',
    'This action cannot be undone',
    'I will receive email confirmation of cancellation'
  ];

  const handleTermsAccept = () => {
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }
    setCurrentStep('reason');
  };

  const handleReasonSubmit = () => {
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason;
    if (!finalReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }
    setCurrentStep('confirmation');
  };

  const handleFinalCancel = () => {
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason;
    showStatus('no-refund-warning');
    onCancelConfirm(finalReason);
  };

  const resetModal = () => {
    setCurrentStep('terms');
    setTermsAccepted(false);
    setSelectedReason('');
    setCustomReason('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
          <button
            onClick={handleClose}
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
              <p className="text-red-100 mt-1">Booking #{booking.referenceNumber}</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {['terms', 'reason', 'confirmation'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step ? 'bg-red-600 text-white' :
                  ['terms', 'reason', 'confirmation'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {['terms', 'reason', 'confirmation'].indexOf(currentStep) > index ? '✓' : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    ['terms', 'reason', 'confirmation'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {/* Step 1: Terms and Conditions */}
            {currentStep === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Booking Summary */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-bold text-blue-900 mb-3">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-blue-700">Service</p>
                      <p className="font-semibold">{booking.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Date</p>
                      <p className="font-semibold">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Client</p>
                      <p className="font-semibold">{booking.clientName}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Deposit Paid</p>
                      <p className="font-semibold text-green-600">£{booking.depositAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-bold text-yellow-800">Cancellation Terms & Conditions</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {cancellationTerms.map((term, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">{term}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Refund Policy: Cancellation fees may apply. Refunds are processed within 5-7 business days.
                    </p>
                  </div>
                </div>

                {/* Acceptance Checkbox */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      I have read and accept the cancellation terms and conditions. I understand that this action may result in cancellation fees and that the process cannot be reversed.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleTermsAccept}
                    disabled={!termsAccepted}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Accept & Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Cancellation Reason */}
            {currentStep === 'reason' && (
              <motion.div
                key="reason"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell us why you're cancelling</h3>
                  <p className="text-gray-600">This helps us improve our service</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select a reason for cancellation *
                  </label>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setSelectedReason(reason)}
                        className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${
                          selectedReason === reason
                            ? 'border-red-500 bg-red-50 text-red-700 font-semibold'
                            : 'border-gray-300 hover:border-red-300 hover:bg-gray-50'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  {selectedReason === 'Other' && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Please specify your reason
                      </label>
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Please provide details about your cancellation reason..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows={4}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep('terms')}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReasonSubmit}
                    disabled={!selectedReason || (selectedReason === 'Other' && !customReason.trim())}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Final Confirmation */}
            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Final Confirmation</h3>
                  <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
                </div>

                {/* Summary */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-bold text-red-900 mb-3">Cancellation Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-700">Booking Reference:</span>
                      <span className="font-semibold">#{booking.referenceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Deposit Amount:</span>
                      <span className="font-semibold">£{booking.depositAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Cancellation Reason:</span>
                      <span className="font-semibold">{selectedReason === 'Other' ? customReason : selectedReason}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-800 mb-2">
                    <AlertTriangle size={20} />
                    <span className="font-semibold">Important Notice</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    This action is irreversible. Once cancelled, you will need to create a new booking if you change your mind. 
                    Refund processing will begin immediately and may take 5-7 business days to complete.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep('reason')}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalCancel}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
                        <CheckCircle size={20} />
                        Confirm Cancellation
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <StatusPopup />
    </div>
  );
};