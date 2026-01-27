import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Job } from '../../types';
import { CreditCard, CheckCircle, Clock, FileText, Camera, MapPin, DollarSign } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

interface ClientPaymentNotificationProps {
  job: Job;
  onPaymentComplete: (paymentData: any) => void;
}

export const ClientPaymentNotification: React.FC<ClientPaymentNotificationProps> = ({
  job,
  onPaymentComplete
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setShowPaymentModal(false);
    onPaymentComplete(paymentData);
  };

  const totalAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
  const depositPaid = job.finalQuote?.depositAmount || 0;
  const remainingAmount = totalAmount - depositPaid;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-500"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Work Completed! 🎉</h2>
          <p className="text-gray-600">Your service has been completed and verified by our admin team</p>
        </div>

        {/* Job Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job Summary
          </h3>
          
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
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.pickupAddress}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-semibold text-gray-900">
                {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>

          {/* Work Evidence */}
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

        {/* Payment Breakdown */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Final Payment Due
          </h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Service Amount:</span>
              <span className="font-semibold text-gray-900">£{totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Deposit Already Paid:</span>
              <span className="font-semibold text-green-600">-£{depositPaid.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-900">Amount Due Now:</span>
                <span className="text-3xl font-bold text-blue-600">£{remainingAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <CheckCircle size={16} />
              <span className="font-semibold">Work Verified by Admin</span>
            </div>
            <p className="text-sm text-blue-700">
              Our admin team has reviewed and approved the completed work. You can now make the final payment to complete your booking.
            </p>
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

        {/* Payment Action */}
        <div className="text-center">
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 mx-auto shadow-lg hover:shadow-xl"
          >
            <CreditCard size={24} />
            Pay £{remainingAmount.toFixed(2)} Now
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              💳 Secure payment processing • 🔒 Your data is protected • 📧 Receipt will be emailed
            </p>
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={remainingAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};