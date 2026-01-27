import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, CreditCard, FileText, Camera, Clock, MapPin } from 'lucide-react';
import { Job } from '../../types';
import { PaymentModal } from '../common/PaymentModal';
import { useStatusPopup } from './StatusPopupManager';
import { jobStore } from '../../store/jobStore';

interface ClientFinalPaymentPopupProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: any) => void;
}

export const ClientFinalPaymentPopup: React.FC<ClientFinalPaymentPopupProps> = ({
  job,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { showStatus, StatusPopup } = useStatusPopup();

  // Calculate remaining amount - use verified final price or accepted quote amount
  const totalAmount = job.verifiedFinalPrice || job.finalQuote?.fixedPrice || job.estimatedValue || 0;
  const depositPaid = job.finalQuote?.depositAmount || 0;
  const remainingAmount = totalAmount - depositPaid;

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (paymentData: any) => {
    setShowPaymentModal(false);
    
    // Process final payment in job store
    const result = jobStore.processFinalPayment(job.id, paymentData);
    
    if (result.success) {
      showStatus('final-payment');
      onPaymentSuccess(paymentData);
    } else {
      alert(`Payment failed: ${result.error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Completed!</h2>
            <p className="text-gray-600">Your service has been completed and verified</p>
          </div>

          {/* Job Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Reference</p>
                <p className="font-semibold text-gray-900">{job.immutableReferenceId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-semibold text-gray-900 capitalize">{job.serviceType.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Property</p>
                <p className="font-semibold text-gray-900">{job.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="font-semibold text-gray-900">
                  {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Work Details */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg">
                  <Camera className="mx-auto text-blue-600 mb-1" size={20} />
                  <p className="text-sm text-gray-600">Photos</p>
                  <p className="font-semibold">{job.photos?.length || 0}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Clock className="mx-auto text-green-600 mb-1" size={20} />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">
                    {job.completionTimeMinutes ? `${Math.floor(job.completionTimeMinutes / 60)}h ${job.completionTimeMinutes % 60}m` : 'N/A'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <CheckCircle className="mx-auto text-purple-600 mb-1" size={20} />
                  <p className="text-sm text-gray-600">Tasks</p>
                  <p className="font-semibold">
                    {job.checklist?.filter(item => item.completed).length || 0}/{job.checklist?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Payment Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Total Service Cost:</span>
                <span className="text-blue-900 font-semibold">£{totalAmount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Deposit Already Paid:</span>
                <span className="text-blue-900 font-semibold">-£{depositPaid}</span>
              </div>
              
              <div className="border-t border-blue-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-900">Remaining Amount Due:</span>
                  <span className="text-2xl font-bold text-green-600">£{remainingAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photos Preview */}
          {job.photos && job.photos.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Documentation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {job.photos.slice(0, 4).map((photo, idx) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt={`${photo.type} photo`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <span className={`absolute top-1 left-1 px-2 py-1 rounded text-xs font-bold ${
                      photo.type === 'before' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {photo.type}
                    </span>
                  </div>
                ))}
                {job.photos.length > 4 && (
                  <div className="bg-gray-200 rounded-lg flex items-center justify-center h-20">
                    <span className="text-gray-600 text-sm">+{job.photos.length - 4} more</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Payment</h3>
              <p className="text-gray-600">Your job has been completed and verified by our admin team</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                Review Later
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Pay £{remainingAmount} Now
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              💳 Secure payment processing • 🔒 Your data is protected • 📧 Receipt will be emailed
            </p>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={remainingAmount}
        onPaymentSuccess={handlePaymentComplete}
      />
      
      {/* Status Popup */}
      <StatusPopup />
    </>
  );
};