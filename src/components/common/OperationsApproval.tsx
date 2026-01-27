import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, DollarSign, Calendar, FileText } from 'lucide-react';
import { Job } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface OperationsApprovalProps {
  job: Job;
  onApprove: (reviewData: any) => void;
  onReject: (reason: string) => void;
}

export const OperationsApproval: React.FC<OperationsApprovalProps> = ({ job, onApprove, onReject }) => {
  const [finalPrice, setFinalPrice] = useState(job.estimatedValue);
  const [depositAmount, setDepositAmount] = useState(Math.round(job.estimatedValue * 0.3));
  const [notes, setNotes] = useState('');
  const [riskBuffer, setRiskBuffer] = useState(0);
  const [requiresSiteVisit, setRequiresSiteVisit] = useState(false);
  const [scopeOfWork, setScopeOfWork] = useState(['Property clearance', 'Waste disposal', 'Basic cleaning']);
  const [completionTimeline, setCompletionTimeline] = useState('2-3 working days');

  const handleApprove = () => {
    const reviewData = {
      reviewedBy: 'Operations Team',
      reviewedAt: new Date().toISOString(),
      finalPrice,
      depositAmount,
      approved: true,
      notes,
      riskBuffer,
      requiresSiteVisit,
      finalQuote: {
        fixedPrice: finalPrice,
        depositAmount,
        scopeOfWork,
        completionTimeline,
        cancellationTerms: 'Free cancellation 24h before scheduled date'
      }
    };
    onApprove(reviewData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Operations Review Required</h2>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            Mandatory Approval
          </span>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Job Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">ID:</span> {job.id}</p>
              <p><span className="font-medium">Client:</span> {job.clientName}</p>
              <p><span className="font-medium">Service:</span> {job.serviceType}</p>
              <p><span className="font-medium">Address:</span> {job.propertyAddress}</p>
              <p><span className="font-medium">Estimated Value:</span> {formatCurrency(job.estimatedValue)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">AI Analysis</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">AI estimate available for internal review</p>
              <p className="text-xs text-blue-600 mt-1">Client cannot see this information</p>
            </div>
          </div>
        </div>

        {/* Pricing Review */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Final Pricing
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Price</label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Buffer</label>
              <input
                type="number"
                value={riskBuffer}
                onChange={(e) => setRiskBuffer(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Scope of Work
          </h3>
          
          <div className="space-y-2">
            {scopeOfWork.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newScope = [...scopeOfWork];
                    newScope[index] = e.target.value;
                    setScopeOfWork(newScope);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Completion Timeline</label>
              <select
                value={completionTimeline}
                onChange={(e) => setCompletionTimeline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Same day">Same day</option>
                <option value="1-2 working days">1-2 working days</option>
                <option value="2-3 working days">2-3 working days</option>
                <option value="3-5 working days">3-5 working days</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="siteVisit"
                checked={requiresSiteVisit}
                onChange={(e) => setRequiresSiteVisit(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="siteVisit" className="text-sm text-gray-700">
                Requires site visit before work
              </label>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t pt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Operations Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add any notes for the client or crew..."
          />
        </div>

        {/* Actions */}
        <div className="border-t pt-6 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApprove}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approve & Send Quote
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onReject('Requires further review')}
            className="px-6 py-3 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Reject
          </motion.button>
        </div>
      </div>
    </div>
  );
};