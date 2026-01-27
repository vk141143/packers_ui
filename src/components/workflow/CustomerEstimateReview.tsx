import React, { useState } from 'react';
import { CustomerEstimate, EstimateApproval } from '../../types/workflow';

interface CustomerEstimateReviewProps {
  estimate: CustomerEstimate;
  onApproval: (approval: EstimateApproval) => void;
}

export const CustomerEstimateReview: React.FC<CustomerEstimateReviewProps> = ({
  estimate,
  onApproval
}) => {
  const [feedback, setFeedback] = useState('');

  const handleApproval = (approved: boolean) => {
    const approval: EstimateApproval = {
      approved,
      feedback: feedback.trim() || undefined,
      approvedAt: new Date()
    };
    onApproval(approval);
  };

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Estimate Review</h3>
      
      <div className="bg-gray-50 p-4 rounded mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Total Cost: ${estimate.totalCost}</p>
            <p>Labor Hours: {estimate.laborHours}</p>
          </div>
          <div>
            <p>Valid Until: {estimate.validUntil.toLocaleDateString()}</p>
            <p>Payment Terms: {estimate.paymentTerms}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Services Included:</h4>
        <ul className="list-disc list-inside space-y-1">
          {estimate.services.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Feedback (Optional):
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Any questions or concerns about this estimate..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleApproval(true)}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Approve Estimate
        </button>
        <button
          onClick={() => handleApproval(false)}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Request Changes
        </button>
      </div>
    </div>
  );
};