export interface AIAnalysis {
  estimatedVanLoads: number;
  riskFlags: string[];
  suggestedPriceRange: {
    min: number;
    max: number;
  };
  wasteClassification: string[];
  accessRisk: 'low' | 'medium' | 'high';
  requiresSiteVisit: boolean;
}

export interface QuoteRequest {
  id: string;
  propertyAddress: string;
  propertySize: string;
  wasteTypes: string[];
  photos: string[];
  accessNotes: string;
  urgency: string;
  clientId: string;
  createdAt: string;
  status: 'pending-ai-analysis' | 'pending-ops-review' | 'quote-sent' | 'accepted' | 'rejected';
  aiAnalysis?: AIAnalysis;
  finalQuote?: {
    price: number;
    deposit: number;
    scope: string;
    timeline: string;
  };
}

// AI Analysis Service (Internal Only)
export const generateAIAnalysis = async (request: Partial<QuoteRequest>): Promise<AIAnalysis> => {
  // Simulate AI analysis based on property data
  const baseLoads = {
    'studio': 1,
    '2bed': 2,
    '3bed': 3,
    '4bed': 4
  }[request.propertySize || '2bed'] || 2;

  const riskFlags: string[] = [];
  let accessRisk: 'low' | 'medium' | 'high' = 'low';
  let requiresSiteVisit = false;

  // Analyze waste types for risks
  if (request.wasteTypes?.includes('hazardous')) {
    riskFlags.push('hazardous-waste');
    requiresSiteVisit = true;
  }
  if (request.wasteTypes?.includes('furniture')) {
    riskFlags.push('heavy-items');
  }

  // Analyze access notes for risks
  if (request.accessNotes?.toLowerCase().includes('stairs')) {
    accessRisk = 'medium';
    riskFlags.push('stairs-access');
  }
  if (request.accessNotes?.toLowerCase().includes('parking')) {
    accessRisk = 'high';
    riskFlags.push('parking-restrictions');
  }

  // Calculate price range (internal only)
  const basePrice = 250 + (baseLoads * 150);
  const riskMultiplier = accessRisk === 'high' ? 1.5 : accessRisk === 'medium' ? 1.3 : 1.0;
  const urgencyMultiplier = request.urgency === '24h' ? 1.8 : request.urgency === '48h' ? 1.4 : 1.0;

  const estimatedPrice = basePrice * riskMultiplier * urgencyMultiplier;

  return {
    estimatedVanLoads: baseLoads + (riskFlags.length > 2 ? 1 : 0),
    riskFlags,
    suggestedPriceRange: {
      min: Math.round(estimatedPrice * 0.8),
      max: Math.round(estimatedPrice * 1.2)
    },
    wasteClassification: request.wasteTypes || ['general'],
    accessRisk,
    requiresSiteVisit
  };
};