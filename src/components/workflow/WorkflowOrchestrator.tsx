import React, { useState } from 'react';
import { WorkflowData, WorkflowStage } from '../../types/workflow';
import { AIEstimateGenerator } from './AIEstimateGenerator';
import { CustomerEstimateReview } from './CustomerEstimateReview';
import { ContractGenerator } from './ContractGenerator';
import { OperationsApproval } from './OperationsApproval';

export const WorkflowOrchestrator: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<WorkflowStage>('photo_upload');
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    id: `workflow-${Date.now()}`,
    customerId: 'customer-123',
    currentStage: 'photo_upload',
    createdAt: new Date(),
    photos: [],
    propertyDetails: {
      address: '',
      propertyType: 'house',
      rooms: 0,
      squareFootage: 0,
      accessibilityNotes: ''
    }
  });

  const stages: { key: WorkflowStage; label: string }[] = [
    { key: 'photo_upload', label: 'Photo Upload' },
    { key: 'ai_estimate', label: 'AI Estimate' },
    { key: 'operations_review', label: 'Operations Review' },
    { key: 'customer_estimate', label: 'Customer Estimate' },
    { key: 'customer_approval', label: 'Customer Approval' },
    { key: 'contract_generation', label: 'Contract Generation' },
    { key: 'scheduling', label: 'Scheduling' },
    { key: 'completion', label: 'Completion' }
  ];

  const renderStageContent = () => {
    switch (currentStage) {
      case 'ai_estimate':
        return (
          <AIEstimateGenerator
            workflowData={workflowData}
            onEstimateGenerated={(estimate) => {
              setWorkflowData({...workflowData, aiEstimate: estimate});
              setCurrentStage('operations_review');
            }}
          />
        );
      
      case 'operations_review':
        return (
          <OperationsApproval
            estimate={workflowData.aiEstimate!}
            onApproval={(approved) => {
              if (approved) {
                setCurrentStage('customer_estimate');
              }
            }}
          />
        );
      
      case 'customer_approval':
        return workflowData.customerEstimate ? (
          <CustomerEstimateReview
            estimate={workflowData.customerEstimate}
            onApproval={(approval) => {
              setWorkflowData({
                ...workflowData,
                estimateApproval: approval
              });
              if (approval.approved) {
                setCurrentStage('contract_generation');
              }
            }}
          />
        ) : null;
      
      case 'contract_generation':
        return (
          <ContractGenerator
            workflowData={workflowData}
            onContractGenerated={(contract) => {
              setWorkflowData({...workflowData, contract});
              setCurrentStage('scheduling');
            }}
          />
        );
      
      default:
        return (
          <div className="p-4 text-center">
            <p>Stage: {currentStage}</p>
            <button
              onClick={() => {
                const currentIndex = stages.findIndex(s => s.key === currentStage);
                if (currentIndex < stages.length - 1) {
                  setCurrentStage(stages[currentIndex + 1].key);
                }
              }}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next Stage
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Moving Workflow</h1>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {stages.map((stage, index) => (
            <div
              key={stage.key}
              className={`flex-1 text-center ${
                stages.findIndex(s => s.key === currentStage) >= index
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 mx-auto rounded-full border-2 ${
                stages.findIndex(s => s.key === currentStage) >= index
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300'
              } flex items-center justify-center text-sm font-medium`}>
                {index + 1}
              </div>
              <p className="text-xs mt-1">{stage.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Content */}
      <div className="bg-white rounded-lg shadow">
        {renderStageContent()}
      </div>
    </div>
  );
};