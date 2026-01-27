import React, { useState } from 'react';
import { WorkflowData, AIEstimate } from '../../types/workflow';

interface AIEstimateGeneratorProps {
  workflowData: WorkflowData;
  onEstimateGenerated: (estimate: AIEstimate) => void;
}

export const AIEstimateGenerator: React.FC<AIEstimateGeneratorProps> = ({
  workflowData,
  onEstimateGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEstimate = async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const estimate: AIEstimate = {
      id: `ai-${Date.now()}`,
      totalCost: Math.floor(Math.random() * 5000) + 1000,
      laborHours: Math.floor(Math.random() * 20) + 10,
      materials: [
        { name: 'Boxes', quantity: 50, unitCost: 2 },
        { name: 'Bubble Wrap', quantity: 10, unitCost: 15 }
      ],
      confidence: 0.85,
      generatedAt: new Date(),
      analysisFactors: ['Room count', 'Furniture density', 'Distance']
    };
    
    onEstimateGenerated(estimate);
    setIsGenerating(false);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">AI Estimate Generator</h3>
      <div className="space-y-2 mb-4">
        <p>Photos: {workflowData.photos.length}</p>
        <p>Property: {workflowData.propertyDetails.address}</p>
      </div>
      <button
        onClick={generateEstimate}
        disabled={isGenerating}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate AI Estimate'}
      </button>
    </div>
  );
};