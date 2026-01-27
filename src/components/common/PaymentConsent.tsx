import React, { useState } from 'react';
import { AlertTriangle, Shield, Lock } from 'lucide-react';
import { BookingStatus } from '../types/booking';
import { useJobPermissions } from '../hooks/useJobPermissions';

interface PaymentConsentProps {
  bookingId: string;
  amount: number;
  status: BookingStatus;
  userRole: string;
  onPaymentConfirm: (consentData: ConsentData) => void;
  isProcessing?: boolean;
}

interface ConsentData {
  consentAccepted: boolean;
  timestamp: string;
  policyVersion: string;
  ipAddress?: string;
  userAgent?: string;
}

export const PaymentConsent: React.FC<PaymentConsentProps> = ({
  bookingId,
  amount,
  status,
  userRole,
  onPaymentConfirm,
  isProcessing = false
}) => {
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const permissions = useJobPermissions(status, userRole as any);

  // Block payment if not allowed by status/role
  if (!permissions.canPay) {
    return (
      <div className=\"bg-red-50 border border-red-200 rounded-lg p-4\">
        <div className=\"flex items-center gap-2 text-red-700\">
          <Lock size={20} />
          <span className=\"font-medium\">Payment Not Available</span>
        </div>
        <p className=\"text-red-600 text-sm mt-1\">
          Payment is not available for the current booking status.
        </p>
      </div>
    );\n  }\n\n  const handlePayment = () => {\n    if (!consentAccepted) {\n      alert('Please accept the terms and conditions before proceeding.');\n      return;\n    }\n\n    const consentData: ConsentData = {\n      consentAccepted: true,\n      timestamp: new Date().toISOString(),\n      policyVersion: '1.0',\n      ipAddress: 'client-ip', // Would be populated by backend\n      userAgent: navigator.userAgent\n    };\n\n    onPaymentConfirm(consentData);\n  };\n\n  return (\n    <div className=\"bg-white border border-gray-200 rounded-lg p-6\">\n      <div className=\"flex items-center gap-3 mb-4\">\n        <Shield className=\"text-blue-600\" size={24} />\n        <h3 className=\"text-lg font-semibold\">Payment Authorization</h3>\n      </div>\n\n      <div className=\"bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6\">\n        <div className=\"flex items-start gap-3\">\n          <AlertTriangle className=\"text-yellow-600 mt-0.5\" size={20} />\n          <div>\n            <h4 className=\"font-medium text-yellow-800 mb-2\">Important Notice</h4>\n            <p className=\"text-yellow-700 text-sm leading-relaxed\">\n              By proceeding with payment, you acknowledge that this booking becomes \n              <strong> non-cancellable and non-refundable</strong>. Please ensure all \n              details are correct before confirming payment.\n            </p>\n          </div>\n        </div>\n      </div>\n\n      <div className=\"space-y-4 mb-6\">\n        <div className=\"flex justify-between items-center p-3 bg-gray-50 rounded-lg\">\n          <span className=\"font-medium\">Payment Amount:</span>\n          <span className=\"text-xl font-bold text-green-600\">£{amount.toFixed(2)}</span>\n        </div>\n        \n        <div className=\"flex justify-between items-center p-3 bg-gray-50 rounded-lg\">\n          <span className=\"font-medium\">Booking Reference:</span>\n          <span className=\"font-mono text-sm\">{bookingId}</span>\n        </div>\n      </div>\n\n      <div className=\"border-t pt-4\">\n        <label className=\"flex items-start gap-3 cursor-pointer\">\n          <input\n            type=\"checkbox\"\n            checked={consentAccepted}\n            onChange={(e) => setConsentAccepted(e.target.checked)}\n            className=\"mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded\"\n          />\n          <div className=\"text-sm\">\n            <p className=\"text-gray-700\">\n              I understand and agree that this booking is{' '}\n              <strong>non-cancellable and non-refundable</strong> after payment. \n              I have reviewed all booking details and confirm they are correct.\n            </p>\n            <button\n              type=\"button\"\n              onClick={() => setShowTerms(!showTerms)}\n              className=\"text-blue-600 hover:text-blue-800 underline mt-1\"\n            >\n              View full terms and conditions\n            </button>\n          </div>\n        </label>\n\n        {showTerms && (\n          <div className=\"mt-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 max-h-40 overflow-y-auto\">\n            <h5 className=\"font-semibold mb-2\">Terms and Conditions</h5>\n            <ul className=\"space-y-1 list-disc list-inside\">\n              <li>Payment confirms booking and makes it legally binding</li>\n              <li>No cancellations or refunds after payment confirmation</li>\n              <li>Service will be provided as per agreed specifications</li>\n              <li>Additional charges may apply for scope changes</li>\n              <li>Customer responsible for property access on scheduled date</li>\n              <li>Force majeure events may require rescheduling</li>\n            </ul>\n          </div>\n        )}\n      </div>\n\n      <div className=\"flex gap-3 mt-6\">\n        <button\n          onClick={handlePayment}\n          disabled={!consentAccepted || isProcessing}\n          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${\n            consentAccepted && !isProcessing\n              ? 'bg-green-600 hover:bg-green-700 text-white'\n              : 'bg-gray-300 text-gray-500 cursor-not-allowed'\n          }`}\n        >\n          {isProcessing ? (\n            <div className=\"flex items-center justify-center gap-2\">\n              <div className=\"animate-spin rounded-full h-4 w-4 border-b-2 border-white\"></div>\n              Processing...\n            </div>\n          ) : (\n            `Confirm Payment - £${amount.toFixed(2)}`\n          )}\n        </button>\n      </div>\n    </div>\n  );\n};