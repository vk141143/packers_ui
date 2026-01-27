import React, { useState } from 'react';
import { CheckCircle, XCircle, CreditCard, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Quote {
  id: string;
  price: number;
  deposit: number;
  scope: string;
  timeline: string;
  validUntil: string;
}

interface QuoteApprovalProps {
  quote: Quote;
  onAccept: (quoteId: string) => void;
  onReject: (quoteId: string) => void;
}

export const QuoteApproval: React.FC<QuoteApprovalProps> = ({ quote, onAccept, onReject }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleAccept = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }
    onAccept(quote.id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Quote is Ready</h2>
        <p className="text-gray-600">Please review and accept to proceed</p>
      </div>

      {/* Quote Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="text-2xl font-bold text-gray-900">£{quote.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Deposit Required</p>
            <p className="text-xl font-semibold text-blue-600">£{quote.deposit.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Scope of Work</p>
          <p className="text-gray-900">{quote.scope}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Timeline</p>
            <p className="font-medium">{quote.timeline}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Quote Valid Until</p>
            <p className="font-medium">{new Date(quote.validUntil).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <button
          onClick={() => setShowTerms(!showTerms)}
          className="text-blue-600 hover:text-blue-700 text-sm underline mb-2"
        >
          {showTerms ? 'Hide' : 'View'} Terms and Conditions
        </button>
        
        {showTerms && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-40 overflow-y-auto">
            <h4 className="font-semibold mb-2">Terms and Conditions</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Deposit is required to secure booking</li>
              <li>Final payment due upon completion</li>
              <li>24-hour cancellation notice required</li>
              <li>Additional charges may apply for extra items discovered on-site</li>
              <li>We reserve the right to refuse hazardous materials</li>
            </ul>
          </div>
        )}
        
        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">I accept the terms and conditions</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onReject(quote.id)}
          className="flex-1 px-6 py-3 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 font-semibold"
        >
          <XCircle size={20} />
          Decline Quote
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAccept}
          disabled={!acceptedTerms}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
        >
          <CheckCircle size={20} />
          Accept & Pay Deposit
        </motion.button>
      </div>

      {quote.deposit > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <CreditCard size={16} />
            <span className="text-sm font-medium">Next Step: Deposit Payment</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            After accepting, you'll be redirected to pay the £{quote.deposit} deposit to secure your booking.
          </p>
        </div>
      )}
    </div>
  );
};