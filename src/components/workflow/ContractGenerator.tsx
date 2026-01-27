import React, { useState } from 'react';
import { Contract, ContractTerms } from '../../types/workflow';

interface ContractGeneratorProps {
  workflowData: any;
  onContractGenerated: (contract: Contract) => void;
}

export const ContractGenerator: React.FC<ContractGeneratorProps> = ({
  workflowData,
  onContractGenerated
}) => {
  const [terms, setTerms] = useState<ContractTerms>({
    cancellationPolicy: '48 hours notice required',
    liabilityLimits: 'Limited to declared value',
    paymentSchedule: '50% deposit, 50% on completion',
    additionalTerms: []
  });

  const generateContract = () => {
    const contract: Contract = {
      id: `contract-${Date.now()}`,
      terms,
      totalAmount: workflowData.customerEstimate?.totalCost || 0,
      scheduledDate: new Date(),
      createdAt: new Date(),
      status: 'draft'
    };
    
    onContractGenerated(contract);
  };

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Contract Generation</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cancellation Policy:
          </label>
          <input
            type="text"
            value={terms.cancellationPolicy}
            onChange={(e) => setTerms({...terms, cancellationPolicy: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Liability Limits:
          </label>
          <input
            type="text"
            value={terms.liabilityLimits}
            onChange={(e) => setTerms({...terms, liabilityLimits: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Payment Schedule:
          </label>
          <input
            type="text"
            value={terms.paymentSchedule}
            onChange={(e) => setTerms({...terms, paymentSchedule: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={generateContract}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Generate Contract
        </button>
      </div>
    </div>
  );
};