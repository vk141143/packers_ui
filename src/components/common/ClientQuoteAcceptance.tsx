import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, DollarSign, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Job } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { useStatusPopup } from './StatusPopupManager';

interface ClientQuoteAcceptanceProps {
  job: Job;
  onAccept: () => void;
  onReject: (reason: string) => void;
}

export const ClientQuoteAcceptance: React.FC<ClientQuoteAcceptanceProps> = ({ job, onAccept, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const { showStatus, StatusPopup } = useStatusPopup();

  const handleAccept = () => {
    showStatus('quote-accepted');
    onAccept();
  };

  const handleReject = (reason: string) => {
    showStatus('booking-cancelled');
    onReject(reason);
  };

  const finalQuote = job.quoteDetails || job.finalQuote;
  const depositAmount = finalQuote?.depositAmount || job.deposit_amount || 0;
  const totalAmount = finalQuote?.quotedAmount || finalQuote?.fixedPrice || job.quote_amount || 0;
  const remainingBalance = totalAmount - depositAmount;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Quote Ready for Your Approval</h2>
          <p className="text-blue-100">Job ID: {job.id}</p>
        </div>

        {/* Job Details */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">Service Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Service Type</p>
              <p className="font-medium">{job.serviceType.replace('-', ' ').toUpperCase()}</p>
            </div>
            <div>
              <p className="text-gray-600">Property Address</p>
              <p className="font-medium">{job.propertyAddress}</p>
            </div>
            <div>
              <p className="text-gray-600">Scheduled Date</p>
              <p className="font-medium">{new Date(job.scheduledDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Completion Timeline</p>
              <p className="font-medium">{finalQuote?.completionTimeline}</p>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Breakdown
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">Total Fixed Price</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              
              {depositAmount > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Deposit Required</span>
                    <span className="font-medium">{formatCurrency(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining Balance (after completion)</span>
                    <span className="font-medium">{formatCurrency(remainingBalance)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Scope of Work
          </h3>
          
          <ul className="space-y-2">
            {finalQuote?.scopeOfWork?.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Terms & Conditions */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Cancellation Policy</p>
                <p className="text-yellow-700">{finalQuote?.cancellationTerms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!showRejectForm ? (
          <div className="p-6 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAccept}
              className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Accept Quote & Proceed
              {depositAmount > 0 && (
                <span className="text-sm opacity-90">
                  (Deposit: {formatCurrency(depositAmount)})
                </span>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRejectForm(true)}
              className="px-6 py-4 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Decline Quote
            </motion.button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <h4 className="font-semibold text-gray-900">Reason for Declining</h4>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Please let us know why you're declining this quote..."
            />
            <div className="flex gap-4">
              <button
                onClick={() => handleReject(rejectionReason)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Submit Decline
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <StatusPopup />
    </div>
  );
};