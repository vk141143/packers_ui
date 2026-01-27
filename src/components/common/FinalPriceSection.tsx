import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, AlertCircle, Edit3 } from 'lucide-react';
import { Job } from '../../types';

interface FinalPriceSectionProps {
  job: Job;
  onUpdateFinalPrice?: (amount: number) => void;
  readOnly?: boolean;
}

export const FinalPriceSection: React.FC<FinalPriceSectionProps> = ({ 
  job, 
  onUpdateFinalPrice,
  readOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState('');

  // Use accepted quote amount as the definitive total
  const acceptedQuoteAmount = job.finalQuote?.fixedPrice || 0;
  const depositPaid = job.finalQuote?.depositAmount || 0;
  const remainingAmount = acceptedQuoteAmount - depositPaid;

  const handleEdit = () => {
    setEditAmount(remainingAmount.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount >= 0 && onUpdateFinalPrice) {
      onUpdateFinalPrice(amount);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditAmount('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Payment Breakdown
        </h3>
        {acceptedQuoteAmount > 0 && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Quote Accepted</span>
          </div>
        )}
      </div>

      {acceptedQuoteAmount > 0 ? (
        <div className="space-y-4">
          {/* Accepted Quote Amount */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-green-800 font-medium">Accepted Quote Amount:</span>
              <span className="text-2xl font-bold text-green-600">£{acceptedQuoteAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Deposit Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-medium">Deposit Paid:</span>
              <span className="text-xl font-bold text-blue-600">£{depositPaid.toFixed(2)}</span>
            </div>
          </div>

          {/* Final Price Section */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-orange-800 font-medium">Remaining Amount Due:</span>
                <p className="text-xs text-orange-600 mt-1">
                  This is the final amount the client needs to pay
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                      step="0.01"
                      min="0"
                    />
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-600">£{remainingAmount.toFixed(2)}</span>
                    {!readOnly && onUpdateFinalPrice && (
                      <button
                        onClick={handleEdit}
                        className="p-1 text-gray-400 hover:text-orange-600"
                        title="Edit final amount"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Quote Amount:</span>
                <span>£{acceptedQuoteAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Deposit Paid:</span>
                <span>-£{depositPaid.toFixed(2)}</span>
              </div>
              <div className="border-t pt-1 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Client Owes:</span>
                  <span>£{remainingAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Quote Accepted Yet</h4>
          <p className="text-gray-500">
            The client needs to accept a quote before final pricing can be determined.
          </p>
        </div>
      )}
    </motion.div>
  );
};